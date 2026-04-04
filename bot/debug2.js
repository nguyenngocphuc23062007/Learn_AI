/**
 * Debug chuyên sâu: theo dõi từng bước login, chụp ảnh Keycloak
 */
import { chromium } from "playwright";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __dir  = dirname(fileURLToPath(import.meta.url));
const LMS    = "https://portal.uet.vnu.edu.vn/uet-lms";
const email  = process.env.UET_EMAIL;
const pass   = process.env.UET_PASSWORD;

const browser = await chromium.launch({ headless: false, slowMo: 300 });
const ctx     = await browser.newContext({ locale: "vi-VN", viewport: { width: 1280, height: 800 } });
const page    = await ctx.newPage();

page.on("response", r => { const s = r.status(); if (s >= 300 && s < 400) console.log(`  ↪ ${s} ${r.url().slice(0,80)}`); });

// ─── Step 1: LMS ──
console.log("\n1. Mở LMS...");
await page.goto(LMS, { waitUntil: "networkidle" });
await page.screenshot({ path: resolve(__dir, "d2-1-lms.png") });

// ─── Step 2: Click SAML ──
console.log("2. Click SAML...");
const btn = page.locator('a[href*="saml"]').first();
await btn.waitFor();
btn.click(); // không await để tracking redirect
await page.waitForTimeout(5000);
console.log("   URL:", page.url().slice(0,80));
await page.screenshot({ path: resolve(__dir, "d2-2-google.png") });

// ─── Step 3: Google — nhập email ──
console.log("3. Google sign-in...");
const emailInput = page.locator('input[name="identifier"]').first();
if (await emailInput.count() > 0) {
  await emailInput.fill(email);
  console.log("   Đã điền email:", email);
  await emailInput.press("Enter");
  await page.waitForTimeout(4000);
  console.log("   URL sau Enter:", page.url().slice(0,80));
  await page.screenshot({ path: resolve(__dir, "d2-3-after-google-enter.png") });
} else {
  console.log("   KHÔNG tìm thấy email input!");
}

// ─── Step 4: Bất cứ đâu ta đang ở ──
console.log("4. Đang ở:", page.url().slice(0,100));
await page.screenshot({ path: resolve(__dir, "d2-4-current.png") });

// Đọc tất cả input trên trang hiện tại
const inputs = await page.evaluate(() =>
  Array.from(document.querySelectorAll("input:not([type='hidden'])")).map(i => ({
    type: i.type, name: i.name, id: i.id,
    value: i.value,       // giá trị hiện tại (để biết pre-filled không)
    placeholder: i.placeholder,
  }))
);
console.log("   Inputs:", JSON.stringify(inputs, null, 2));

// ─── Step 5: Nếu đang ở Keycloak — điền password ──
if (page.url().includes("idp.vnu.edu.vn")) {
  console.log("5. Đang ở Keycloak, thử điền...");

  // Chỉ điền các field rỗng
  for (const inp of inputs) {
    if (inp.type === "password") {
      await page.locator(`input[type="password"]`).first().fill(pass);
      console.log("   Đã điền password");
    }
    if ((inp.type === "text" || inp.type === "email") && !inp.value && inp.name === "username") {
      // Username rỗng → thử điền
      const candidate = email.split("@")[0]; // student ID
      await page.locator(`input[name="username"]`).fill(candidate);
      console.log(`   Điền username: ${candidate}`);
    }
  }

  await page.screenshot({ path: resolve(__dir, "d2-5-keycloak-filled.png") });
  console.log("   Screenshot lưu. Submit sau 3s...");
  await page.waitForTimeout(3000);

  await page.locator('input[type="submit"], button[type="submit"]').first().click();
  await page.waitForTimeout(5000);
  console.log("   Sau submit:", page.url().slice(0,80));
  await page.screenshot({ path: resolve(__dir, "d2-6-after-submit.png") });
}

console.log("\n✅ Debug xong. Đóng sau 15s...");
await page.waitForTimeout(15000);
await browser.close();
