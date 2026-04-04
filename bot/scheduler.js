/**
 * UET-LMS Scheduler
 * Chạy scraper mỗi ngày lúc 0:00 (giờ Việt Nam)
 * Dùng: node scheduler.js
 */

import cron from "node-cron";
import { runScraper } from "./scraper.js";

const TIMEZONE = "Asia/Ho_Chi_Minh";

function log(msg) {
  console.log(`[${new Date().toLocaleString("vi-VN", { timeZone: TIMEZONE })}] ${msg}`);
}

// ─── Chạy ngay lần đầu khi khởi động ─────────────────────────────────────────

log("🤖 UET-LMS Bot đã khởi động!");
log("📅 Lịch chạy: mỗi ngày lúc 00:00 (giờ Việt Nam)");
log("▶️  Đang chạy lần đầu để lấy dữ liệu ngay...\n");

runScraper()
  .then(() => log("✅ Lần chạy đầu hoàn tất.\n"))
  .catch(err => log(`❌ Lỗi lần chạy đầu: ${err.message}\n`));

// ─── Cron: chạy lúc 0:00 mỗi ngày ───────────────────────────────────────────

cron.schedule(
  "0 0 * * *",           // 0:00 mỗi ngày
  async () => {
    log("⏰ Cron kích hoạt — bắt đầu scrape UET-LMS...");
    try {
      await runScraper();
      log("✅ Scrape thành công!\n");
    } catch (err) {
      log(`❌ Scrape thất bại: ${err.message}\n`);
    }
  },
  { timezone: TIMEZONE }
);

// ─── Cron thứ 2: kiểm tra thông báo mới mỗi 30 phút (giờ học) ───────────────

cron.schedule(
  "*/30 7-23 * * *",     // Mỗi 30 phút từ 7:00 đến 23:00
  async () => {
    log("🔔 Kiểm tra dữ liệu mới...");
    try {
      await runScraper();
    } catch (err) {
      log(`❌ Lỗi: ${err.message}`);
    }
  },
  { timezone: TIMEZONE }
);

log("⏳ Scheduler đang chờ...");
log("   Nhấn Ctrl+C để dừng.\n");

// Giữ process chạy
process.on("SIGINT",  () => { log("Bot đã dừng."); process.exit(0); });
process.on("SIGTERM", () => { log("Bot đã dừng."); process.exit(0); });
