/**
 * UET-LMS Scraper
 * Login flow: UET-LMS → Google SAML → VNU Keycloak → Canvas API
 */

import { chromium } from "playwright";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __dir      = dirname(fileURLToPath(import.meta.url));
const LMS_URL    = "https://portal.uet.vnu.edu.vn/uet-lms";
const PORTAL     = "https://portal.uet.vnu.edu.vn";
const API_BASE   = `${PORTAL}/api/v1`; // Canvas API ở root, không phải /uet-lms/
const SESSION_FILE = resolve(__dir, process.env.SESSION_FILE ?? "./session.json");
const OUTPUT_FILE  = resolve(__dir, process.env.OUTPUT_FILE  ?? "../public/lms-data.json");
const FILES_DIR    = resolve(__dir, "../public/lms-files");
const HEADLESS   = (process.env.BROWSER_MODE ?? "headless") === "headless";

function log(msg) {
  console.log(`[${new Date().toLocaleTimeString("vi-VN")}] ${msg}`);
}

// ─── Session ──────────────────────────────────────────────────────────────────

function saveSession(cookies) {
  writeFileSync(SESSION_FILE, JSON.stringify(cookies, null, 2));
}

function loadSession() {
  if (!existsSync(SESSION_FILE)) return null;
  try { return JSON.parse(readFileSync(SESSION_FILE, "utf8")); } catch { return null; }
}

// ─── Login ────────────────────────────────────────────────────────────────────

async function doLogin(page) {
  const email    = process.env.UET_EMAIL ?? "";
  const password = process.env.UET_PASSWORD ?? "";
  const vnu_user = email.includes("@") ? email.split("@")[0] : email; // "25022983"

  if (!email || !password) throw new Error("Chưa điền UET_EMAIL / UET_PASSWORD trong bot/.env");

  log("Mở trang LMS...");
  await page.goto(LMS_URL, { waitUntil: "networkidle", timeout: 20000 });

  // ── Bước 1: Click SAML (fire-and-forget, rồi chờ timeout) ──
  log("Click nút đăng nhập VNU mail...");
  const samlBtn = page.locator('a[href*="saml"]').first();
  await samlBtn.waitFor({ timeout: 10000 });
  samlBtn.click(); // KHÔNG await — để redirect chain chạy tự nhiên
  await page.waitForTimeout(5000); // đủ thời gian qua hết redirects Google
  log(`Sau click SAML: ${page.url().slice(0, 70)}`);

  // ── Bước 2: Google sign-in — nhập email ──
  if (page.url().includes("accounts.google.com")) {
    log("Google: nhập email...");
    const emailInput = page.locator('input[name="identifier"]').first();
    await emailInput.waitFor({ timeout: 10000 });
    await emailInput.fill(email);
    await emailInput.press("Enter");
    await page.waitForTimeout(4000); // đủ thời gian redirect sang Keycloak
    log(`Sau Google Enter: ${page.url().slice(0, 70)}`);
  }

  // ── Bước 3: VNU Keycloak — điền username + password ──
  if (page.url().includes("idp.vnu.edu.vn")) {
    log("VNU Keycloak: điền credentials...");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(500);

    const usernameInput = page.locator('input[name="username"]').first();
    if (await usernameInput.count() > 0) {
      const val = await usernameInput.inputValue().catch(() => "");
      if (!val) await usernameInput.fill(vnu_user);
      log(`  username: ${val || vnu_user}`);
    }

    const passInput = page.locator('input[name="password"]').first();
    await passInput.waitFor({ timeout: 8000 });
    await passInput.fill(password);

    // Submit — redirect có thể về Gmail, đó là bình thường
    page.locator('input[id="kc-login"], input[type="submit"]').first().click();
    await page.waitForTimeout(6000); // chờ redirect chain (Keycloak → Google ACS → Gmail)
    log(`Sau Keycloak submit: ${page.url().slice(0, 70)}`);
  }

  // ── Bước 4: Google session thiết lập — quay lại UET-LMS ──
  if (!page.url().includes("portal.uet.vnu.edu.vn")) {
    log("Google session sẵn. Quay lại UET-LMS...");
    await page.goto(LMS_URL, { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(2000);
    log(`LMS URL: ${page.url().slice(0, 70)}`);

    // Nếu LMS vẫn hiện trang login → click SAML lần 2 (Google tự hoàn tất)
    const samlBtn2 = page.locator('a[href*="saml"]').first();
    if (await samlBtn2.count() > 0) {
      log("Click SAML lần 2 (Google đã có session)...");
      samlBtn2.click();
      // Chờ redirect về LMS dashboard (không qua Keycloak nữa)
      await page.waitForURL(/portal\.uet\.vnu\.edu\.vn/, { timeout: 25000 });
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(3000);
    }

    log(`Kết quả cuối: ${page.url().slice(0, 70)}`);
  }

  log("✅ Đăng nhập thành công!");
}

// ─── Session check ────────────────────────────────────────────────────────────

async function isLoggedIn(page) {
  try {
    const data = await page.evaluate(async (url) => {
      const r = await fetch(url, { credentials: "include" });
      return { ok: r.ok, status: r.status };
    }, `${API_BASE}/users/self`);
    return data.ok;
  } catch { return false; }
}

// ─── Canvas REST API ──────────────────────────────────────────────────────────

async function apiGet(page, path, params = {}) {
  const qs = new URLSearchParams({ per_page: "100", ...params }).toString();
  const url = `${API_BASE}${path}?${qs}`;

  const result = await page.evaluate(async (fetchUrl) => {
    const r = await fetch(fetchUrl, { credentials: "include" });
    if (!r.ok) return { error: r.status };
    return r.json();
  }, url);

  if (result?.error) {
    log(`API ${path} → ${result.error}`);
    return [];
  }
  return result;
}

// ─── Scrape ───────────────────────────────────────────────────────────────────

async function scrapeCourses(page) {
  log("Lấy danh sách môn học qua Canvas API...");
  const data = await apiGet(page, "/courses", { enrollment_state: "active" });
  if (!Array.isArray(data)) return [];

  const courses = data
    .filter(c => c.workflow_state === "available" || c.enrollments?.length)
    .map(c => ({ id: String(c.id), code: c.course_code ?? c.id, name: c.name }));

  log(`Tìm thấy ${courses.length} môn học.`);
  return courses;
}

async function scrapeAssignments(page, courses) {
  log("Lấy bài tập từng môn...");
  const all = [];

  for (const course of courses) {
    const data = await apiGet(page, `/courses/${course.id}/assignments`);
    if (!Array.isArray(data)) continue;

    const items = data.map(a => {
      // Xác định type từ submission_types
      const types = a.submission_types ?? [];
      let type = "essay";
      if (types.includes("online_quiz") || a.is_quiz_assignment) type = "quiz";
      else if (types.includes("external_tool"))                   type = "lab";
      else if (types.includes("discussion_topic"))                type = "reading";
      else if (a.points_possible >= 30)                          type = "project";

      // Lấy trạng thái nộp bài
      const done = a.submission?.workflow_state === "submitted"
                || a.submission?.workflow_state === "graded"
                || a.has_submitted_submissions === true;

      return {
        id:          String(a.id),
        subject:     course.name,
        subjectCode: course.code,
        title:       a.name,
        due:         a.due_at ? a.due_at.split("T")[0] : "2099-12-31",
        type,
        points:      a.points_possible ?? 0,
        done,
      };
    }).filter(a => a.due !== "2099-12-31" || !a.done); // bỏ bài không deadline và chưa làm

    log(`  └─ ${course.name}: ${items.length} bài tập`);
    all.push(...items);
  }

  return all;
}

function classifyFile(name) {
  const ext = (name ?? "").split(".").pop()?.toLowerCase() ?? "";
  if (["pdf"].includes(ext))                         return "pdf";
  if (["doc","docx"].includes(ext))                  return "doc";
  if (["xls","xlsx"].includes(ext))                  return "excel";
  if (["ppt","pptx"].includes(ext))                  return "ppt";
  if (["zip","rar","7z"].includes(ext))              return "zip";
  if (["jpg","jpeg","png","gif"].includes(ext))       return "image";
  return "file";
}

async function scrapeFiles(page, courses) {
  log("Lấy file bài tập từng môn...");
  const all = [];

  for (const course of courses) {
    const items = [];

    // Chỉ dùng modules API để giữ thứ tự chương/phần
    // Chỉ lấy item có "bài tập" trong tên (lọc bỏ bài giảng, video...)
    const modules = await apiGet(page, `/courses/${course.id}/modules`);
    if (!Array.isArray(modules)) {
      log(`  └─ ${course.name}: 0 bài tập`);
      continue;
    }

    for (const mod of modules) {
      const modItems = await apiGet(page, `/courses/${course.id}/modules/${mod.id}/items`);
      if (!Array.isArray(modItems)) continue;

      for (const item of modItems) {
        if (item.type === "SubHeader") continue;

        // Chỉ lấy những item có từ khoá bài tập trong tiêu đề
        const titleLower = (item.title ?? "").toLowerCase();
        const isBaiTap = titleLower.includes("bài tập") || titleLower.includes("bai tap")
          || titleLower.includes("thực hành") || titleLower.includes("thuc hanh")
          || titleLower.includes("exercise") || titleLower.includes("assignment")
          || titleLower.includes("homework")  || titleLower.includes("lab ")
          || titleLower.includes("practice")  || titleLower.includes("kiểm tra");
        if (!isBaiTap) continue;

        let name        = item.title ?? "";
        let url         = item.html_url ?? item.external_url ?? "";
        let size        = 0;
        let fileType    = "file";
        let description = "";

        if (item.type === "File" && item.url) {
          try {
            const meta = await apiGet(page, item.url.replace(/.*\/api\/v1/, ""));
            if (meta && !meta.errors) {
              name     = meta.display_name ?? meta.filename ?? name;
              url      = meta.url ?? meta.html_url ?? url;
              size     = meta.size ?? 0;
            }
          } catch {}
          fileType = classifyFile(name);
        } else if (item.type === "Assignment") {
          fileType = "essay";
          // Lấy nội dung đề bài từ Canvas API
          if (item.content_id) {
            try {
              const asgn = await apiGet(page, `/courses/${course.id}/assignments/${item.content_id}`);
              if (asgn && !asgn.errors) {
                description = asgn.description ?? "";
              }
            } catch {}
          }
        } else if (item.type === "ExternalUrl" || item.type === "ExternalTool") {
          fileType = "link";
        }

        items.push({
          id:          `mod-${item.id}`,
          subject:     course.name,
          subjectCode: course.code,
          name,
          url,
          fileType,
          size,
          createdAt:   "",
          module:      mod.name ?? "",
          description,
        });
      }
    }

    // Fallback: nếu modules không có bài tập → tìm trong /files API
    if (items.length === 0) {
      const filesData = await apiGet(page, `/courses/${course.id}/files`, {
        sort: "display_name", order: "asc",
      });
      if (Array.isArray(filesData)) {
        filesData.forEach(f => {
          const name = f.display_name ?? f.filename ?? "";
          const nameLower = name.toLowerCase();
          const isBaiTap = nameLower.includes("bài tập") || nameLower.includes("bai tap")
            || nameLower.includes("exercise") || nameLower.includes("assignment")
            || nameLower.includes("homework")  || nameLower.includes("thực hành")
            || nameLower.includes("lab_")      || nameLower.includes("lab ");
          if (!name || !isBaiTap) return;
          items.push({
            id:          `file-${f.id}`,
            subject:     course.name,
            subjectCode: course.code,
            name,
            url:         f.url ?? f.html_url ?? "",
            fileType:    classifyFile(name),
            size:        f.size ?? 0,
            createdAt:   f.created_at ?? "",
            module:      "",
          });
        });
      }
    }

    log(`  └─ ${course.name}: ${items.length} bài tập`);
    all.push(...items);
  }

  return all;
}

async function scrapeNotifications(page, courses) {
  log("Lấy thông báo (announcements)...");
  const notifs = [];

  for (const course of courses.slice(0, 6)) {
    const data = await apiGet(page, `/courses/${course.id}/discussion_topics`, { only_announcements: "true" });
    if (!Array.isArray(data)) continue;

    data.slice(0, 4).forEach((ann, i) => {
      const postedAt = ann.posted_at ?? ann.created_at ?? "";
      const timeStr  = postedAt ? formatRelativeTime(new Date(postedAt)) : "";
      notifs.push({
        id:      `ann-${course.id}-${ann.id}`,
        type:    "update",
        subject: course.name,
        message: ann.title,
        time:    timeStr,
        read:    false,
        url:     `${LMS_URL}/courses/${course.id}/discussion_topics/${ann.id}`,
      });
    });
  }

  // Thêm upcoming deadline reminders
  return notifs;
}

function formatRelativeTime(date) {
  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1)  return "Vừa xong";
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 7)   return `${days} ngày trước`;
  return date.toLocaleDateString("vi-VN");
}

// ─── File downloader ──────────────────────────────────────────────────────────

async function downloadFiles(page, items) {
  mkdirSync(FILES_DIR, { recursive: true });
  const downloadable = new Set(["pdf", "doc", "excel", "ppt", "zip", "image"]);
  let downloaded = 0;

  for (const item of items) {
    if (!downloadable.has(item.fileType)) continue;
    if (!item.url || !item.url.startsWith("http")) continue;

    // Tên file an toàn: id + tên gốc (bỏ ký tự không hợp lệ filesystem)
    const safeName = item.id.replace(/[^a-zA-Z0-9_-]/g, "_") + "_" + item.name.replace(/[/\\:*?"<>|]/g, "_");
    const filePath = resolve(FILES_DIR, safeName);

    // Đã có → chỉ gán localPath, không tải lại
    if (existsSync(filePath)) {
      item.localPath = `/lms-files/${safeName}`;
      continue;
    }

    try {
      const resp = await page.context().request.get(item.url, { timeout: 30000 });
      if (resp.ok()) {
        const buffer = await resp.body();
        writeFileSync(filePath, buffer);
        item.localPath = `/lms-files/${safeName}`;
        downloaded++;
        log(`  ↓ ${item.name} (${(buffer.length / 1024).toFixed(0)} KB)`);
      }
    } catch (e) {
      log(`  ⚠ Không tải được ${item.name}: ${e.message?.slice(0, 60)}`);
    }
  }

  // Xử lý description: tìm link file Canvas trong HTML và thay bằng local path
  for (const item of items) {
    if (!item.description) continue;

    // Tìm href="https://portal.uet.vnu.edu.vn/courses/.../files/:id..."
    const fileRe = /href="(https:\/\/portal\.uet\.vnu\.edu\.vn\/courses\/\d+\/files\/(\d+)[^"]*?)"/g;
    let match;
    let desc = item.description;

    while ((match = fileRe.exec(item.description)) !== null) {
      const canvasUrl = match[1];
      const fileId    = match[2];
      const localKey  = `desc-${fileId}`;
      const cachedFile = resolve(FILES_DIR, localKey);

      // Kiểm tra cache (chưa biết tên, tìm theo prefix)
      const existing = existsSync(cachedFile + ".meta")
        ? readFileSync(cachedFile + ".meta", "utf8").trim()
        : null;

      if (existing) {
        desc = desc.replace(canvasUrl, `/lms-files/${existing}`);
        continue;
      }

      try {
        // Lấy metadata để biết tên và URL tải
        const meta = await apiGet(page, `/files/${fileId}`);
        if (!meta || meta.errors) continue;

        const fname   = meta.display_name ?? meta.filename ?? fileId;
        const safeFn  = `desc-${fileId}_${fname.replace(/[/\\:*?"<>|]/g, "_")}`;
        const fpath   = resolve(FILES_DIR, safeFn);

        if (!existsSync(fpath)) {
          const dlUrl = meta.url ?? canvasUrl;
          const resp  = await page.context().request.get(dlUrl, { timeout: 30000 });
          if (resp.ok()) {
            writeFileSync(fpath, await resp.body());
            downloaded++;
            log(`  ↓ (description) ${fname}`);
          }
        }

        // Lưu meta cache
        writeFileSync(cachedFile + ".meta", safeFn);
        desc = desc.replace(canvasUrl, `/lms-files/${safeFn}`);
      } catch {}
    }

    // Xử lý Google Drive links
    const gdRe = /href="(https:\/\/drive\.google\.com\/file\/d\/([^\/]+)\/[^"]*?)"/g;
    let gdMatch;
    while ((gdMatch = gdRe.exec(item.description)) !== null) {
      const driveViewUrl = gdMatch[1];
      const gid          = gdMatch[2];
      const cacheKey     = resolve(FILES_DIR, `gdrive-${gid}.meta`);

      // Cache hit
      if (existsSync(cacheKey)) {
        const cached = readFileSync(cacheKey, "utf8").trim();
        desc = desc.replace(driveViewUrl, `/lms-files/${cached}`);
        continue;
      }

      try {
        const dlUrl = `https://drive.google.com/uc?export=download&id=${gid}`;
        const resp  = await page.context().request.get(dlUrl, { timeout: 30000 });
        const ct    = resp.headers()["content-type"] ?? "";
        if (resp.ok() && !ct.includes("text/html")) {
          const buf = await resp.body();
          // Detect by magic bytes
          const sig = buf.slice(0, 4).toString("utf8");
          const ext = sig.startsWith("%PDF") ? "pdf"
            : sig.startsWith("PK") ? "docx"  // Office Open XML (docx/xlsx/pptx)
            : ct.includes("pdf") ? "pdf"
            : ct.includes("msword") || ct.includes("openxml") ? "docx"
            : "bin";
          const safeFn = `gdrive-${gid}.${ext}`;
          writeFileSync(resolve(FILES_DIR, safeFn), buf);
          writeFileSync(cacheKey, safeFn);
          desc = desc.replace(driveViewUrl, `/lms-files/${safeFn}`);
          downloaded++;
          log(`  ↓ (Drive) ${safeFn}`);
        }
      } catch {}
    }

    // Bỏ class inline_disabled của Canvas để link luôn bấm được
    desc = desc.replace(/\s*inline_disabled\s*/g, " ").replace(/class=" "/g, "");

    item.description = desc;
  }

  if (downloaded > 0) log(`  📁 Đã tải ${downloaded} file mới vào /public/lms-files/`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export async function runScraper() {
  const browser = await chromium.launch({
    headless: HEADLESS,
    args: ["--no-sandbox", "--disable-blink-features=AutomationControlled"],
  });

  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    locale: "vi-VN",
    viewport: { width: 1280, height: 800 },
  });

  const savedCookies = loadSession();
  if (savedCookies?.length) {
    await context.addCookies(savedCookies);
    log("Tải session cũ.");
  }

  const page = await context.newPage();

  try {
    // Vào trang LMS để check session
    await page.goto(LMS_URL, { waitUntil: "networkidle", timeout: 20000 });

    const loggedIn = await isLoggedIn(page);

    if (!loggedIn) {
      log("Chưa đăng nhập, tiến hành login...");
      await doLogin(page);
      const cookies = await context.cookies();
      saveSession(cookies);
      log("Đã lưu session mới.");
    } else {
      log("Session hợp lệ, bỏ qua đăng nhập.");
    }

    // Scrape
    const courses       = await scrapeCourses(page);
    const assignments   = await scrapeAssignments(page, courses);
    const notifications = await scrapeNotifications(page, courses);
    const files         = await scrapeFiles(page, courses);
    await downloadFiles(page, files);

    // Giữ trạng thái done của user (localStorage > LMS)
    let oldDoneMap = {};
    if (existsSync(OUTPUT_FILE)) {
      try {
        const old = JSON.parse(readFileSync(OUTPUT_FILE, "utf8"));
        (old.assignments ?? []).forEach(a => { oldDoneMap[a.id] = a.done; });
      } catch {}
    }

    const mergedAssignments = assignments.map(a => ({
      ...a,
      done: (a.id in oldDoneMap) ? oldDoneMap[a.id] : a.done,
    }));

    // Giữ thông báo cũ (đã đọc) + thêm mới
    let oldNotifs = [];
    try {
      const old = JSON.parse(readFileSync(OUTPUT_FILE, "utf8"));
      oldNotifs = (old.notifications ?? []).map(n => ({ ...n, read: true }));
    } catch {}
    const existingIds = new Set(oldNotifs.map(n => n.id));
    const merged_notifs = [
      ...notifications.filter(n => !existingIds.has(n.id)),
      ...oldNotifs,
    ].slice(0, 30);

    const output = {
      lastUpdated:   new Date().toISOString(),
      courses,
      assignments:   mergedAssignments,
      notifications: merged_notifs,
      files,
    };

    writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    log(`✅ Lưu vào ${OUTPUT_FILE}`);
    log(`   ${courses.length} môn · ${mergedAssignments.length} bài tập · ${notifications.length} thông báo mới · ${files.length} file`);

    return output;
  } catch (err) {
    log(`❌ Lỗi: ${err.message}`);
    // Reset session nếu lỗi auth
    if (/login|auth|credential|unauthorized/i.test(err.message)) {
      writeFileSync(SESSION_FILE, "[]");
    }
    throw err;
  } finally {
    await browser.close();
  }
}

// Chạy trực tiếp
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runScraper().catch(err => { console.error(err); process.exit(1); });
}
