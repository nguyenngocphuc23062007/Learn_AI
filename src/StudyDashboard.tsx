import React, { useState, useEffect, useCallback, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Assignment {
  id: string;
  subject: string;
  subjectCode: string;
  title: string;
  due: string; // ISO date string
  type: "quiz" | "lab" | "essay" | "project" | "reading";
  points: number;
  done: boolean;
}

interface Notification {
  id: string;
  type: "assignment" | "grade" | "update" | "reminder";
  subject: string;
  message: string;
  time: string;
  read: boolean;
}

interface Course {
  code: string;
  name: string;
  credits: number;
  color: string;
  teacher: string;
  totalAssignments: number;
}

interface LmsFile {
  id: string;
  subject: string;
  subjectCode: string;
  name: string;
  url: string;
  fileType: "pdf" | "doc" | "excel" | "ppt" | "zip" | "image" | "file" | "link" | "essay";
  module?: string;
  size: number;
  createdAt: string;
  localPath?: string;
  description?: string;
}

// ─── Live data fetching ───────────────────────────────────────────────────────

const COURSE_COLORS = ["#6366f1","#0ea5e9","#f59e0b","#10b981","#ef4444","#8b5cf6","#ec4899","#14b8a6","#f97316","#06b6d4"];

function assignColors(courses: { code: string; name: string }[]): Course[] {
  return courses.map((c, i) => ({
    code: c.code,
    name: c.name,
    credits: 3,
    color: COURSE_COLORS[i % COURSE_COLORS.length],
    teacher: "",
    totalAssignments: 0,
  }));
}

interface LmsData {
  lastUpdated: string;
  courses: { code: string; name: string; id?: string }[];
  assignments: Assignment[];
  notifications: Notification[];
  files?: LmsFile[];
}

async function fetchLmsData(): Promise<LmsData | null> {
  try {
    const res = await fetch("/lms-data.json?t=" + Date.now());
    if (!res.ok) return null;
    return await res.json() as LmsData;
  } catch { return null; }
}

// ─── Static data (fallback khi chưa chạy bot) ────────────────────────────────

const COURSES: Course[] = [
  { code: "INT2215", name: "Lập trình hướng đối tượng", credits: 4, color: "#6366f1", teacher: "TS. Nguyễn Văn A", totalAssignments: 8 },
  { code: "INT2209", name: "Cấu trúc dữ liệu & Giải thuật", credits: 4, color: "#0ea5e9", teacher: "PGS. Trần Thị B", totalAssignments: 10 },
  { code: "INT2211", name: "Hệ điều hành", credits: 3, color: "#f59e0b", teacher: "TS. Lê Văn C", totalAssignments: 7 },
  { code: "INT2213", name: "Cơ sở dữ liệu", credits: 3, color: "#10b981", teacher: "GS. Phạm Thị D", totalAssignments: 9 },
  { code: "INT2217", name: "Mạng máy tính", credits: 3, color: "#ef4444", teacher: "TS. Hoàng Văn E", totalAssignments: 6 },
  { code: "MAT1101", name: "Toán rời rạc", credits: 3, color: "#8b5cf6", teacher: "PGS. Vũ Thị F", totalAssignments: 8 },
];

const INITIAL_ASSIGNMENTS: Assignment[] = [
  // OOP
  { id: "a1",  subject: "Lập trình hướng đối tượng", subjectCode: "INT2215", title: "Lab 5: Thiết kế class diagram cho hệ thống quản lý thư viện", due: "2026-04-07", type: "lab",     points: 20, done: false },
  { id: "a2",  subject: "Lập trình hướng đối tượng", subjectCode: "INT2215", title: "Bài tập: Implement Design Pattern Observer", due: "2026-04-10", type: "essay",   points: 15, done: false },
  { id: "a3",  subject: "Lập trình hướng đối tượng", subjectCode: "INT2215", title: "Quiz chương 4: Inheritance & Polymorphism", due: "2026-04-05", type: "quiz",    points: 10, done: true  },
  { id: "a4",  subject: "Lập trình hướng đối tượng", subjectCode: "INT2215", title: "Đọc tài liệu: SOLID Principles", due: "2026-04-08", type: "reading", points: 5,  done: true  },
  // DSA
  { id: "a5",  subject: "Cấu trúc dữ liệu & Giải thuật", subjectCode: "INT2209", title: "Bài tập: Implement AVL Tree", due: "2026-04-09", type: "lab",     points: 25, done: false },
  { id: "a6",  subject: "Cấu trúc dữ liệu & Giải thuật", subjectCode: "INT2209", title: "Quiz: Graph Traversal (BFS/DFS)", due: "2026-04-06", type: "quiz",    points: 10, done: false },
  { id: "a7",  subject: "Cấu trúc dữ liệu & Giải thuật", subjectCode: "INT2209", title: "Project giữa kỳ: Xây dựng ứng dụng tìm đường ngắn nhất", due: "2026-04-20", type: "project",points: 40, done: false },
  { id: "a8",  subject: "Cấu trúc dữ liệu & Giải thuật", subjectCode: "INT2209", title: "Lab 3: Sorting Algorithms", due: "2026-04-03", type: "lab",     points: 20, done: true  },
  // OS
  { id: "a9",  subject: "Hệ điều hành", subjectCode: "INT2211", title: "Lab 4: Process Scheduling Simulation", due: "2026-04-11", type: "lab",     points: 20, done: false },
  { id: "a10", subject: "Hệ điều hành", subjectCode: "INT2211", title: "Báo cáo: So sánh các giải thuật lập lịch CPU", due: "2026-04-14", type: "essay",   points: 15, done: false },
  { id: "a11", subject: "Hệ điều hành", subjectCode: "INT2211", title: "Quiz chương 3: Memory Management", due: "2026-04-04", type: "quiz",    points: 10, done: true  },
  // DB
  { id: "a12", subject: "Cơ sở dữ liệu", subjectCode: "INT2213", title: "Lab 6: Optimize SQL Queries với Index", due: "2026-04-08", type: "lab",     points: 20, done: false },
  { id: "a13", subject: "Cơ sở dữ liệu", subjectCode: "INT2213", title: "Bài tập: Chuẩn hoá lược đồ quan hệ 3NF/BCNF", due: "2026-04-12", type: "essay",   points: 15, done: false },
  { id: "a14", subject: "Cơ sở dữ liệu", subjectCode: "INT2213", title: "Quiz: ER Diagram & Relational Model", due: "2026-04-03", type: "quiz",    points: 10, done: true  },
  { id: "a15", subject: "Cơ sở dữ liệu", subjectCode: "INT2213", title: "Project: Thiết kế CSDL cho ứng dụng thương mại điện tử", due: "2026-04-25", type: "project",points: 50, done: false },
  // Network
  { id: "a16", subject: "Mạng máy tính", subjectCode: "INT2217", title: "Lab 3: Cấu hình VLAN & Routing với Cisco Packet Tracer", due: "2026-04-13", type: "lab",     points: 20, done: false },
  { id: "a17", subject: "Mạng máy tính", subjectCode: "INT2217", title: "Quiz: TCP/IP Model & Subnetting", due: "2026-04-07", type: "quiz",    points: 10, done: false },
  // Discrete Math
  { id: "a18", subject: "Toán rời rạc", subjectCode: "MAT1101", title: "Bài tập: Lý thuyết đồ thị - bài 3.1–3.5", due: "2026-04-09", type: "essay",   points: 10, done: false },
  { id: "a19", subject: "Toán rời rạc", subjectCode: "MAT1101", title: "Quiz: Đại số Boole & Mạch logic", due: "2026-04-06", type: "quiz",    points: 10, done: true  },
  { id: "a20", subject: "Toán rời rạc", subjectCode: "MAT1101", title: "Đọc: Chứng minh quy nạp & Đệ quy", due: "2026-04-05", type: "reading", points: 5,  done: true  },
];


const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "assignment", subject: "Cấu trúc dữ liệu & Giải thuật", message: "Bài tập mới: Implement AVL Tree — deadline 09/04", time: "2 giờ trước", read: false },
  { id: "n2", type: "grade",      subject: "Hệ điều hành",                   message: "Điểm Quiz chương 3 đã được công bố: 9/10", time: "5 giờ trước", read: false },
  { id: "n3", type: "update",    subject: "Cơ sở dữ liệu",                  message: "Giảng viên cập nhật tài liệu Lab 6 (v2.1)", time: "1 ngày trước", read: false },
  { id: "n4", type: "reminder",  subject: "Lập trình hướng đối tượng",       message: "Nhắc nhở: Lab 5 sẽ hết hạn sau 3 ngày", time: "1 ngày trước", read: true  },
  { id: "n5", type: "assignment", subject: "Mạng máy tính",                  message: "Bài tập mới: Quiz TCP/IP — deadline 07/04", time: "2 ngày trước", read: true  },
  { id: "n6", type: "grade",      subject: "Toán rời rạc",                   message: "Điểm Quiz Đại số Boole: 8.5/10", time: "3 ngày trước", read: true  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_META: Record<Assignment["type"], { label: string; bg: string; color: string }> = {
  quiz:    { label: "Quiz",    bg: "rgba(239,68,68,0.08)",    color: "#ef4444" },
  lab:     { label: "Lab",     bg: "rgba(14,165,233,0.08)",   color: "#0ea5e9" },
  essay:   { label: "Bài tập", bg: "rgba(99,102,241,0.08)",   color: "#6366f1" },
  project: { label: "Project", bg: "rgba(234,179,8,0.1)",     color: "#ca8a04" },
  reading: { label: "Đọc",     bg: "rgba(16,185,129,0.08)",   color: "#10b981" },
};

const NOTIF_META: Record<Notification["type"], { icon: React.ReactNode; bg: string; color: string }> = {
  assignment: {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    bg: "rgba(99,102,241,0.1)", color: "#6366f1"
  },
  grade: {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
    bg: "rgba(16,185,129,0.1)", color: "#10b981"
  },
  update: {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>,
    bg: "rgba(14,165,233,0.1)", color: "#0ea5e9"
  },
  reminder: {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
    bg: "rgba(245,158,11,0.1)", color: "#f59e0b"
  },
};

function daysUntil(due: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const d = new Date(due);
  return Math.ceil((d.getTime() - now.getTime()) / 86400000);
}

function formatDue(due: string): string {
  const days = daysUntil(due);
  const d = new Date(due);
  const ddmm = `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}`;
  if (days < 0)  return `Quá hạn ${-days} ngày`;
  if (days === 0) return "Hôm nay";
  if (days === 1) return "Ngày mai";
  return `${ddmm} (còn ${days} ngày)`;
}

function dueBadgeStyle(due: string, done: boolean): React.CSSProperties {
  if (done) return { color: "var(--muted)", background: "var(--bg-alt)" };
  const d = daysUntil(due);
  if (d < 0)  return { color: "#ef4444", background: "rgba(239,68,68,0.08)" };
  if (d <= 2) return { color: "#f59e0b", background: "rgba(245,158,11,0.08)" };
  return { color: "var(--muted)", background: "var(--bg-alt)" };
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconBell = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);

const IconX = ({ size = 14 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={size} height={size}>
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ─── StudyCharts ─────────────────────────────────────────────────────────────

interface ChartsProps {
  assignments: Assignment[];
  courses: Course[];
}

// ─── File Viewer ──────────────────────────────────────────────────────────────

const FILE_ICONS: Record<string, { icon: string; color: string }> = {
  pdf:   { icon: "📄", color: "#ef4444" },
  doc:   { icon: "📝", color: "#2563eb" },
  excel: { icon: "📊", color: "#16a34a" },
  ppt:   { icon: "📋", color: "#ea580c" },
  zip:   { icon: "🗜️", color: "#7c3aed" },
  image: { icon: "🖼️", color: "#0891b2" },
  link:  { icon: "🔗", color: "#0ea5e9" },
  file:  { icon: "📁", color: "#6b7280" },
  essay: { icon: "📋", color: "#6366f1" },
};

const VIEWABLE_TYPES = new Set(["pdf", "image"]);
const DOWNLOADABLE_TYPES = new Set(["pdf", "doc", "excel", "ppt", "zip", "image"]);

function FileViewer({ file, onClose }: { file: LmsFile; onClose: () => void }) {
  const meta = FILE_ICONS[file.fileType] ?? FILE_ICONS.file;
  const hasLocal = Boolean(file.localPath);
  const canView = hasLocal && VIEWABLE_TYPES.has(file.fileType);

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.55)" }} />
      <div style={{
        position: "fixed", top: "2.5rem", left: "50%", transform: "translateX(-50%)",
        width: "min(94vw, 1020px)", height: "calc(100vh - 3.5rem)",
        zIndex: 301, background: "var(--bg)", borderRadius: "14px",
        overflow: "hidden", display: "flex", flexDirection: "column",
        boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
      }}>
        {/* Header */}
        <div style={{
          padding: "0.75rem 1rem", display: "flex", alignItems: "center", gap: "0.75rem",
          borderBottom: "1px solid var(--border)", background: "var(--bg)", flexShrink: 0,
        }}>
          <span style={{ fontSize: "1.15rem", flexShrink: 0 }}>{meta.icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.83rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</div>
            {file.module && <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: "0.05rem" }}>{file.module}</div>}
          </div>
          {hasLocal && DOWNLOADABLE_TYPES.has(file.fileType) && (
            <a href={file.localPath} download={file.name} style={{
              padding: "0.32rem 0.8rem", border: "1px solid var(--border-strong)", borderRadius: "7px",
              fontSize: "0.73rem", color: "var(--fg)", textDecoration: "none", background: "transparent", flexShrink: 0,
            }}>↓ Tải về</a>
          )}
          {file.url && (
            <a href={file.url} target="_blank" rel="noreferrer" style={{
              padding: "0.32rem 0.8rem", border: "1px solid var(--border-strong)", borderRadius: "7px",
              fontSize: "0.73rem", color: "var(--fg)", textDecoration: "none", background: "transparent", flexShrink: 0,
            }}>Mở LMS ↗</a>
          )}
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem",
            color: "var(--muted)", padding: "0.2rem 0.4rem", borderRadius: "6px", flexShrink: 0,
          }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: "hidden", background: "#f5f5f7", position: "relative" }}>
          {canView && file.fileType === "pdf" && (
            <iframe src={file.localPath} style={{ width: "100%", height: "100%", border: "none" }} title={file.name} />
          )}
          {canView && file.fileType === "image" && (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
              <img src={file.localPath} alt={file.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "8px", boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }} />
            </div>
          )}
          {hasLocal && !canView && (
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.25rem" }}>
              <span style={{ fontSize: "3.5rem" }}>{meta.icon}</span>
              <div style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.82rem" }}>
                <div style={{ color: "var(--fg)", fontWeight: 500, marginBottom: "0.35rem" }}>{file.name}</div>
                Trình duyệt không xem được định dạng này — hãy tải về để mở
              </div>
              <a href={file.localPath} download={file.name} style={{
                padding: "0.55rem 1.4rem", background: "#6366f1", color: "#fff",
                borderRadius: "8px", textDecoration: "none", fontSize: "0.82rem",
              }}>↓ Tải về</a>
            </div>
          )}
          {!hasLocal && file.description && (
            <div style={{ width: "100%", height: "100%", overflowY: "auto", padding: "1.75rem 2rem" }}>
              <style>{`
                .desc-body a { color: #6366f1; text-decoration: underline; pointer-events: auto !important; cursor: pointer !important; }
                .desc-body a[href^="/lms-files/"] { display: inline-flex; align-items: center; gap: 4px; background: #f0f0ff; border: 1px solid #c7d2fe; border-radius: 6px; padding: 4px 10px; text-decoration: none; font-size: 0.82rem; margin: 2px 0; }
                .desc-body a[href^="/lms-files/"]::before { content: "📄"; }
                .desc-body img { max-width: 100%; border-radius: 6px; }
                .desc-body p { margin: 0.5em 0; }
                .desc-body ul, .desc-body ol { padding-left: 1.5em; }
              `}</style>
              <div
                className="desc-body"
                style={{ maxWidth: 720, margin: "0 auto", fontSize: "0.88rem", lineHeight: 1.7, color: "var(--fg)" }}
                dangerouslySetInnerHTML={{ __html: file.description }}
              />
            </div>
          )}
          {!hasLocal && !file.description && (
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.25rem" }}>
              <span style={{ fontSize: "3.5rem" }}>📋</span>
              <div style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.82rem" }}>
                <div style={{ color: "var(--fg)", fontWeight: 500, marginBottom: "0.35rem" }}>{file.name}</div>
                Bài tập trực tuyến — làm và nộp trên LMS
              </div>
              <a href={file.url} target="_blank" rel="noreferrer" style={{
                padding: "0.55rem 1.4rem", background: "#6366f1", color: "#fff",
                borderRadius: "8px", textDecoration: "none", fontSize: "0.82rem",
              }}>Mở bài tập trên LMS ↗</a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function StudyCharts({ assignments, courses }: ChartsProps) {
  // ── Area chart: weekly cumulative progress ──
  const weeklyPoints = (() => {
    const map = new Map<string, { weekStart: Date; total: number; done: number }>();
    assignments.forEach(a => {
      if (a.due === "2099-12-31") return;
      const d = new Date(a.due);
      const monday = new Date(d);
      monday.setDate(d.getDate() - (d.getDay() === 0 ? 6 : d.getDay() - 1));
      monday.setHours(0, 0, 0, 0);
      const key = monday.toISOString().slice(0, 10);
      if (!map.has(key)) map.set(key, { weekStart: monday, total: 0, done: 0 });
      const e = map.get(key)!;
      e.total++;
      if (a.done) e.done++;
    });
    const sorted = [...map.values()].sort((a, b) => a.weekStart.getTime() - b.weekStart.getTime());
    let ct = 0, cd = 0;
    return sorted.map(e => {
      ct += e.total; cd += e.done;
      return {
        label: `${String(e.weekStart.getDate()).padStart(2, "0")}/${String(e.weekStart.getMonth() + 1).padStart(2, "0")}`,
        total: ct,
        done: cd,
      };
    });
  })();

  // ── SVG dimensions for area chart ──
  const AW = 440, AH = 180;
  const AP = { t: 16, r: 16, b: 36, l: 40 };
  const aW = AW - AP.l - AP.r;
  const aH = AH - AP.t - AP.b;
  const maxVal = weeklyPoints.length > 0 ? weeklyPoints[weeklyPoints.length - 1].total : 1;
  const n = weeklyPoints.length;
  const ax = (i: number) => AP.l + (n <= 1 ? aW / 2 : (i / (n - 1)) * aW);
  const ay = (v: number) => AP.t + aH - (v / maxVal) * aH;

  const totalPoly = weeklyPoints.map((p, i) => `${ax(i)},${ay(p.total)}`).join(" ");
  const donePoly  = weeklyPoints.map((p, i) => `${ax(i)},${ay(p.done)}`).join(" ");
  const areaTotal = n > 0 ? `M ${weeklyPoints.map((p, i) => `${ax(i)} ${ay(p.total)}`).join(" L ")} L ${ax(n-1)} ${AP.t + aH} L ${AP.l} ${AP.t + aH} Z` : "";
  const areaDone  = n > 0 ? `M ${weeklyPoints.map((p, i) => `${ax(i)} ${ay(p.done)}`).join(" L ")}  L ${ax(n-1)} ${AP.t + aH} L ${AP.l} ${AP.t + aH} Z` : "";
  const yTicksA   = [0, 0.25, 0.5, 0.75, 1].map(t => Math.round(t * maxVal));

  // ── Bar chart: points per subject ──
  const barData = courses
    .map(c => ({
      code: c.code,
      color: c.color,
      total:  assignments.filter(a => a.subjectCode === c.code).reduce((s, a) => s + a.points, 0),
      earned: assignments.filter(a => a.subjectCode === c.code && a.done).reduce((s, a) => s + a.points, 0),
    }))
    .filter(d => d.total > 0);

  const BW = 440, BH = 180;
  const BP = { t: 16, r: 16, b: 40, l: 40 };
  const bW = BW - BP.l - BP.r;
  const bH = BH - BP.t - BP.b;
  const maxPts = Math.max(...barData.map(d => d.total), 1);
  const groupW = barData.length > 0 ? bW / barData.length : bW;
  const barW = Math.min(groupW * 0.3, 20);
  const gap = barW * 0.5;
  const yTicksB = [0, 0.25, 0.5, 0.75, 1].map(t => Math.round(t * maxPts));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>

      {/* ── Area chart ── */}
      <div style={{
        background: "#fff", border: "1px solid var(--border)",
        borderRadius: "14px", padding: "1.25rem",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}>
        <div style={{ fontSize: "0.7rem", color: "var(--muted)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          Tiến độ theo tuần
        </div>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "0.6rem" }}>
          {[{ color: "#6366f1", label: "Đã hoàn thành" }, { color: "#c7d2fe", label: "Tổng bài" }].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.68rem", color: "var(--muted)" }}>
              <div style={{ width: 10, height: 3, borderRadius: "999px", background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
        <svg viewBox={`0 0 ${AW} ${AH}`} width="100%" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c7d2fe" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0.04" />
            </linearGradient>
            <linearGradient id="gradDone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.04" />
            </linearGradient>
          </defs>

          {/* Grid */}
          {yTicksA.map((tick, i) => {
            const y = ay(tick);
            return (
              <g key={i}>
                <line x1={AP.l} x2={AP.l + aW} y1={y} y2={y} stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="3 3" />
                <text x={AP.l - 5} y={y + 4} textAnchor="end" fontSize="9" fill="#94a3b8" fontFamily="system-ui,sans-serif">{tick}</text>
              </g>
            );
          })}

          {/* Area fills */}
          {n > 1 && <path d={areaTotal} fill="url(#gradTotal)" />}
          {n > 1 && <path d={areaDone}  fill="url(#gradDone)"  />}

          {/* Lines */}
          {n > 1 && <polyline points={totalPoly} fill="none" stroke="#c7d2fe" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />}
          {n > 1 && <polyline points={donePoly}  fill="none" stroke="#6366f1" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />}

          {/* Dots */}
          {weeklyPoints.map((p, i) => (
            <g key={i}>
              <circle cx={ax(i)} cy={ay(p.total)} r="3" fill="#fff" stroke="#c7d2fe" strokeWidth="1.5" />
              <circle cx={ax(i)} cy={ay(p.done)}  r="3" fill="#fff" stroke="#6366f1" strokeWidth="1.5" />
            </g>
          ))}

          {/* X labels */}
          {weeklyPoints.map((p, i) => (
            <text key={i} x={ax(i)} y={AH - 6} textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="system-ui,sans-serif">{p.label}</text>
          ))}

          {/* Axes */}
          <line x1={AP.l} x2={AP.l}       y1={AP.t} y2={AP.t + aH} stroke="#d1d5db" strokeWidth="1" />
          <line x1={AP.l} x2={AP.l + aW}  y1={AP.t + aH} y2={AP.t + aH} stroke="#d1d5db" strokeWidth="1" />
        </svg>
      </div>

      {/* ── Bar chart ── */}
      <div style={{
        background: "#fff", border: "1px solid var(--border)",
        borderRadius: "14px", padding: "1.25rem",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}>
        <div style={{ fontSize: "0.7rem", color: "var(--muted)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          Điểm theo môn học
        </div>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "0.6rem" }}>
          {[{ color: "#6366f1", label: "Đã đạt" }, { color: "#e0e7ff", label: "Tổng điểm" }].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.68rem", color: "var(--muted)" }}>
              <div style={{ width: 10, height: 3, borderRadius: "999px", background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
        <svg viewBox={`0 0 ${BW} ${BH}`} width="100%" style={{ overflow: "visible" }}>
          {/* Grid */}
          {yTicksB.map((tick, i) => {
            const y = BP.t + bH - (tick / maxPts) * bH;
            return (
              <g key={i}>
                <line x1={BP.l} x2={BP.l + bW} y1={y} y2={y} stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="3 3" />
                <text x={BP.l - 5} y={y + 4} textAnchor="end" fontSize="9" fill="#94a3b8" fontFamily="system-ui,sans-serif">{tick}</text>
              </g>
            );
          })}

          {/* Bars */}
          {barData.map((d, i) => {
            const cx = BP.l + (i + 0.5) * groupW;
            const totalH  = (d.total  / maxPts) * bH;
            const earnedH = (d.earned / maxPts) * bH;
            return (
              <g key={d.code}>
                <rect x={cx - barW - gap / 2} y={BP.t + bH - totalH}  width={barW} height={totalH}  rx="3" fill="#e0e7ff" />
                <rect x={cx + gap / 2}         y={BP.t + bH - earnedH} width={barW} height={earnedH} rx="3" fill={d.color} />
                <text x={cx} y={BH - 4} textAnchor="middle" fontSize="8.5" fill="#94a3b8" fontFamily="system-ui,sans-serif">
                  {d.code.length > 8 ? d.code.slice(0, 8) : d.code}
                </text>
              </g>
            );
          })}

          {/* Axes */}
          <line x1={BP.l} x2={BP.l}       y1={BP.t} y2={BP.t + bH} stroke="#d1d5db" strokeWidth="1" />
          <line x1={BP.l} x2={BP.l + bW}  y1={BP.t + bH} y2={BP.t + bH} stroke="#d1d5db" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  onBack: () => void;
}

export default function StudyDashboard({ onBack }: Props) {
  // ── State ──
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    try {
      const saved = localStorage.getItem("study_assignments");
      return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
    } catch { return INITIAL_ASSIGNMENTS; }
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem("study_notifications");
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch { return INITIAL_NOTIFICATIONS; }
  });

  const [courses, setCourses]           = useState<Course[]>(COURSES);
  const [files, setFiles]               = useState<LmsFile[]>([]);
  const [dataStatus, setDataStatus]     = useState<"loading" | "live" | "demo">("loading");
  const [lastUpdated, setLastUpdated]   = useState<string | null>(null);

  const [filter, setFilter]             = useState<"all" | "pending" | "done" | "overdue">("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [showNotif, setShowNotif]       = useState(false);
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set(courses.map(c => c.code)));
  const [expandedFileSubjects, setExpandedFileSubjects] = useState<Set<string>>(new Set());
  const [viewingFile, setViewingFile]   = useState<LmsFile | null>(null);

  // ── Fetch live data từ bot ──
  const applyLmsData = useCallback((data: LmsData) => {
    const savedDone: Record<string, boolean> = {};
    try {
      const saved = localStorage.getItem("study_assignments");
      if (saved) JSON.parse(saved).forEach((a: Assignment) => { savedDone[a.id] = a.done; });
    } catch {}

    const merged = data.assignments.map(a => ({
      ...a,
      done: savedDone[a.id] ?? a.done,
    }));

    setAssignments(merged);
    setNotifications(prev => {
      // Chỉ thêm thông báo mới, không xoá cái cũ
      const existingIds = new Set(prev.map(n => n.id));
      const newOnes = (data.notifications ?? []).filter(n => !existingIds.has(n.id));
      return newOnes.length > 0 ? [...newOnes, ...prev] : prev;
    });
    setCourses(assignColors(data.courses ?? []));
    if (data.files?.length) setFiles(data.files);
    setLastUpdated(data.lastUpdated);
    setExpandedSubjects(prev => {
      // Chỉ set lần đầu (khi prev rỗng)
      if (prev.size === 0) return new Set((data.courses ?? []).map(c => c.code));
      return prev;
    });
    setDataStatus("live");
  }, []);

  useEffect(() => {
    // Load lần đầu
    fetchLmsData().then(data => {
      if (!data?.assignments?.length) { setDataStatus("demo"); return; }
      applyLmsData(data);
    });

    // Auto-refresh mỗi 5 phút — nhận dữ liệu mới khi bot update
    const interval = setInterval(async () => {
      const data = await fetchLmsData();
      if (!data?.assignments?.length) return;
      // Chỉ update nếu lastUpdated thay đổi
      setLastUpdated(prev => {
        if (prev !== data.lastUpdated) applyLmsData(data);
        return prev;
      });
    }, 5 * 60 * 1000); // 5 phút

    return () => clearInterval(interval);
  }, [applyLmsData]);

  // persist done-state
  useEffect(() => { localStorage.setItem("study_assignments", JSON.stringify(assignments)); }, [assignments]);
  useEffect(() => { localStorage.setItem("study_notifications", JSON.stringify(notifications)); }, [notifications]);

  // ── Derived ──
  const unread = notifications.filter(n => !n.read).length;
  const total = assignments.length;
  const done = assignments.filter(a => a.done).length;
  const pending = assignments.filter(a => !a.done).length;
  const overdue = assignments.filter(a => !a.done && daysUntil(a.due) < 0).length;
  const dueSoon = assignments.filter(a => !a.done && daysUntil(a.due) >= 0 && daysUntil(a.due) <= 3).length;

  const filtered = assignments.filter(a => {
    const matchSub = subjectFilter === "all" || a.subjectCode === subjectFilter;
    const matchFilter =
      filter === "all"     ? true :
      filter === "pending" ? !a.done :
      filter === "done"    ? a.done :
      filter === "overdue" ? (!a.done && daysUntil(a.due) < 0) : true;
    return matchSub && matchFilter;
  });

  // group by subject
  const grouped = courses.map(c => ({
    course: c,
    items: filtered.filter(a => a.subjectCode === c.code),
  })).filter(g => g.items.length > 0);

  // ── Handlers ──
  const toggle = useCallback((id: string) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, done: !a.done } : a));
  }, []);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const dismissNotif = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));

  const toggleSubject = (code: string) => {
    setExpandedSubjects(prev => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  };

  const courseProgress = (code: string) => {
    const all = assignments.filter(a => a.subjectCode === code);
    if (!all.length) return 0;
    return Math.round((all.filter(a => a.done).length / all.length) * 100);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      fontFamily: "var(--font-body)",
    }}>
      {/* ── Top bar ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        padding: "0 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "58px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button onClick={onBack} style={{
            background: "none", border: "1px solid var(--border-strong)",
            borderRadius: "8px", padding: "0.35rem 0.9rem",
            fontSize: "0.78rem", color: "var(--fg)", cursor: "pointer",
            fontFamily: "var(--font-body)", fontWeight: 500,
            display: "flex", alignItems: "center", gap: "0.4rem",
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="12" height="12"><polyline points="15 18 9 12 15 6"/></svg>
            Quay lại
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{
              width: 28, height: 28, borderRadius: "8px",
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" width="14" height="14">
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
              </svg>
            </div>
            <span style={{ fontFamily: "var(--font-name)", fontWeight: 700, fontSize: "0.95rem", letterSpacing: "-0.01em" }}>
              Quản lý học tập
            </span>
            <span style={{
              fontSize: "0.62rem", padding: "0.1rem 0.55rem", borderRadius: "999px",
              background: "rgba(99,102,241,0.08)", color: "#6366f1",
              border: "1px solid rgba(99,102,241,0.2)", fontWeight: 600, letterSpacing: "0.05em",
            }}>UET-LMS</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Notification bell */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowNotif(v => !v)} style={{
              background: showNotif ? "rgba(99,102,241,0.08)" : "none",
              border: "1px solid " + (showNotif ? "rgba(99,102,241,0.3)" : "var(--border-strong)"),
              borderRadius: "8px", width: 36, height: 36,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "var(--fg)", position: "relative",
              transition: "all 0.15s",
            }}>
              <IconBell />
              {unread > 0 && (
                <span style={{
                  position: "absolute", top: -4, right: -4,
                  background: "#ef4444", color: "#fff",
                  borderRadius: "999px", minWidth: 16, height: 16,
                  fontSize: "0.6rem", fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: "0 3px", border: "2px solid #fff",
                }}>{unread}</span>
              )}
            </button>

            {/* Notification panel */}
            {showNotif && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0,
                width: 360, background: "#fff",
                border: "1px solid var(--border-strong)", borderRadius: "14px",
                boxShadow: "0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
                zIndex: 200, overflow: "hidden",
              }}>
                <div style={{
                  padding: "0.85rem 1.1rem",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  borderBottom: "1px solid var(--border)",
                }}>
                  <span style={{ fontWeight: 700, fontSize: "0.85rem", fontFamily: "var(--font-name)" }}>
                    Thông báo {unread > 0 && <span style={{ color: "#6366f1" }}>({unread} mới)</span>}
                  </span>
                  {unread > 0 && (
                    <button onClick={markAllRead} style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: "0.72rem", color: "#6366f1", fontFamily: "var(--font-body)",
                    }}>Đánh dấu đã đọc</button>
                  )}
                </div>
                <div style={{ maxHeight: 380, overflowY: "auto" }}>
                  {notifications.length === 0 && (
                    <div style={{ padding: "2rem", textAlign: "center", color: "var(--muted)", fontSize: "0.82rem" }}>
                      Không có thông báo
                    </div>
                  )}
                  {notifications.map(n => {
                    const meta = NOTIF_META[n.type];
                    return (
                      <div key={n.id} style={{
                        display: "flex", gap: "0.75rem", padding: "0.85rem 1.1rem",
                        background: n.read ? "transparent" : "rgba(99,102,241,0.03)",
                        borderBottom: "1px solid var(--border)",
                        alignItems: "flex-start",
                        transition: "background 0.2s",
                      }}>
                        <div style={{
                          width: 30, height: 30, borderRadius: "8px",
                          background: meta.bg, color: meta.color,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0, marginTop: "1px",
                        }}>
                          {meta.icon}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "0.67rem", color: meta.color, fontWeight: 600, marginBottom: "0.2rem", letterSpacing: "0.04em" }}>
                            {n.subject}
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "var(--fg)", lineHeight: 1.5 }}>
                            {n.message}
                          </div>
                          <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: "0.25rem" }}>
                            {n.time}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", flexShrink: 0 }}>
                          {!n.read && (
                            <div style={{
                              width: 7, height: 7, borderRadius: "50%",
                              background: "#6366f1", flexShrink: 0,
                            }} />
                          )}
                          <button onClick={() => dismissNotif(n.id)} style={{
                            background: "none", border: "none", cursor: "pointer",
                            color: "var(--muted)", padding: "2px", borderRadius: "4px",
                            display: "flex", alignItems: "center",
                          }}>
                            <IconX size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sync status badge */}
          {dataStatus === "loading" && (
            <div style={{ fontSize: "0.72rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#d1d5db", animation: "pulse 1.5s ease-in-out infinite" }} />
              Đang tải...
            </div>
          )}
          {dataStatus === "live" && (
            <div style={{ fontSize: "0.72rem", color: "#10b981", display: "flex", alignItems: "center", gap: "0.4rem",
              background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: "999px", padding: "0.2rem 0.7rem" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
              Đồng bộ từ UET-LMS
              {lastUpdated && (
                <span style={{ opacity: 0.7 }}>
                  · {new Date(lastUpdated).toLocaleDateString("vi-VN")}
                </span>
              )}
            </div>
          )}
          {dataStatus === "demo" && (
            <div style={{ fontSize: "0.72rem", color: "#f59e0b", display: "flex", alignItems: "center", gap: "0.4rem",
              background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)",
              borderRadius: "999px", padding: "0.2rem 0.7rem" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b" }} />
              Demo · Chưa có dữ liệu thật
            </div>
          )}
          <div style={{
            fontSize: "0.78rem", color: "var(--muted)",
            borderLeft: "1px solid var(--border)", paddingLeft: "0.75rem",
          }}>
            HK2 · 2025–2026
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 2rem 4rem" }}>

        {/* ── Page title ── */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{
            fontFamily: "var(--font-name)", fontSize: "1.9rem", fontWeight: 700,
            letterSpacing: "-0.03em", color: "var(--fg)", marginBottom: "0.3rem",
          }}>
            Dashboard học tập
          </h1>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
            Theo dõi tiến độ và quản lý bài tập tất cả các môn học.
          </p>
        </div>

        {/* ── Stats cards ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}>
          {[
            { label: "Tổng bài tập", value: total, sub: `${COURSES.length} môn học`, icon: "📚", accent: "#6366f1" },
            { label: "Chưa hoàn thành", value: pending, sub: `${overdue} quá hạn`, icon: "⏳", accent: "#f59e0b" },
            { label: "Đã hoàn thành", value: done, sub: `${Math.round(done/total*100)}% tổng thể`, icon: "✅", accent: "#10b981" },
            { label: "Sắp đến hạn", value: dueSoon, sub: "trong 3 ngày tới", icon: "🔔", accent: "#ef4444" },
          ].map((s, i) => (
            <div key={i} style={{
              background: "#fff", border: "1px solid var(--border)",
              borderRadius: "14px", padding: "1.25rem 1.4rem",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--muted)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "var(--font-name)", color: "var(--fg)", lineHeight: 1, letterSpacing: "-0.02em" }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.35rem" }}>
                    {s.sub}
                  </div>
                </div>
                <div style={{
                  width: 38, height: 38, borderRadius: "10px",
                  background: s.accent + "14",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.15rem",
                }}>
                  {s.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Charts ── */}
        <StudyCharts assignments={assignments} courses={courses} />

        {/* ── File list ── */}
        {(() => {
          const formatSize = (b: number) =>
            b > 1048576 ? `${(b/1048576).toFixed(1)} MB` : b > 1024 ? `${(b/1024).toFixed(0)} KB` : `${b} B`;

          // Group by subject directly from files (works with both live and demo codes)
          const seenCodes = new Map<string, { name: string; color: string }>();
          files.forEach(f => {
            if (!seenCodes.has(f.subjectCode)) {
              const match = courses.find(c => c.code === f.subjectCode);
              const color = match?.color ?? COURSE_COLORS[seenCodes.size % COURSE_COLORS.length];
              seenCodes.set(f.subjectCode, { name: f.subject, color });
            }
          });
          const grouped = [...seenCodes.entries()].map(([code, meta]) => ({
            course: { code, name: meta.name, color: meta.color },
            items: files.filter(f => f.subjectCode === code),
          }));

          const toggleFileSubject = (code: string) => {
            setExpandedFileSubjects(prev => {
              const next = new Set(prev);
              next.has(code) ? next.delete(code) : next.add(code);
              return next;
            });
          };

          return (
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.85rem" }}>
                <span style={{ fontFamily: "var(--font-name)", fontWeight: 700, fontSize: "1rem", color: "var(--fg)" }}>
                  Tài liệu bài tập
                </span>
                {files.length > 0 && (
                  <span style={{
                    fontSize: "0.65rem", padding: "0.1rem 0.55rem", borderRadius: "999px",
                    background: "rgba(99,102,241,0.08)", color: "#6366f1",
                    border: "1px solid rgba(99,102,241,0.2)", fontWeight: 600,
                  }}>{files.length} file</span>
                )}
              </div>
              {files.length === 0 && (
                <div style={{
                  background: "#fff", border: "1px solid var(--border)", borderRadius: "12px",
                  padding: "2rem", textAlign: "center",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>📂</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--fg)", marginBottom: "0.3rem" }}>Chưa có tài liệu</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Chạy bot để lấy file tài liệu từ UET-LMS</div>
                  <code style={{
                    display: "inline-block", marginTop: "0.75rem",
                    background: "var(--bg-alt)", border: "1px solid var(--border)",
                    borderRadius: "6px", padding: "0.3rem 0.75rem",
                    fontSize: "0.75rem", color: "#6366f1",
                  }}>node bot/scraper.js</code>
                </div>
              )}
              {files.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {grouped.map(({ course, items }) => {
                    const expanded = expandedFileSubjects.has(course.code);
                    return (
                      <div key={course.code} style={{
                        background: "#fff", border: "1px solid var(--border)",
                        borderRadius: "12px", overflow: "hidden",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                      }}>
                        <button onClick={() => toggleFileSubject(course.code)} style={{
                          width: "100%", background: "none", border: "none",
                          padding: "0.85rem 1.1rem", cursor: "pointer",
                          display: "flex", alignItems: "center", gap: "0.75rem", textAlign: "left",
                        }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: course.color, flexShrink: 0 }} />
                          <span style={{ flex: 1, fontWeight: 600, fontSize: "0.85rem", color: "var(--fg)", fontFamily: "var(--font-name)" }}>{course.name}</span>
                          <span style={{ fontSize: "0.7rem", color: "var(--muted)", marginRight: "0.5rem" }}>{items.length} file</span>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="12" height="12"
                            style={{ color: "var(--muted)", transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                            <polyline points="6 9 12 15 18 9"/>
                          </svg>
                        </button>
                        {expanded && (
                          <div style={{ borderTop: "1px solid var(--border)" }}>
                            {items.map((f, idx) => {
                              const meta = FILE_ICONS[f.fileType] ?? FILE_ICONS.file;
                              const hasLocal = Boolean(f.localPath);
                              return (
                                <div key={f.id} onClick={() => setViewingFile(f)} style={{
                                  display: "flex", alignItems: "center", gap: "0.85rem",
                                  padding: "0.7rem 1.1rem", cursor: "pointer",
                                  borderBottom: idx < items.length - 1 ? "1px solid var(--border)" : "none",
                                  color: "var(--fg)", background: "#fff", transition: "background 0.15s",
                                }}
                                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-alt)")}
                                  onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
                                >
                                  <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{meta.icon}</span>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: "0.82rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                                    {f.module && <div style={{ fontSize: "0.65rem", color: "var(--muted)", marginTop: "0.1rem" }}>{f.module}</div>}
                                  </div>
                                  {f.size > 0 && (
                                    <span style={{ fontSize: "0.68rem", color: "var(--muted)", flexShrink: 0 }}>{formatSize(f.size)}</span>
                                  )}
                                  {/* Eye icon nếu có file local, external link icon nếu là bài tập online */}
                                  {hasLocal ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="13" height="13" style={{ color: "#6366f1", flexShrink: 0 }}>
                                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                                    </svg>
                                  ) : (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="12" height="12" style={{ color: "var(--muted)", flexShrink: 0 }}>
                                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                                    </svg>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem", alignItems: "start" }}>

          {/* ── LEFT: Assignment list ── */}
          <div>
            {/* Filters */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "0.35rem" }}>
                {(["all", "pending", "done", "overdue"] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)} style={{
                    padding: "0.38rem 1rem", borderRadius: "999px",
                    border: "1px solid " + (filter === f ? "#6366f1" : "var(--border-strong)"),
                    background: filter === f ? "#6366f1" : "transparent",
                    color: filter === f ? "#fff" : "var(--muted)",
                    fontSize: "0.76rem", fontFamily: "var(--font-body)",
                    cursor: "pointer", fontWeight: filter === f ? 600 : 400,
                    transition: "all 0.15s",
                  }}>
                    {{ all: "Tất cả", pending: "Chưa xong", done: "Hoàn thành", overdue: "Quá hạn" }[f]}
                  </button>
                ))}
              </div>
              <div style={{ marginLeft: "auto" }}>
                <select
                  value={subjectFilter}
                  onChange={e => setSubjectFilter(e.target.value)}
                  style={{
                    padding: "0.38rem 0.85rem", borderRadius: "8px",
                    border: "1px solid var(--border-strong)",
                    background: "#fff", color: "var(--fg)",
                    fontSize: "0.76rem", fontFamily: "var(--font-body)",
                    cursor: "pointer", outline: "none",
                  }}
                >
                  <option value="all">Tất cả môn học</option>
                  {courses.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </div>
            </div>

            {/* Grouped list */}
            {grouped.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "4rem 2rem",
                color: "var(--muted)", fontSize: "0.85rem",
                background: "#fff", borderRadius: "14px",
                border: "1px solid var(--border)",
              }}>
                Không có bài tập nào phù hợp với bộ lọc
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {grouped.map(({ course, items }) => {
                  const expanded = expandedSubjects.has(course.code);
                  const doneCount = items.filter(a => a.done).length;
                  return (
                    <div key={course.code} style={{
                      background: "#fff", border: "1px solid var(--border)",
                      borderRadius: "14px", overflow: "hidden",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    }}>
                      {/* Subject header */}
                      <button onClick={() => toggleSubject(course.code)} style={{
                        width: "100%", background: "none", border: "none",
                        padding: "1rem 1.25rem", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: "0.85rem",
                        textAlign: "left",
                      }}>
                        <div style={{
                          width: 10, height: 10, borderRadius: "50%",
                          background: course.color, flexShrink: 0,
                          boxShadow: `0 0 0 3px ${course.color}22`,
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                            <span style={{ fontFamily: "var(--font-name)", fontWeight: 700, fontSize: "0.9rem", color: "var(--fg)" }}>
                              {course.name}
                            </span>
                            <span style={{
                              fontSize: "0.62rem", padding: "0.1rem 0.5rem", borderRadius: "999px",
                              background: course.color + "14", color: course.color,
                              border: `1px solid ${course.color}28`, fontWeight: 600, letterSpacing: "0.04em",
                            }}>{course.code}</span>
                          </div>
                          <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.15rem" }}>
                            {course.teacher} · {doneCount}/{items.length} hoàn thành
                          </div>
                        </div>
                        {/* mini progress */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
                          <div style={{ width: 72, height: 4, borderRadius: "999px", background: "var(--bg-alt2)", overflow: "hidden" }}>
                            <div style={{
                              height: "100%", borderRadius: "999px",
                              background: course.color,
                              width: items.length ? `${doneCount/items.length*100}%` : "0%",
                              transition: "width 0.4s ease",
                            }} />
                          </div>
                          <span style={{ fontSize: "0.72rem", color: "var(--muted)", minWidth: 26, textAlign: "right" }}>
                            {items.length ? Math.round(doneCount/items.length*100) : 0}%
                          </span>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="13" height="13" style={{ color: "var(--muted)", transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                            <polyline points="6 9 12 15 18 9"/>
                          </svg>
                        </div>
                      </button>

                      {/* Assignment items */}
                      {expanded && (
                        <div style={{ borderTop: "1px solid var(--border)" }}>
                          {items.map((a, idx) => {
                            const typeMeta = TYPE_META[a.type];
                            const badgeStyle = dueBadgeStyle(a.due, a.done);
                            return (
                              <div key={a.id} style={{
                                display: "flex", alignItems: "flex-start", gap: "1rem",
                                padding: "0.9rem 1.25rem",
                                borderBottom: idx < items.length - 1 ? "1px solid var(--border)" : "none",
                                background: a.done ? "rgba(0,0,0,0.01)" : "#fff",
                                transition: "background 0.2s",
                              }}>
                                {/* Checkbox */}
                                <button onClick={() => toggle(a.id)} style={{
                                  width: 20, height: 20, borderRadius: "6px",
                                  border: "2px solid " + (a.done ? "#6366f1" : "var(--border-strong)"),
                                  background: a.done ? "#6366f1" : "#fff",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  cursor: "pointer", flexShrink: 0, marginTop: "2px",
                                  transition: "all 0.15s",
                                }}>
                                  {a.done && <span style={{ color: "#fff" }}><IconCheck /></span>}
                                </button>

                                {/* Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem", flexWrap: "wrap" }}>
                                    <span style={{
                                      fontSize: "0.62rem", padding: "0.12rem 0.5rem", borderRadius: "999px",
                                      background: typeMeta.bg, color: typeMeta.color,
                                      fontWeight: 600, letterSpacing: "0.04em",
                                    }}>{typeMeta.label}</span>
                                    <span style={{
                                      fontSize: "0.62rem", padding: "0.12rem 0.5rem", borderRadius: "999px",
                                      ...badgeStyle, fontWeight: 600,
                                    }}>{formatDue(a.due)}</span>
                                  </div>
                                  <div style={{
                                    fontSize: "0.85rem", color: a.done ? "var(--muted)" : "var(--fg)",
                                    textDecoration: a.done ? "line-through" : "none",
                                    lineHeight: 1.45, fontWeight: 500,
                                    transition: "all 0.2s",
                                  }}>
                                    {a.title}
                                  </div>
                                </div>

                                {/* Points */}
                                <div style={{
                                  fontSize: "0.72rem", color: a.done ? "var(--muted)" : "#6366f1",
                                  fontWeight: 700, flexShrink: 0, minWidth: 38, textAlign: "right",
                                }}>
                                  {a.points}đ
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── RIGHT: Course progress ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Overall progress */}
            <div style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              borderRadius: "14px", padding: "1.4rem",
              color: "#fff",
            }}>
              <div style={{ fontSize: "0.68rem", opacity: 0.8, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: "0.75rem" }}>
                Tiến độ tổng thể
              </div>
              <div style={{ fontSize: "3rem", fontWeight: 800, fontFamily: "var(--font-name)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                {Math.round(done/total*100)}%
              </div>
              <div style={{ fontSize: "0.8rem", opacity: 0.75, marginTop: "0.3rem" }}>
                {done} / {total} bài tập hoàn thành
              </div>
              <div style={{ marginTop: "1rem", height: 6, borderRadius: "999px", background: "rgba(255,255,255,0.2)", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: "999px",
                  background: "#fff",
                  width: `${Math.round(done/total*100)}%`,
                  transition: "width 0.5s ease",
                }} />
              </div>
            </div>

            {/* Per-course progress */}
            <div style={{
              background: "#fff", border: "1px solid var(--border)",
              borderRadius: "14px", padding: "1.25rem",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}>
              <div style={{ fontSize: "0.7rem", color: "var(--muted)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.1rem" }}>
                Tiến độ từng môn
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {courses.map(c => {
                  const pct = courseProgress(c.code);
                  const total_c = assignments.filter(a => a.subjectCode === c.code).length;
                  const done_c = assignments.filter(a => a.subjectCode === c.code && a.done).length;
                  return (
                    <div key={c.code}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                        <div>
                          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--fg)", lineHeight: 1.2 }}>
                            {c.name.length > 28 ? c.name.slice(0, 28) + "…" : c.name}
                          </div>
                          <div style={{ fontSize: "0.66rem", color: "var(--muted)", marginTop: "0.1rem" }}>
                            {done_c}/{total_c} bài
                          </div>
                        </div>
                        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: c.color, minWidth: 32, textAlign: "right" }}>
                          {pct}%
                        </span>
                      </div>
                      <div style={{ height: 5, borderRadius: "999px", background: "var(--bg-alt2)", overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: "999px",
                          background: c.color,
                          width: `${pct}%`,
                          transition: "width 0.4s ease",
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming deadlines */}
            <div style={{
              background: "#fff", border: "1px solid var(--border)",
              borderRadius: "14px", padding: "1.25rem",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}>
              <div style={{ fontSize: "0.7rem", color: "var(--muted)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>
                Deadline sắp tới
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {assignments
                  .filter(a => !a.done && daysUntil(a.due) >= 0)
                  .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime())
                  .slice(0, 5)
                  .map(a => {
                    const d = daysUntil(a.due);
                    const course = courses.find(c => c.code === a.subjectCode);
                    return (
                      <div key={a.id} style={{
                        display: "flex", alignItems: "center", gap: "0.75rem",
                        padding: "0.65rem 0.85rem", borderRadius: "10px",
                        background: d <= 2 ? "rgba(245,158,11,0.05)" : "var(--bg-alt)",
                        border: "1px solid " + (d <= 2 ? "rgba(245,158,11,0.2)" : "var(--border)"),
                      }}>
                        <div style={{
                          width: 8, height: 8, borderRadius: "50%",
                          background: course?.color ?? "#6366f1", flexShrink: 0,
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "0.78rem", fontWeight: 500, color: "var(--fg)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {a.title.length > 30 ? a.title.slice(0, 30) + "…" : a.title}
                          </div>
                          <div style={{ fontSize: "0.66rem", color: "var(--muted)", marginTop: "0.1rem" }}>
                            {a.subjectCode}
                          </div>
                        </div>
                        <div style={{
                          fontSize: "0.68rem", fontWeight: 700, flexShrink: 0,
                          color: d === 0 ? "#ef4444" : d <= 2 ? "#f59e0b" : "var(--muted)",
                        }}>
                          {d === 0 ? "Hôm nay" : d === 1 ? "Ngày mai" : `${d}n`}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Click-outside for notification panel */}
      {showNotif && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 49 }}
          onClick={() => setShowNotif(false)}
        />
      )}

      {/* File viewer modal */}
      {viewingFile && <FileViewer file={viewingFile} onClose={() => setViewingFile(null)} />}
    </div>
  );
}
