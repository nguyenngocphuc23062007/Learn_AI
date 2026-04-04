/**
 * Script debug: chụp ảnh + dump HTML trang courses và assignments
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __dir = dirname(fileURLToPath(import.meta.url));
const LMS_URL = "https://portal.uet.vnu.edu.vn/uet-lms";
const SESSION_FILE = resolve(__dir, "./session.json");

const browser = await chromium.launch({
  headless: false, // hiện trình duyệt để quan sát
  slowMo: 400,
});
const context = await browser.newContext({
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  locale: "vi-VN",
  viewport: { width: 1280, height: 800 },
});

const page = await context.newPage();

// Theo dõi toàn bộ redirect
page.on("response", resp => {
  const s = resp.status();
  if (s >= 300 && s < 400) console.log(`  REDIRECT ${s}: ${resp.url().slice(0, 100)}`);
});

// ── Step 1: Mở trang login ──
console.log("\n=== Step 1: Mở trang LMS ===");
await page.goto(LMS_URL, { waitUntil: "networkidle", timeout: 30000 });
console.log("URL:", page.url());
await page.screenshot({ path: resolve(__dir, "debug-1-landing.png") });

// ── Step 2: Tìm và click nút SAML ──
console.log("\n=== Step 2: Click đăng nhập VNU mail ===");
await page.waitForTimeout(2000);
const pageText = await page.evaluate(() => document.body.innerText?.slice(0, 500));
console.log("Page text:", pageText);

// Tìm nút đăng nhập
const loginBtn = page.locator([
  'a[href*="saml"]',
  'button:has-text("VNU")',
  'a:has-text("VNU mail")',
  'a:has-text("Đăng nhập với VNU")',
  '[data-testid*="saml"]',
].join(", ")).first();

if (await loginBtn.count() > 0) {
  console.log("Tìm thấy nút login, đang click...");
  await loginBtn.click();
  await page.waitForTimeout(4000);
} else {
  console.log("KHÔNG tìm thấy nút login! Links trên trang:");
  const links = await page.evaluate(() =>
    Array.from(document.querySelectorAll("a, button")).map(el => ({
      tag: el.tagName, text: el.textContent?.trim().slice(0, 60), href: el.getAttribute("href")
    }))
  );
  console.log(JSON.stringify(links, null, 2));
}

console.log("URL sau click:", page.url());
await page.screenshot({ path: resolve(__dir, "debug-2-after-saml-click.png") });

// ── Step 3: Theo dõi redirect chain ──
console.log("\n=== Step 3: Đang ở:", page.url(), "===");
await page.waitForTimeout(3000);
await page.screenshot({ path: resolve(__dir, "debug-3-sso-page.png") });

const ssoText = await page.evaluate(() => document.body.innerText?.slice(0, 300));
const ssoInputs = await page.evaluate(() =>
  Array.from(document.querySelectorAll("input")).map(i => ({
    type: i.type, name: i.name, id: i.id, placeholder: i.placeholder
  }))
);
console.log("Page text:", ssoText);
console.log("Inputs:", JSON.stringify(ssoInputs, null, 2));

// ── Step 4: Nếu có form, thử nhập credentials ──
const email = process.env.UET_EMAIL;
const password = process.env.UET_PASSWORD;
if (email && password && ssoInputs.length > 0) {
  console.log("\n=== Step 4: Nhập credentials ===");
  const emailInput = page.locator('input[type="email"], input[name="username"], input[name="Email"], input[name="loginfmt"], input[name="username"]').first();
  if (await emailInput.count() > 0) {
    await emailInput.fill(email);
    console.log("Đã nhập email");

    const nextBtn = page.locator('button[type="submit"], input[type="submit"], button:has-text("Next"), button:has-text("Tiếp")').first();
    if (await nextBtn.count() > 0) {
      await nextBtn.click();
      await page.waitForTimeout(3000);
    }

    const passInput = page.locator('input[type="password"]').first();
    if (await passInput.count() > 0) {
      await passInput.fill(password);
      console.log("Đã nhập password");
      await passInput.press("Enter");
      await page.waitForTimeout(5000);
    }
  }
}

await page.screenshot({ path: resolve(__dir, "debug-4-final.png") });
console.log("\n=== Kết quả cuối ===");
console.log("URL:", page.url());
const finalText = await page.evaluate(() => document.body.innerText?.slice(0, 300));
console.log("Page:", finalText);

console.log("\nĐã lưu 4 ảnh debug trong bot/. Giữ trình duyệt mở 15 giây...");
await page.waitForTimeout(15000);
await browser.close();
