import React from "react";
import { useEffect, useRef, useState } from "react";

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

  :root {
    --fg: #0f0f0f;
    --muted: rgba(15,15,15,0.42);
    --accent: #5046e5;
    --bg: #ffffff;
    --bg-alt: #f9f9fb;
    --bg-alt2: #f3f3f8;
    --border: rgba(0,0,0,0.08);
    --border-strong: rgba(0,0,0,0.14);
    --font-display: 'Plus Jakarta Sans', sans-serif;
    --font-body: 'Inter', sans-serif;
    --font-name: 'Plus Jakarta Sans', sans-serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: var(--font-body); background: var(--bg); color: var(--fg); overflow-x: hidden; cursor: none !important; }
  *, *::before, *::after { cursor: none !important; }

  .cursor-dot { position: fixed; top: 0; left: 0; width: 7px; height: 7px; background: #0f0f0f; border-radius: 50%; pointer-events: none; z-index: 99999; transform: translate(-50%,-50%); transition: width 0.15s, height 0.15s, background 0.15s; will-change: transform; }
  .cursor-ring { position: fixed; top: 0; left: 0; width: 34px; height: 34px; border: 1.5px solid rgba(15,15,15,0.22); border-radius: 50%; pointer-events: none; z-index: 99998; transform: translate(-50%,-50%); will-change: transform; }
  .cursor-spotlight { position: fixed; inset: 0; pointer-events: none; z-index: 0; transition: opacity 0.3s; }

  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; transition: background 0.3s, box-shadow 0.3s; }
  .nav.scrolled { background: rgba(255,255,255,0.92); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); box-shadow: 0 1px 0 var(--border); }
  .nav-inner { display: flex; justify-content: space-between; align-items: center; padding: 1.1rem 2.5rem; max-width: 1200px; margin: 0 auto; }
  .nav-logo { font-family: var(--font-name); font-weight: 800; font-size: 1.2rem; letter-spacing: -0.02em; cursor: pointer; color: var(--fg); }
  .nav-links { display: flex; gap: 2rem; }
  .nav-link { font-size: 0.82rem; font-weight: 500; color: var(--muted); text-decoration: none; cursor: pointer; transition: color 0.2s; }
  .nav-link:hover { color: var(--fg); }
  .nav-link.active { color: var(--fg); }
  .nav-cta { background: var(--fg); color: #fff; border: none; border-radius: 8px; padding: 0.52rem 1.2rem; font-size: 0.8rem; font-family: var(--font-body); cursor: pointer; font-weight: 600; transition: opacity 0.2s; }
  .nav-cta:hover { opacity: 0.82; }
  .nav-item { position: relative; }
  .nav-item-trigger { display: flex; align-items: center; gap: 0.3rem; }
  .nav-item-trigger svg { transition: transform 0.2s ease; }
  .nav-item:hover .nav-item-trigger svg { transform: rotate(180deg); }
  .nav-dropdown { position: absolute; top: calc(100% + 0.75rem); left: 50%; transform: translateX(-50%); background: rgba(255,255,255,0.97); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid var(--border-strong); border-radius: 14px; padding: 0.5rem; min-width: 220px; box-shadow: 0 8px 40px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06); opacity: 0; visibility: hidden; transform: translateX(-50%) translateY(-6px); transition: opacity 0.18s ease, transform 0.18s ease, visibility 0.18s; z-index: 200; }
  .nav-item:hover .nav-dropdown { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0); }
  .nav-dropdown-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 0.85rem; border-radius: 9px; transition: background 0.15s ease; }
  .nav-dropdown-item:hover { background: var(--bg-alt2); }
  .nav-dropdown-icon { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .nav-dropdown-icon-1 { background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%); }
  .nav-dropdown-icon-2 { background: linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%); }
  .nav-dropdown-icon-3 { background: linear-gradient(135deg, #ea580c 0%, #fb923c 100%); }
  .nav-dropdown-label { font-size: 0.8rem; font-weight: 600; color: var(--fg); line-height: 1.2; }
  .nav-dropdown-sub { font-size: 0.68rem; color: var(--muted); line-height: 1.3; margin-top: 0.1rem; }
  .nav-dropdown-divider { height: 1px; background: var(--border); margin: 0.35rem 0.5rem; }

  .hero { position: relative; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; overflow: hidden; background: #fff; }
  .hero-aurora { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
  .aurora-blob { position: absolute; border-radius: 50%; filter: blur(100px); animation: auroraFloat 18s ease-in-out infinite; }
  .aurora-1 { width: 70vw; height: 70vw; left: -20vw; top: -20vw; background: radial-gradient(circle, rgba(91,80,232,0.07) 0%, transparent 65%); animation-duration: 20s; }
  .aurora-2 { width: 60vw; height: 60vw; right: -15vw; top: 10vh; background: radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 65%); animation-duration: 24s; animation-delay: -6s; }
  .aurora-3 { width: 50vw; height: 50vw; left: 20vw; bottom: -10vh; background: radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 65%); animation-duration: 22s; animation-delay: -12s; }
  .aurora-4 { width: 35vw; height: 35vw; right: 18vw; top: 8vh; background: radial-gradient(circle, rgba(168,85,247,0.04) 0%, transparent 65%); animation-duration: 28s; animation-delay: -4s; }
  @keyframes auroraFloat { 0%,100%{transform:translate(0,0) scale(1)} 25%{transform:translate(2vw,-3vh) scale(1.06)} 50%{transform:translate(-1vw,2vh) scale(0.97)} 75%{transform:translate(1vw,1vh) scale(1.03)} }
  .hero-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(0,0,0,0.04) 1px,transparent 1px), linear-gradient(90deg,rgba(0,0,0,0.04) 1px,transparent 1px); background-size: 52px 52px; mask-image: radial-gradient(ellipse 75% 65% at 50% 40%, black 10%, transparent 100%); -webkit-mask-image: radial-gradient(ellipse 75% 65% at 50% 40%, black 10%, transparent 100%); }
  .hero-fade-bottom { position: absolute; bottom: 0; left: 0; right: 0; height: 30%; background: linear-gradient(to bottom, transparent, #ffffff); z-index: 1; }
  .hero-content { position: relative; z-index: 2; padding: 0 1.5rem; }
  .hero-eyebrow { display: inline-flex; align-items: center; gap: 0.45rem; font-size: 0.7rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); border: 1px solid var(--border-strong); border-radius: 999px; padding: 0.38rem 1rem; margin-bottom: 2rem; font-weight: 500; background: rgba(0,0,0,0.03); }
  .hero-name { font-size: clamp(3.5rem, 13vw, 11rem); line-height: 0.88; display: flex; align-items: baseline; justify-content: center; gap: 0.18em; flex-wrap: wrap; }
  .hero-name-word { display: inline-flex; align-items: baseline; }
  .hero-letter { display: inline-block; font-family: 'Fraunces', serif; font-style: italic; font-weight: 300; font-variation-settings: 'opsz' 72; transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1); }
  .hero-name:hover .hero-letter { transform: translateY(-0.14em); }
  .hero-letter-ngoc { color: rgba(15,15,15,0.38); letter-spacing: -0.01em; }
  .hero-letter-phuc { color: var(--fg); letter-spacing: -0.02em; }
  .hero-tagline { color: var(--muted); font-size: clamp(0.88rem, 1.3vw, 1rem); margin-top: 1.75rem; line-height: 1.9; font-weight: 400; max-width: 500px; margin-left: auto; margin-right: auto; }
  .hero-cta { margin-top: 2.25rem; display: inline-flex; align-items: center; gap: 0.55rem; font-size: 0.85rem; font-weight: 600; color: #fff; background: var(--fg); border: none; border-radius: 8px; padding: 0.75rem 1.75rem; cursor: pointer; font-family: var(--font-body); transition: all 0.2s; letter-spacing: 0.01em; }
  .hero-cta:hover { opacity: 0.82; transform: translateY(-1px); }

  .section { padding: 6rem 2rem; max-width: 1100px; margin: 0 auto; }
  .section-label { font-size: 0.68rem; letter-spacing: 0.16em; color: var(--muted); text-transform: uppercase; margin-bottom: 0.75rem; font-weight: 600; }
  .section-title { font-family: var(--font-name); font-size: clamp(1.9rem, 3.5vw, 2.8rem); font-weight: 700; margin-bottom: 0.5rem; letter-spacing: -0.03em; color: var(--fg); }
  .section-sub { color: var(--muted); font-size: 0.92rem; margin-bottom: 2.5rem; font-weight: 400; }
  .section-wrap { background: var(--bg); padding: 5.5rem 0; }
  .section-wrap.dark { background: var(--bg-alt); }
  .section-wrap.green { background: var(--bg-alt2); }

  .news-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent; margin: 0 -2rem; padding: 0 2rem 1.25rem; }
  .news-scroll::-webkit-scrollbar { height: 4px; }
  .news-scroll::-webkit-scrollbar-track { background: transparent; }
  .news-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 999px; }
  .news-scroll-inner { display: flex; gap: 1.25rem; width: max-content; }
  .news-card { width: 310px; flex-shrink: 0; border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; background: #fff; cursor: pointer; transition: box-shadow 0.2s, transform 0.2s; }
  .news-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); transform: translateY(-2px); }
  .news-card.expanded { box-shadow: 0 4px 20px rgba(0,0,0,0.08); transform: none; border-color: var(--border-strong); }
  .news-type-badge { display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.6rem; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.15rem 0.5rem; border-radius: 999px; }
  .news-type-hot { background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.2); }
  .news-type-wiki { background: rgba(100,149,237,0.15); color: #6495ed; border: 1px solid rgba(100,149,237,0.25); }
  .news-type-paper { background: rgba(251,191,36,0.1); color: #fbbf24; border: 1px solid rgba(251,191,36,0.2); }
  .news-type-social { background: rgba(167,139,250,0.15); color: #a78bfa; border: 1px solid rgba(167,139,250,0.25); }
  .news-tag { display: inline-block; font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.2rem 0.6rem; border-radius: 999px; background: rgba(80,70,229,0.08); color: var(--accent); border: 1px solid rgba(80,70,229,0.18); margin-bottom: 0.75rem; }
  .news-title { font-family: var(--font-name); font-size: 1.05rem; font-weight: 600; line-height: 1.35; margin-bottom: 0.6rem; color: var(--fg); }
  .news-desc { font-size: 0.8rem; color: var(--muted); line-height: 1.7; margin-bottom: 1rem; }
  .news-meta { font-size: 0.7rem; color: rgba(15,15,15,0.35); }
  .news-source-link { font-size: 0.72rem; color: var(--accent); margin-top: 0.5rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.3rem; }
  .news-source-link:hover { text-decoration: underline; }
  .news-expand { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border); }
  .news-analysis { font-size: 0.82rem; color: var(--muted); line-height: 1.8; margin-bottom: 1rem; }
  .read-more-btn { display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(80,70,229,0.07); border: 1px solid rgba(80,70,229,0.2); color: var(--accent); border-radius: 8px; padding: 0.45rem 1rem; font-size: 0.78rem; cursor: pointer; font-family: var(--font-body); transition: background 0.2s; margin-top: 0.5rem; }
  .read-more-btn:hover { background: rgba(80,70,229,0.13); }

  .ai-btn { display: inline-flex; align-items: center; gap: 0.5rem; background: transparent; border: 1px solid var(--border-strong); color: var(--fg); border-radius: 8px; padding: 0.48rem 1.1rem; font-size: 0.78rem; cursor: pointer; font-family: var(--font-body); transition: background 0.2s; font-weight: 500; }
  .ai-btn:hover { background: rgba(0,0,0,0.04); }
  .ai-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ARTICLE PAGE */
  .article-page { position: fixed; inset: 0; background: #fff; z-index: 200; display: flex; flex-direction: column; animation: slideUp 0.4s ease; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .article-back { background: rgba(255,255,255,0.95); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); padding: 0.75rem 1.5rem; display: flex; align-items: center; gap: 1rem; z-index: 10; border-bottom: 1px solid var(--border); flex-shrink: 0; }
  .article-back-btn { background: transparent; border: 1px solid var(--border-strong); color: var(--fg); border-radius: 8px; padding: 0.4rem 1rem; font-size: 0.8rem; cursor: pointer; font-family: var(--font-body); transition: background 0.2s; font-weight: 500; }
  .article-back-btn:hover { background: rgba(0,0,0,0.04); }
  .article-split { display: flex; flex: 1; overflow: hidden; }
  .article-split-left { flex: 1; overflow-y: auto; }
  .article-split-right { width: 360px; flex-shrink: 0; border-left: 1px solid var(--border); display: flex; flex-direction: column; background: var(--bg-alt); }
  .art-chat-header { padding: 0.9rem 1.25rem; border-bottom: 1px solid var(--border); font-size: 0.78rem; color: var(--muted); flex-shrink: 0; }
  .art-chat-msgs { flex: 1; overflow-y: auto; padding: 1rem 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; }
  .art-chat-msg { padding: 0.6rem 0.85rem; border-radius: 10px; font-size: 0.82rem; line-height: 1.65; max-width: 92%; }
  .art-chat-msg.user { background: rgba(80,70,229,0.08); color: var(--fg); align-self: flex-end; border: 1px solid rgba(80,70,229,0.15); }
  .art-chat-msg.ai { background: #fff; color: var(--fg); align-self: flex-start; border: 1px solid var(--border); }
  .art-chat-input-row { padding: 0.75rem 1rem; border-top: 1px solid var(--border); display: flex; gap: 0.5rem; flex-shrink: 0; }
  .art-chat-input { flex: 1; background: #fff; border: 1px solid var(--border-strong); border-radius: 8px; padding: 0.5rem 0.85rem; color: var(--fg); font-family: var(--font-body); font-size: 0.82rem; outline: none; }
  .art-chat-input::placeholder { color: var(--muted); }
  .article-inner { max-width: 720px; margin: 0 auto; padding: 2.5rem 2rem 5rem; }
  .article-tag { display: inline-block; font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.25rem 0.7rem; border-radius: 999px; background: rgba(80,70,229,0.08); color: var(--accent); border: 1px solid rgba(80,70,229,0.18); margin-bottom: 1.25rem; font-weight: 600; }
  .article-title { font-family: var(--font-name); font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 700; line-height: 1.15; margin-bottom: 1rem; letter-spacing: -0.02em; color: var(--fg); }
  .article-meta { font-size: 0.75rem; color: var(--muted); margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
  .article-img { width: 100%; height: 120px; border-radius: 12px; background: var(--bg-alt); display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; border: 1px solid var(--border); overflow: hidden; position: relative; }
  .article-img-loading { font-size: 0.85rem; color: var(--muted); }
  .article-body { font-size: 0.95rem; line-height: 1.95; color: rgba(15,15,15,0.82); }
  .article-body p { margin-bottom: 1.4rem; }
  .article-body .en-term { color: #7c5a1e; font-style: italic; font-weight: 500; }
  .article-glossary { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--border); }
  .article-glossary-title { font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin-bottom: 1.25rem; font-weight: 600; }
  .glossary-item { display: flex; gap: 1rem; margin-bottom: 1rem; padding: 0.85rem 1rem; background: var(--bg-alt); border-radius: 10px; border-left: 2px solid rgba(124,90,30,0.4); }
  .glossary-term { font-size: 0.82rem; color: #7c5a1e; font-style: italic; min-width: 140px; font-weight: 600; }
  .glossary-def { font-size: 0.82rem; color: var(--muted); line-height: 1.6; }
  .article-source-link { display: inline-flex; align-items: center; gap: 0.5rem; color: var(--accent); font-size: 0.85rem; text-decoration: none; margin-top: 2rem; font-weight: 500; }
  .article-source-link:hover { text-decoration: underline; }

  /* VOICE BOT */
  /* ── Voice Bot 2025 ─────────────────────────────── */
  @property --vbot-angle { syntax:'<angle>'; initial-value:0deg; inherits:false; }
  @keyframes vbotOrbRotate { to { --vbot-angle: 360deg; } }
  .vbot-card { border-radius: 28px; overflow: hidden; background: rgba(8,8,18,0.93); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid rgba(99,102,241,0.18); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04), 0 30px 80px rgba(0,0,0,0.55), 0 0 60px rgba(99,102,241,0.06); }
  .vbot-hero { display: flex; flex-direction: column; align-items: center; padding: 3rem 2rem 2rem; gap: 1.5rem; position: relative; }
  .vbot-hero::before { content:''; position:absolute; inset:0; background: radial-gradient(ellipse 70% 55% at 50% -5%, rgba(99,102,241,0.18) 0%, transparent 70%); pointer-events:none; }
  .vbot-orb-wrap { position: relative; width: 140px; height: 140px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
  .vbot-glow { position: absolute; inset: -28px; border-radius: 50%; background: radial-gradient(circle, rgba(99,102,241,0.32) 0%, transparent 65%); opacity: 0; transition: opacity 0.4s; pointer-events: none; }
  .vbot-glow.on { opacity: 1; animation: vbotGlowPulse 2.5s ease-in-out infinite; }
  @keyframes vbotGlowPulse { 0%,100%{transform:scale(1);opacity:0.8} 50%{transform:scale(1.3);opacity:0.35} }
  .vbot-orb { width: 100px; height: 100px; border-radius: 50%; background: conic-gradient(from var(--vbot-angle), #312e81, #4f46e5, #7c3aed, #a855f7, #6366f1, #4338ca, #312e81); animation: vbotOrbRotate 5s linear infinite; display: flex; align-items: center; justify-content: center; position: relative; z-index: 1; box-shadow: 0 0 0 3px rgba(99,102,241,0.15), 0 0 40px rgba(99,102,241,0.25), inset 0 0 24px rgba(0,0,0,0.35); transition: transform 0.2s; }
  .vbot-orb::after { content:''; position:absolute; inset:6px; border-radius:50%; background: radial-gradient(circle at 38% 32%, rgba(255,255,255,0.18) 0%, transparent 58%); pointer-events:none; }
  .vbot-orb:hover { transform: scale(1.04); }
  .vbot-orb.listening { animation: vbotOrbRotate 1.8s linear infinite; background: conic-gradient(from var(--vbot-angle), #7f1d1d, #dc2626, #ef4444, #fca5a5, #ef4444, #991b1b, #7f1d1d); box-shadow: 0 0 0 3px rgba(239,68,68,0.2), 0 0 50px rgba(239,68,68,0.3), inset 0 0 24px rgba(0,0,0,0.3); }
  .vbot-orb.speaking { animation: vbotOrbRotate 3s linear infinite; background: conic-gradient(from var(--vbot-angle), #1e1b4b, #4f46e5, #ffffff, #c7d2fe, #ffffff, #4338ca, #1e1b4b); box-shadow: 0 0 0 3px rgba(99,102,241,0.25), 0 0 60px rgba(99,102,241,0.4), inset 0 0 24px rgba(0,0,0,0.3); }
  .vbot-orb-icon { position: relative; z-index: 2; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.6)); }
  .vbot-waveform { display: flex; align-items: center; gap: 3px; height: 28px; }
  .vbot-bar { width: 3px; border-radius: 99px; background: linear-gradient(to top, #6366f1, #a78bfa); }
  .vbot-bar.idle { height: 3px; opacity: 0.35; }
  .vbot-bar.active { animation: vbotBarWave 0.7s ease-in-out infinite; }
  .vbot-bar:nth-child(1).active{animation-delay:0s} .vbot-bar:nth-child(2).active{animation-delay:0.08s} .vbot-bar:nth-child(3).active{animation-delay:0.18s} .vbot-bar:nth-child(4).active{animation-delay:0.12s} .vbot-bar:nth-child(5).active{animation-delay:0.04s} .vbot-bar:nth-child(6).active{animation-delay:0.22s} .vbot-bar:nth-child(7).active{animation-delay:0.09s}
  @keyframes vbotBarWave { 0%,100%{height:3px;opacity:0.35} 50%{height:22px;opacity:1} }
  .vbot-name-row { text-align: center; }
  .vbot-name { font-family: var(--font-name); font-size: 1.5rem; font-weight: 600; letter-spacing: -0.01em; color: #fff; }
  .vbot-online { font-size: 0.68rem; color: #4ade80; display: flex; align-items: center; gap: 0.3rem; justify-content: center; margin-top: 0.2rem; }
  .vbot-online-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; flex-shrink: 0; animation: vbotDotBlink 2s ease-in-out infinite; }
  @keyframes vbotDotBlink { 0%,100%{opacity:1;box-shadow:0 0 5px #4ade80} 50%{opacity:0.4;box-shadow:none} }
  .vbot-status { font-size: 0.78rem; color: rgba(255,255,255,0.45); min-height: 1.2em; text-align: center; transition: color 0.3s; }
  .vbot-status.active { color: #a78bfa; }
  .vbot-controls { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; width: 100%; max-width: 340px; }
  .vbot-mic-wrap { position: relative; display: flex; align-items: center; justify-content: center; width: 72px; height: 72px; }
  .vbot-sonar { position: absolute; width: 64px; height: 64px; border-radius: 50%; border: 1.5px solid rgba(239,68,68,0.6); opacity: 0; pointer-events: none; }
  .vbot-sonar.active { animation: vbotSonar 1.6s ease-out infinite; }
  .vbot-sonar-2.active { animation: vbotSonar 1.6s ease-out 0.8s infinite; }
  @keyframes vbotSonar { 0%{transform:scale(1);opacity:0.7} 100%{transform:scale(2.5);opacity:0} }
  .vbot-mic-btn { width: 64px; height: 64px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; background: rgba(99,102,241,0.1); border: 1.5px solid rgba(99,102,241,0.3); box-shadow: 0 4px 20px rgba(99,102,241,0.12); color: rgba(255,255,255,0.8); position: relative; z-index: 1; }
  .vbot-mic-btn:hover:not(:disabled) { background: rgba(99,102,241,0.22); transform: scale(1.07); box-shadow: 0 4px 28px rgba(99,102,241,0.28); border-color: rgba(99,102,241,0.5); color: white; }
  .vbot-mic-btn.listening { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.45); color: #fca5a5; }
  .vbot-mic-btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }
  .vbot-mic-label { font-size: 0.68rem; color: rgba(255,255,255,0.45); letter-spacing: 0.07em; text-transform: uppercase; }
  .vbot-modes { display: flex; gap: 0.4rem; flex-wrap: wrap; justify-content: center; }
  .vbot-mode-chip { font-size: 0.64rem; padding: 0.3rem 0.85rem; border-radius: 999px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.55); cursor: pointer; font-family: var(--font-body); transition: all 0.15s; letter-spacing: 0.04em; display: inline-flex; align-items: center; gap: 0.3rem; }
  .vbot-mode-chip:hover { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.9); }
  .vbot-mode-chip.active { background: rgba(99,102,241,0.16); border-color: rgba(99,102,241,0.4); color: #c4b5fd; }
  .vbot-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(99,102,241,0.18), transparent); }
  .vbot-chat { display: flex; flex-direction: column; height: 340px; }
  .vbot-msgs { flex: 1; overflow-y: auto; padding: 1.5rem 1.75rem; display: flex; flex-direction: column; gap: 1rem; scrollbar-width: thin; scrollbar-color: rgba(99,102,241,0.2) transparent; }
  .vbot-turn { display: flex; align-items: flex-end; gap: 0.65rem; }
  .vbot-turn.user { flex-direction: row-reverse; }
  .vbot-avatar { width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .vbot-avatar.ai { background: linear-gradient(135deg, #4f46e5, #7c3aed); box-shadow: 0 0 14px rgba(99,102,241,0.3); }
  .vbot-avatar.user { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); }
  .vbot-bubble { padding: 0.7rem 1.1rem; border-radius: 18px; font-size: 0.85rem; line-height: 1.65; max-width: 78%; }
  .vbot-bubble.ai { background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.16); color: rgba(255,255,255,0.92); border-bottom-left-radius: 4px; }
  .vbot-bubble.user { background: linear-gradient(135deg, rgba(99,102,241,0.28), rgba(124,58,237,0.22)); border: 1px solid rgba(99,102,241,0.28); color: #fff; border-bottom-right-radius: 4px; }
  .vbot-correction { font-size: 0.71rem; color: #fbbf24; padding: 0.3rem 0.75rem; background: rgba(251,191,36,0.06); border: 1px solid rgba(251,191,36,0.16); border-radius: 8px; margin-top: 0.25rem; align-self: flex-end; max-width: 78%; }
  .vbot-input-row { border-top: 1px solid rgba(255,255,255,0.05); padding: 0.85rem 1.25rem; display: flex; gap: 0.6rem; flex-shrink: 0; background: rgba(0,0,0,0.25); align-items: center; }
  .vbot-text-input { flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 0.6rem 1rem; color: #fff; font-family: var(--font-body); font-size: 0.83rem; outline: none; transition: border-color 0.2s; }
  .vbot-text-input:focus { border-color: rgba(99,102,241,0.4); }
  .vbot-text-input::placeholder { color: rgba(255,255,255,0.16); }
  .vbot-send-btn { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, #4f46e5, #7c3aed); border: none; color: white; cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all 0.15s; box-shadow: 0 2px 14px rgba(99,102,241,0.3); }
  .vbot-send-btn:hover:not(:disabled) { transform: scale(1.08); box-shadow: 0 4px 22px rgba(99,102,241,0.5); }
  .vbot-send-btn:disabled { opacity: 0.22; cursor: not-allowed; transform: none; }
  .chat-area { padding: 1.5rem; border-top: 1px solid rgba(255,255,255,0.08); max-height: 320px; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; }
  .chat-msg { padding: 0.75rem 1rem; border-radius: 10px; font-size: 0.85rem; line-height: 1.7; max-width: 85%; }
  .chat-msg.user { background: rgba(255,255,255,0.12); color: var(--fg); align-self: flex-end; }
  .chat-msg.ai { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.85); align-self: flex-start; }
  .chat-input-row { border-top: 1px solid rgba(255,255,255,0.08); padding: 1rem 1.5rem; display: flex; gap: 0.75rem; }
  .chat-input { flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 0.6rem 1rem; color: var(--fg); font-family: var(--font-body); font-size: 0.85rem; outline: none; }
  .chat-input::placeholder { color: rgba(255,255,255,0.25); }

  .roadmap-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
  .xp-bar-wrap { display: flex; align-items: center; gap: 1rem; }
  .xp-label { font-size: 0.8rem; color: var(--accent); }
  .xp-bar { width: 180px; height: 6px; background: rgba(255,255,255,0.1); border-radius: 999px; overflow: hidden; }
  .xp-fill { height: 100%; background: linear-gradient(90deg, #ffffff, #6366f1); border-radius: 999px; transition: width 0.5s ease; }
  .streak { font-size: 0.85rem; color: #fbbf24; }
  .roadmap-tabs { display: flex; gap: 0.5rem; margin-bottom: 2rem; flex-wrap: wrap; }
  .tab { padding: 0.4rem 1rem; border-radius: 999px; border: 1px solid rgba(255,255,255,0.15); font-size: 0.78rem; cursor: pointer; color: var(--muted); background: transparent; font-family: var(--font-body); transition: all 0.2s; }
  .tab.active { background: var(--accent); color: #000; border-color: var(--accent); font-weight: 500; }
  .today-box { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; box-shadow: 0 1px 6px rgba(0,0,0,0.05); }
  .today-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
  .today-title { font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); font-weight: 600; }
  @media (max-width: 768px) { .gm-stats { grid-template-columns: auto 1fr auto; gap: 1rem; } .skill-node { width: 140px; } .achiev-grid { grid-template-columns: repeat(2,1fr); } }
  .task-list { display: flex; flex-direction: column; gap: 0.6rem; }
  .task-item { display: flex; align-items: center; gap: 0.9rem; padding: 0.75rem 1rem; border-radius: 8px; background: var(--bg-alt); border: 1px solid var(--border); }
  .task-item.done { opacity: 0.5; }
  .task-check { width: 20px; height: 20px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; cursor: pointer; transition: all 0.2s; }
  .task-check.checked { background: var(--accent); border-color: var(--accent); }
  .task-text-input { flex: 1; background: transparent; border: none; outline: none; color: var(--fg); font-family: var(--font-body); font-size: 0.85rem; }
  .task-text-input.done-text { text-decoration: line-through; color: var(--muted); }
  .task-text-input::placeholder { color: rgba(255,255,255,0.2); }
  .task-xp-input { width: 54px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 0.2rem 0.4rem; color: var(--accent); font-size: 0.75rem; text-align: center; outline: none; font-family: var(--font-body); }
  .task-delete { background: none; border: none; color: rgba(255,255,255,0.2); cursor: pointer; font-size: 1rem; transition: color 0.2s; }
  .task-delete:hover { color: #f87171; }
  .add-task-btn { display: flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.04); border: 1px dashed rgba(255,255,255,0.15); border-radius: 10px; padding: 0.65rem 1rem; color: var(--muted); font-size: 0.82rem; cursor: pointer; font-family: var(--font-body); width: 100%; margin-top: 0.5rem; transition: background 0.2s; }
  .add-task-btn:hover { background: rgba(255,255,255,0.08); }
  .gm-stats { display: grid; grid-template-columns: auto 1fr auto; gap: 1.5rem; align-items: center; background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem 1.5rem; margin-bottom: 2rem; box-shadow: 0 1px 6px rgba(0,0,0,0.05); }
  .rank-badge { display: flex; flex-direction: column; align-items: center; gap: 0.35rem; min-width: 64px; }
  .rank-icon { display: flex; align-items: center; justify-content: center; }
  .rank-name { font-size: 0.62rem; letter-spacing: 0.14em; text-transform: uppercase; }
  .level-info { display: flex; flex-direction: column; gap: 0.6rem; }
  .level-row { display: flex; align-items: center; gap: 0.75rem; }
  .level-title { font-size: 0.82rem; font-weight: 500; white-space: nowrap; }
  .xp-bar-lg { flex: 1; height: 8px; background: rgba(255,255,255,0.08); border-radius: 999px; overflow: hidden; }
  .xp-fill-lg { height: 100%; border-radius: 999px; transition: width 0.6s ease; }
  .xp-caption { font-size: 0.7rem; color: var(--muted); }
  .gm-right { display: flex; flex-direction: column; align-items: center; gap: 0.2rem; min-width: 56px; }
  .streak-num { font-size: 1.6rem; font-weight: 700; color: #f97316; line-height: 1; }
  .streak-lbl { font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }
  .gm-tabs { display: flex; gap: 0.25rem; margin-bottom: 1.75rem; background: var(--bg-alt); border-radius: 10px; padding: 0.3rem; border: 1px solid var(--border); }
  .gm-tab { flex: 1; padding: 0.5rem 0.3rem; border-radius: 7px; border: none; font-family: var(--font-body); font-size: 0.78rem; cursor: pointer; color: var(--muted); background: transparent; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; gap: 0.35rem; font-weight: 500; }
  .gm-tab.active { background: #fff; color: var(--fg); font-weight: 600; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
  .quest-grid { display: flex; flex-direction: column; gap: 0.75rem; }
  .quest-card { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); cursor: pointer; transition: all 0.2s; user-select: none; }
  .quest-card:hover:not(.done) { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.14); }
  .quest-card.done { opacity: 0.55; border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.04); cursor: default; }
  .quest-icon { font-size: 1.3rem; width: 32px; text-align: center; flex-shrink: 0; }
  .quest-text { flex: 1; font-size: 0.88rem; line-height: 1.4; }
  .quest-xp { font-size: 0.78rem; color: var(--accent); font-weight: 600; white-space: nowrap; }
  .quest-done-check { font-size: 1rem; color: var(--accent); }
  .skill-tree-wrap { display: flex; flex-direction: column; gap: 2rem; }
  .tier-section { }
  .tier-label { font-size: 0.65rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .tier-nodes { display: flex; gap: 0.75rem; flex-wrap: wrap; }
  .skill-node { border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1rem 1.1rem; background: rgba(255,255,255,0.03); width: 180px; flex-shrink: 0; transition: all 0.25s; }
  .skill-node.unlocked { border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.06); }
  .skill-node.locked { opacity: 0.38; filter: grayscale(0.5); }
  .sn-icon { font-size: 1.4rem; margin-bottom: 0.35rem; }
  .sn-name { font-size: 0.84rem; font-weight: 500; margin-bottom: 0.2rem; }
  .sn-desc { font-size: 0.71rem; color: var(--muted); line-height: 1.45; margin-bottom: 0.5rem; }
  .sn-req { font-size: 0.67rem; color: #fbbf24; }
  .sn-badge { font-size: 0.67rem; color: var(--accent); font-weight: 500; }
  .achiev-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.85rem; }
  .achiev-card { border: 1px solid var(--border); border-radius: 10px; padding: 1.1rem 1rem; background: #fff; display: flex; flex-direction: column; align-items: center; gap: 0.4rem; text-align: center; transition: all 0.2s; }
  .achiev-card.unlocked { border-color: rgba(80,70,229,0.2); box-shadow: 0 2px 12px rgba(80,70,229,0.08); }
  .achiev-card.locked { opacity: 0.35; filter: grayscale(1); }
  .ach-icon { font-size: 1.75rem; }
  .ach-name { font-size: 0.78rem; font-weight: 500; }
  .ach-desc { font-size: 0.67rem; color: var(--muted); line-height: 1.4; }
  @keyframes xpPop { 0%{opacity:0;transform:translateY(4px) scale(0.9)} 15%{opacity:1;transform:translateY(0) scale(1.1)} 80%{opacity:1} 100%{opacity:0;transform:translateY(-24px)} }
  .xp-popup { position:fixed; pointer-events:none; z-index:9999; font-size:1rem; font-weight:700; color:#ffffff; text-shadow: 0 0 12px rgba(255,255,255,0.8); animation: xpPop 1.4s ease forwards; }
  .topic-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1rem; }
  .topic-card { border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.25rem; background: rgba(255,255,255,0.03); }
  .topic-card.active-topic { border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.05); }
  .topic-name { font-size: 0.9rem; font-weight: 500; margin-bottom: 0.3rem; }
  .topic-desc { font-size: 0.75rem; color: var(--muted); line-height: 1.5; margin-bottom: 0.75rem; }
  .topic-progress { height: 3px; background: rgba(255,255,255,0.08); border-radius: 999px; overflow: hidden; }
  .topic-fill { height: 100%; background: var(--accent); border-radius: 999px; }

  .interview-list { display: flex; flex-direction: column; gap: 1rem; }
  .interview-item { border: 1px solid var(--border); border-radius: 10px; overflow: hidden; background: #fff; }
  .interview-q { padding: 1.1rem 1.5rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 1rem; transition: background 0.2s; }
  .interview-q:hover { background: var(--bg-alt); }
  .interview-q-text { font-size: 0.9rem; font-weight: 500; }
  .interview-level { font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.2rem 0.6rem; border-radius: 999px; }
  .level-easy { background: rgba(74,222,128,0.1); color: #4ade80; border: 1px solid rgba(74,222,128,0.2); }
  .level-medium { background: rgba(251,191,36,0.1); color: #fbbf24; border: 1px solid rgba(251,191,36,0.2); }
  .level-hard { background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.2); }
  .interview-body { padding: 0 1.5rem; max-height: 0; overflow: hidden; transition: max-height 0.3s ease, padding 0.3s; border-top: 0px solid var(--border); }
  .interview-body.open { max-height: 600px; padding: 1rem 1.5rem 1.5rem; border-top: 1px solid var(--border); }
  .interview-answer-area { width: 100%; background: var(--bg-alt); border: 1px solid var(--border-strong); border-radius: 8px; padding: 0.75rem 1rem; color: var(--fg); font-family: var(--font-body); font-size: 0.85rem; line-height: 1.7; resize: none; outline: none; min-height: 100px; margin-bottom: 0.75rem; }
  .interview-answer-area::placeholder { color: var(--muted); }
  .feedback-box { background: rgba(80,70,229,0.05); border: 1px solid rgba(80,70,229,0.15); border-radius: 10px; padding: 1rem 1.25rem; font-size: 0.85rem; line-height: 1.8; color: var(--fg); }
  .score-badge { display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(80,70,229,0.08); color: var(--accent); border-radius: 999px; padding: 0.3rem 0.8rem; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.75rem; border: 1px solid rgba(80,70,229,0.18); }

  .api-key-banner { background: rgba(251,191,36,0.07); border: 1px solid rgba(251,191,36,0.3); border-radius: 10px; padding: 0.75rem 1.25rem; margin-bottom: 1.5rem; font-size: 0.82rem; color: #a06c00; display: flex; align-items: center; gap: 0.6rem; }
  .api-key-input { background: #fff; border: 1px solid var(--border-strong); border-radius: 8px; padding: 0.45rem 0.85rem; color: var(--fg); font-family: var(--font-body); font-size: 0.82rem; outline: none; width: 280px; }
  .api-key-input::placeholder { color: var(--muted); }

  .loading-dots::after { content: '...'; animation: dots 1.2s steps(3,end) infinite; }
  @keyframes dots { 0%,20%{content:'.'} 40%{content:'..'} 60%,100%{content:'...'} }

  /* FEATURE CARDS */
  .features-section { padding: 5rem 0 6rem; background: var(--bg); }
  .features-eyebrow { font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); font-weight: 600; margin-bottom: 1rem; text-align: center; }
  .features-heading { font-family: 'Fraunces', serif; font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; font-style: italic; color: var(--fg); letter-spacing: -0.02em; font-variation-settings: 'opsz' 72; line-height: 1.1; text-align: center; margin-bottom: 3.5rem; }
  .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; }
  .feat-card { position: relative; border-radius: 20px; padding: 2rem 2rem 2.5rem; cursor: pointer; overflow: hidden; transition: transform 0.25s ease, box-shadow 0.25s ease; border: 1px solid var(--border); display: flex; flex-direction: column; gap: 0; background: var(--bg-alt); }
  .feat-card:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.08); }
  .feat-card-accent { position: absolute; inset: 0; opacity: 0; transition: opacity 0.3s ease; border-radius: 20px; pointer-events: none; }
  .feat-card:hover .feat-card-accent { opacity: 1; }
  .feat-card-1 .feat-card-accent { background: linear-gradient(135deg, rgba(99,102,241,0.06) 0%, transparent 60%); }
  .feat-card-2 .feat-card-accent { background: linear-gradient(135deg, rgba(20,184,166,0.07) 0%, transparent 60%); }
  .feat-card-3 .feat-card-accent { background: linear-gradient(135deg, rgba(249,115,22,0.06) 0%, transparent 60%); }
  .feat-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; flex-shrink: 0; }
  .feat-icon-1 { background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%); }
  .feat-icon-2 { background: linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%); }
  .feat-icon-3 { background: linear-gradient(135deg, #ea580c 0%, #fb923c 100%); }
  .feat-tag { font-size: 0.65rem; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 700; margin-bottom: 0.6rem; }
  .feat-tag-1 { color: #6366f1; }
  .feat-tag-2 { color: #0d9488; }
  .feat-tag-3 { color: #ea580c; }
  .feat-title { font-size: 1.35rem; font-weight: 600; color: var(--fg); line-height: 1.2; margin-bottom: 0.75rem; letter-spacing: -0.01em; }
  .feat-desc { font-size: 0.875rem; color: var(--muted); line-height: 1.65; flex: 1; }
  .feat-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 2rem; padding-top: 1.25rem; border-top: 1px solid var(--border); }
  .feat-cta { font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; gap: 0.4rem; transition: gap 0.2s ease; }
  .feat-cta-1 { color: #6366f1; }
  .feat-cta-2 { color: #0d9488; }
  .feat-cta-3 { color: #ea580c; }
  .feat-card:hover .feat-cta { gap: 0.65rem; }
  .feat-pill { font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; padding: 0.25rem 0.7rem; border-radius: 999px; }
  .feat-pill-1 { background: rgba(99,102,241,0.1); color: #6366f1; }
  .feat-pill-2 { background: rgba(13,148,136,0.1); color: #0d9488; }
  .feat-pill-3 { background: rgba(234,88,12,0.1); color: #ea580c; }
  @media (max-width: 900px) { .features-grid { grid-template-columns: 1fr; } }
  @media (max-width: 640px) { .features-grid { padding: 0 1rem; } .feat-card { padding: 1.5rem 1.5rem 2rem; } }

  .placeholder-page { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.5rem; padding: 2rem; text-align: center; background: var(--bg); }
  .placeholder-badge { font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); border: 1px solid var(--border-strong); border-radius: 999px; padding: 0.38rem 1rem; font-weight: 600; background: rgba(0,0,0,0.03); }
  .placeholder-title { font-family: var(--font-name); font-size: clamp(2.5rem, 8vw, 6rem); font-weight: 300; font-style: italic; color: rgba(15,15,15,0.2); letter-spacing: -0.02em; font-variation-settings: 'opsz' 72; font-family: 'Fraunces', serif; line-height: 1; }
  .placeholder-sub { font-size: 0.88rem; color: var(--muted); font-weight: 400; }

  @media (max-width: 768px) {
    .nav-links { display: none; }
    .news-scroll { margin: 0 -1rem; padding: 0 1rem 1.25rem; }
    .topic-grid { grid-template-columns: 1fr; }
    .translator-top { grid-template-columns: 1fr; }
    .article-split { flex-direction: column; }
    .article-split-right { width: 100%; height: 45vh; border-left: none; border-top: 1px solid rgba(255,255,255,0.07); }
    .trans-panel.left { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.08); }
  }
`;

const RANK_SVGS: Record<string, React.ReactElement> = {
  Rookie:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><path d="M7 20h10M12 20v-9"/><path d="M12 11C12 7.5 16 5.5 16 5.5s0 4.5-4 5.5"/><path d="M12 11C12 7.5 8 5.5 8 5.5s0 4.5 4 5.5"/></svg>,
  Iron:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="28" height="28"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  Bronze:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><path d="M12 2l10 7-10 7L2 9z"/><path d="M12 16v6"/><path d="M6 21h12"/></svg>,
  Silver:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
  Gold:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><path d="M2 19h20"/><path d="M3 19L5 7l7 7 7-7 2 12"/><circle cx="12" cy="4" r="1.2" fill="currentColor"/><circle cx="4" cy="7" r="1" fill="currentColor"/><circle cx="20" cy="7" r="1" fill="currentColor"/></svg>,
  Platinum: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><polygon points="6 3 18 3 22 9 12 22 2 9"/><line x1="2" y1="9" x2="22" y2="9"/><line x1="12" y1="3" x2="6" y2="9"/><line x1="12" y1="3" x2="18" y2="9"/></svg>,
  Diamond:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><path d="M15 3H9L3 9l9 13 9-13z"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="3" x2="7.5" y2="9"/><line x1="15" y1="3" x2="16.5" y2="9"/></svg>,
};

const ACHIEV_SVGS: Record<string, React.ReactElement> = {
  first_xp:    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M13 2L3 14h9l-1 8 10-12h-9z"/></svg>,
  xp_300:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M7 20h10M12 20v-9"/><path d="M12 11C12 7.5 16 5.5 16 5.5s0 4.5-4 5.5"/><path d="M12 11C12 7.5 8 5.5 8 5.5s0 4.5 4 5.5"/></svg>,
  xp_800:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M12 2l10 7-10 7L2 9z"/><path d="M12 16v6M6 21h12"/></svg>,
  xp_2000:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
  xp_4000:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M2 19h20M3 19L5 7l7 7 7-7 2 12"/><circle cx="12" cy="4" r="1.2" fill="currentColor"/><circle cx="4" cy="7" r="1" fill="currentColor"/><circle cx="20" cy="7" r="1" fill="currentColor"/></svg>,
  streak_3:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/></svg>,
  streak_7:    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  tasks_5:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  tasks_20:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>,
  interview_1: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="8" y1="14" x2="16" y2="14"/></svg>,
  translate_1: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  perfect_day: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M2 20h20M3 20L5 7l7 7 7-7 2 13"/><circle cx="12" cy="4" r="1.5" fill="currentColor"/><circle cx="4" cy="7" r="1" fill="currentColor"/><circle cx="20" cy="7" r="1" fill="currentColor"/></svg>,
};

const RANKS = [
  { name:"Rookie",   min:0,     color:"#9ca3af", glow:"rgba(156,163,175,0.35)" },
  { name:"Iron",     min:300,   color:"#b0bec5", glow:"rgba(176,190,197,0.35)" },
  { name:"Bronze",   min:800,   color:"#cd7f32", glow:"rgba(205,127,50,0.45)"  },
  { name:"Silver",   min:2000,  color:"#c0c0c0", glow:"rgba(192,192,192,0.45)" },
  { name:"Gold",     min:4000,  color:"#fbbf24", glow:"rgba(251,191,36,0.5)"   },
  { name:"Platinum", min:8000,  color:"#7dd3fc", glow:"rgba(125,211,252,0.5)"  },
  { name:"Diamond",  min:15000, color:"#a78bfa", glow:"rgba(167,139,250,0.5)"  },
];

const QUEST_POOL = [
  { id:"q1",  icon:"📰", text:"Đọc 1 bài AI News và tóm tắt", xp:40 },
  { id:"q2",  icon:"🌏", text:"Dịch 1 đoạn tài liệu kỹ thuật", xp:60 },
  { id:"q3",  icon:"💼", text:"Trả lời 1 câu phỏng vấn AI", xp:75 },
  { id:"q4",  icon:"📖", text:"Học 1 thuật ngữ mới từ Glossary", xp:30 },
  { id:"q5",  icon:"💬", text:"Chat với Claude về 1 bài viết", xp:50 },
  { id:"q6",  icon:"✅", text:"Hoàn thành 3 custom tasks hôm nay", xp:55 },
  { id:"q7",  icon:"🧠", text:"Mở và đọc bài Wikipedia AI", xp:35 },
  { id:"q8",  icon:"🏆", text:"Đạt điểm 8/10+ trong phỏng vấn", xp:100 },
  { id:"q9",  icon:"📄", text:"Dịch đoạn văn trên 200 từ", xp:80 },
  { id:"q10", icon:"🔍", text:"Mở 2 bài AI News trong ngày", xp:45 },
  { id:"q11", icon:"⚡", text:"Kiếm 100 XP trong một ngày", xp:70 },
  { id:"q12", icon:"🎯", text:"Hoàn thành tất cả tasks trong danh sách", xp:90 },
];

const ACHIEVEMENTS_DEF = [
  { id:"first_xp",      icon:"⚡", name:"First Spark",     desc:"Kiếm XP đầu tiên",                color:"#fbbf24" },
  { id:"xp_300",        icon:"🌱", name:"Growing Up",      desc:"Đạt 300 XP",                      color:"#86efac" },
  { id:"xp_800",        icon:"🥉", name:"Bronze Mind",     desc:"Đạt 800 XP",                      color:"#cd7f32" },
  { id:"xp_2000",       icon:"🥈", name:"Silver Scholar",  desc:"Đạt 2000 XP",                     color:"#c0c0c0" },
  { id:"xp_4000",       icon:"🥇", name:"Gold Grinder",    desc:"Đạt 4000 XP",                     color:"#fbbf24" },
  { id:"streak_3",      icon:"🔥", name:"On Fire",         desc:"Streak 3 ngày liên tiếp",         color:"#f97316" },
  { id:"streak_7",      icon:"⭐", name:"Week Warrior",    desc:"Streak 7 ngày liên tiếp",         color:"#eab308" },
  { id:"tasks_5",       icon:"✅", name:"Task Starter",    desc:"Hoàn thành 5 tasks",              color:"#6366f1" },
  { id:"tasks_20",      icon:"🎯", name:"Focused",         desc:"Hoàn thành 20 tasks",             color:"#6366f1" },
  { id:"interview_1",   icon:"💼", name:"Candidate",       desc:"Hoàn thành 1 buổi phỏng vấn",    color:"#6366f1" },
  { id:"translate_1",   icon:"🌏", name:"Translator",      desc:"Dịch tài liệu đầu tiên",          color:"#67e8f9" },
  { id:"perfect_day",   icon:"👑", name:"Perfect Day",     desc:"Hoàn thành tất cả Daily Quests",  color:"#e879f9" },
];

const SKILL_TREE = [
  { id:"s1",  name:"Python Basics",       icon:"🐍", xpNeeded:0,     desc:"Variables, loops, functions",      tier:0 },
  { id:"s2",  name:"NumPy & Pandas",      icon:"📊", xpNeeded:150,   desc:"Xử lý & phân tích dữ liệu",       tier:0 },
  { id:"s3",  name:"Data Visualization",  icon:"📈", xpNeeded:300,   desc:"Matplotlib, Seaborn, Plotly",      tier:0 },
  { id:"s4",  name:"Neural Networks",     icon:"🧠", xpNeeded:500,   desc:"Perceptron, backprop, activation", tier:1 },
  { id:"s5",  name:"CNNs",               icon:"👁", xpNeeded:800,   desc:"Convolutional networks, pooling",   tier:1 },
  { id:"s6",  name:"RNNs & LSTMs",       icon:"🔄", xpNeeded:1200,  desc:"Sequence models, time series",     tier:1 },
  { id:"s7",  name:"Transformers",        icon:"⚡", xpNeeded:1800,  desc:"Attention mechanism, BERT, GPT",   tier:2 },
  { id:"s8",  name:"Fine-tuning LLMs",   icon:"🔧", xpNeeded:2500,  desc:"LoRA, QLoRA, instruction tuning",  tier:2 },
  { id:"s9",  name:"RAG Systems",        icon:"🔍", xpNeeded:3500,  desc:"Vector stores, retrieval",         tier:2 },
  { id:"s10", name:"AI Agents",          icon:"🤖", xpNeeded:5000,  desc:"Tool use, multi-agent systems",    tier:3 },
  { id:"s11", name:"Diffusion Models",   icon:"🎨", xpNeeded:7000,  desc:"Stable Diffusion, DALL-E",         tier:3 },
  { id:"s12", name:"AI System Design",   icon:"🏗️", xpNeeded:10000, desc:"Production-grade AI systems",      tier:3 },
];

const TIER_LABELS = ["🐣 Foundations", "🔬 Deep Learning", "🧬 Language Models", "🚀 Advanced AI"];

type NewsItem = {
  type: string; tag: string; title: string; desc: string;
  meta: string; source: string; url: string; keywords: string[];
};

const TECH_KW = ['AI','ML','LLM','GPT','AGI','Claude','OpenAI','Google','Meta','Microsoft','Apple','Amazon','Nvidia','GPU','Python','JavaScript','TypeScript','React','API','RAG','Transformer','RLHF','SaaS','DevOps','Kubernetes','Docker','GitHub','AWS','Azure','GCP','security','privacy','robotics','blockchain','database','cloud','startup','open source','open-source'];

const extractKeywords = (title: string, tags?: string[]): string[] => {
  if (tags?.length) return tags.slice(0, 4);
  const found: string[] = [];
  for (const t of TECH_KW) {
    if (new RegExp(`\\b${t}\\b`, 'i').test(title)) { found.push(t); if (found.length >= 4) break; }
  }
  if (found.length >= 2) return found;
  const caps = title.match(/\b[A-Z][A-Za-z0-9]{2,}\b/g) || [];
  return [...new Set([...found, ...caps])].slice(0, 4);
};

type IvQuestion = { company: string; title: string; difficulty: string; link: string; topics: string };

const IV_COMPANIES = [
  "Google","Meta","Amazon","Microsoft","Apple","Netflix",
  "OpenAI","Nvidia","Databricks","ByteDance","Uber","Airbnb",
  "LinkedIn","Stripe","TikTok","Tesla",
];

const parseIvCSV = (company: string, text: string): IvQuestion[] => {
  const lines = text.split('\n').filter(l => l.trim());
  return lines.slice(1).map(line => {
    const cols: string[] = [];
    let cur = '', inQ = false;
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ; }
      else if (ch === ',' && !inQ) { cols.push(cur.trim()); cur = ''; }
      else { cur += ch; }
    }
    cols.push(cur.trim());
    return { company, difficulty: cols[0]||'', title: cols[1]||'', link: cols[4]||'', topics: cols[5]||'' };
  }).filter(q => q.title && q.link.startsWith('http'));
};

// ─── WIKI AI TOPICS (Wikipedia API) ────────────────────────────────────────
const WIKI_AI_TOPICS = [
  // Tech & AI (~20%)
  "Large_language_model", "Quantum_computing", "Blockchain", "CRISPR",
  "Internet_of_things", "Cybersecurity", "Open_source_software",
  // Space & Physics
  "Black_hole", "James_Webb_Space_Telescope", "Dark_matter", "Exoplanet",
  "Quantum_mechanics", "String_theory", "Milky_Way", "Mars", "SpaceX",
  // Biology & Neuroscience
  "Neuroscience", "DNA_replication", "Mitochondrion", "Synaptic_plasticity",
  "Human_genome", "Gut_microbiota", "Stem_cell",
  // Psychology & Behaviour
  "Cognitive_bias", "Dunning%E2%80%93Kruger_effect", "Flow_(psychology)",
  "Dopamine", "Neuroplasticity", "Sleep", "Meditation",
  // Economics & Society
  "Game_theory", "Behavioral_economics", "Network_effect",
  "Cryptocurrency", "Universal_basic_income", "Climate_change",
  // History & Culture
  "Industrial_Revolution", "Scientific_revolution", "Renaissance",
  "Stoicism", "Philosophy_of_mind", "Fermi_paradox",
];

const AI_KEYWORDS = /\b(ai|artificial intelligence|machine learning|deep learning|neural|llm|gpt|claude|gemini|transformer|openai|anthropic|diffusion|nlp|computer vision|reinforcement|rlhf|fine.?tun|langchain|rag|vector|embedding|chatbot|language model)\b/i;

type Task = { id: number; text: string; xp: number; done: boolean };
type ArticleData = { title: string; tag: string; meta: string; url: string; body: string; glossary: {term:string;def:string}[]; loading: boolean; };

export default function PucPortfolio() {
  const navRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // ── Custom cursor ──────────────────────────────────────────────────────────
  const [cursorPos, setCursorPos] = useState({ x: -300, y: -300 });
  const [cursorLag, setCursorLag] = useState({ x: -300, y: -300 });
  const posRef = useRef({ x: -300, y: -300 });
  const lagRef = useRef({ x: -300, y: -300 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    const tick = () => {
      lagRef.current.x += (posRef.current.x - lagRef.current.x) * 0.09;
      lagRef.current.y += (posRef.current.y - lagRef.current.y) * 0.09;
      setCursorLag({ x: lagRef.current.x, y: lagRef.current.y });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);
  // ── Wave stagger delay for hero name ─────────────────────────────────────
  const nameRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = nameRef.current;
    if (!container) return;
    const letters = Array.from(container.querySelectorAll<HTMLElement>('.hero-letter'));
    letters.forEach((el, i) => { el.style.transitionDelay = `${i * 35}ms`; });
  }, []);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const artChatEndRef = useRef<HTMLDivElement>(null);
  const newsScrollRef = useRef<HTMLDivElement>(null);

  // ── Claude API Key (from .env or runtime input) ──────────────────────────
  const envKey = import.meta.env.VITE_GEMINI_KEY || "";
  const [geminiKey, setGeminiKey] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("puc_gemini_key")
        || localStorage.getItem("puc_claude_key")
        || envKey;
      if (saved) localStorage.setItem("puc_gemini_key", saved);
      return saved;
    } catch { return envKey; }
  });
  // ref luôn giữ giá trị mới nhất, tránh stale closure trong async functions
  const geminiKeyRef = useRef(geminiKey);
  useEffect(() => { geminiKeyRef.current = geminiKey; }, [geminiKey]);

  const [keyInput, setKeyInput] = useState("");

  const saveKey = () => {
    const k = keyInput.trim();
    if (!k) return;
    setGeminiKey(k);
    geminiKeyRef.current = k;
    try { localStorage.setItem("puc_gemini_key", k); } catch {}
    setKeyInput("");
  };

  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [page, setPage] = useState<string>(() => window.location.hash.replace('#','') || 'home');
  const [expandedNews, setExpandedNews] = useState<number|null>(null);

  const [article, setArticle] = useState<ArticleData|null>(null);

  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [transLoading, setTransLoading] = useState(false);
  const [chatMsgs, setChatMsgs] = useState<{role:string;text:string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [artChatMsgs, setArtChatMsgs] = useState<{role:string;text:string}[]>([]);
  const [artChatInput, setArtChatInput] = useState("");
  const [artChatLoading, setArtChatLoading] = useState(false);

  type VBotMsg = { role: "user"|"ai"; text: string; correction?: string };
  type VBotMode = "free"|"grammar";
  const [vMsgs, setVMsgs] = useState<VBotMsg[]>([]);
  const [vInput, setVInput] = useState("");
  const [vLoading, setVLoading] = useState(false);
  const [vMode, setVMode] = useState<VBotMode>("free");
  const [vListening, setVListening] = useState(false);
  const [vSpeaking, setVSpeaking] = useState(false);
  const [vStatus, setVStatus] = useState("Tap the mic to start talking");
  const vEndRef = useRef<HTMLDivElement>(null);
  const vMsgsRef = useRef<HTMLDivElement>(null);
  const vRecogRef = useRef<any>(null);
  const vMediaRecorderRef = useRef<MediaRecorder|null>(null);
  const vAudioChunksRef = useRef<Blob[]>([]);

  const [tasks, setTasks] = useState<Task[]>(() => {
    try { return JSON.parse(localStorage.getItem("puc_tasks_v2")||"null") || [
      { id:1, text:"Đọc 1 paper về Deep Learning", xp:30, done:false },
      { id:2, text:"Implement 1 layer CNN từ đầu", xp:50, done:false },
      { id:3, text:"Dịch 1 tài liệu AI bằng chatbot", xp:20, done:false },
      { id:4, text:"Trả lời 1 câu phỏng vấn AI", xp:35, done:false },
    ]; } catch { return []; }
  });
  const [xp, setXp] = useState<number>(() => { try { return parseInt(localStorage.getItem("puc_xp")||"0"); } catch { return 0; } });
  const [streak, setStreak] = useState<number>(() => {
    try {
      const d = JSON.parse(localStorage.getItem("puc_streak_v2") || "null");
      if (!d) return 0;
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (d.last === today || d.last === yesterday) return d.count;
      return 0;
    } catch { return 0; }
  });
  const [gameStats, setGameStats] = useState<{totalTasksDone:number;interviewsDone:number;translationsDone:number;articlesRead:number;questsDone:number;perfectDays:number}>(() => {
    try { return JSON.parse(localStorage.getItem("puc_game_stats") || "null") || {totalTasksDone:0,interviewsDone:0,translationsDone:0,articlesRead:0,questsDone:0,perfectDays:0}; }
    catch { return {totalTasksDone:0,interviewsDone:0,translationsDone:0,articlesRead:0,questsDone:0,perfectDays:0}; }
  });
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("puc_achievements") || "[]"); } catch { return []; }
  });
  const [dailyQuestsDone, setDailyQuestsDone] = useState<string[]>(() => {
    try {
      const d = JSON.parse(localStorage.getItem("puc_daily_quests") || "null");
      if (d?.date === new Date().toDateString()) return d.done;
    } catch {}
    return [];
  });
  const [gameTab, setGameTab] = useState<"quests"|"tasks"|"skills"|"achievements">("tasks");
  const [openQ, setOpenQ] = useState<number|null>(null);
  const [answers, setAnswers] = useState<{[k:number]:string}>({});
  const [feedbacks, setFeedbacks] = useState<{[k:number]:string}>({});
  const [feedbackLoading, setFeedbackLoading] = useState<{[k:number]:boolean}>({});
  const [ivPool, setIvPool] = useState<IvQuestion[]>([]);
  const [ivPoolLoading, setIvPoolLoading] = useState(true);
  const [ivDisplayed, setIvDisplayed] = useState<IvQuestion[]>([]);
  const ivPoolRef = useRef<IvQuestion[]>([]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = globalStyles;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  useEffect(() => {
    const base = "https://raw.githubusercontent.com/liquidslr/interview-company-wise-problems/main";
    Promise.allSettled(
      IV_COMPANIES.map(c =>
        fetch(`${base}/${encodeURIComponent(c)}/5.%20All.csv`)
          .then(r => r.ok ? r.text() : Promise.reject())
          .then(text => parseIvCSV(c, text))
          .catch(() => [] as IvQuestion[])
      )
    ).then(results => {
      const all: IvQuestion[] = [];
      for (const r of results) if (r.status === "fulfilled") all.push(...r.value);
      // shuffle
      for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [all[i], all[j]] = [all[j], all[i]];
      }
      ivPoolRef.current = all;
      setIvPool(all);
      setIvDisplayed(all.slice(0, 5));
      setIvPoolLoading(false);
    });
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const play = () => v.play().catch(()=>{});
    play();
    document.addEventListener("touchstart", play, { once: true });
    document.addEventListener("click", play, { once: true });
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const fn = () => nav.classList.toggle("scrolled", window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    localStorage.setItem("puc_tasks_v2", JSON.stringify(tasks));
    localStorage.setItem("puc_xp", String(xp));
  }, [tasks, xp]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [chatMsgs]);
  useEffect(() => { artChatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [artChatMsgs]);

  useEffect(() => {
    const el = newsScrollRef.current;
    if (!el || expandedNews !== null) return;
    let animId: number;
    let paused = false;
    let dir = 1;
    const pause = () => { paused = true; };
    const resume = () => { paused = false; };
    const step = () => {
      if (!paused) {
        const max = el.scrollWidth - el.clientWidth;
        el.scrollLeft += 0.6 * dir;
        if (dir === 1 && el.scrollLeft >= max - 1) { el.scrollLeft = max; dir = -1; }
        else if (dir === -1 && el.scrollLeft <= 0) { el.scrollLeft = 0; dir = 1; }
      }
      animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("touchstart", pause, { passive: true });
    return () => {
      cancelAnimationFrame(animId);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("touchstart", pause);
    };
  }, [expandedNews]);

  useEffect(() => {
    document.body.style.overflow = article ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [article]);

  // ── On mount: clear old AI-only pool, fetch fresh diverse content ─────
  useEffect(() => {
    localStorage.removeItem("puc_news_pool");
    fetchAndBuildNews();
  }, []);

  // Midnight refresh — clear pool so fresh articles are fetched for the new day
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const scheduleNext = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setDate(midnight.getDate() + 1);
      midnight.setHours(0, 0, 0, 0);
      timer = setTimeout(() => {
        localStorage.removeItem("puc_news_pool");
        localStorage.removeItem("puc_news_seen");
        fetchAndBuildNews();
        scheduleNext();
      }, midnight.getTime() - now.getTime());
    };
    scheduleNext();
    return () => clearTimeout(timer);
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });

  const goTo = (p: string) => {
    setPage(p);
    window.location.hash = p === 'home' ? '' : p;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onHash = () => { const p = window.location.hash.replace('#','') || 'home'; setPage(p); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // ────────────────────────────────────────────────────────────────────────
  // JSON helper — handles Claude responses with literal newlines in strings
  // ────────────────────────────────────────────────────────────────────────
  const parseClaudeJSON = (raw: string): any => {
    const cleaned = raw.replace(/```json\n?|```/g, "").trim();
    const block = cleaned.match(/\{[\s\S]*\}/)?.[0] ?? cleaned;
    try { return JSON.parse(block); } catch {}
    // Sanitize literal control chars inside JSON string values and retry
    const sanitized = block.replace(/("(?:[^"\\]|\\.)*")/g, m =>
      m.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t")
    );
    return JSON.parse(sanitized);
  };

  // ────────────────────────────────────────────────────────────────────────
  // CLAUDE API  (claude-haiku-4-5 for speed, sonnet for quality)
  // ────────────────────────────────────────────────────────────────────────
  const callGemini = async (
    prompt: string,
    systemInstruction = "Bạn là trợ lý AI chuyên về công nghệ. Trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu.",
    maxTokens = 1500,
    _fast = false
  ): Promise<string> => {
    const key = geminiKeyRef.current;
    if (!key) return "⚠️ Chưa có HuggingFace token. Nhập token (hf_...) ở phần Luyện Tiếng Anh để dùng tính năng AI.";
    try {
      const res = await fetch("https://router.huggingface.co/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "Qwen/Qwen2.5-72B-Instruct",
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: prompt },
          ],
          max_tokens: maxTokens,
          temperature: 0.85,
        }),
      });
      const data = await res.json();
      if (data.error) return `Lỗi HuggingFace: ${data.error.message || JSON.stringify(data.error)}`;
      return data.choices?.[0]?.message?.content || "Không có phản hồi.";
    } catch (e) {
      return `Lỗi kết nối: ${(e as Error).message}`;
    }
  };

  // ────────────────────────────────────────────────────────────────────────
  // HACKER NEWS API  (free, no key)
  // ────────────────────────────────────────────────────────────────────────
  const fetchHNStories = async (): Promise<{title:string;url:string;source:string;isTech:boolean}[]> => {
    try {
      const idsRes = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
      const ids: number[] = await idsRes.json();
      const stories = await Promise.all(
        ids.slice(0, 60).map(id =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json()).catch(() => null)
        )
      );
      const TECH_DOMAINS = /github\.com|techcrunch|wired|theverge|arstechnica|venturebeat|zdnet|thenextweb|medium\.com|substack|openai|anthropic|google|meta\.com|nvidia|huggingface|arxiv|nature\.com|science|acm\.org|ieee|stackoverflow|dev\.to/i;
      const SKIP_KW = /\b(sports|music|movie|film|football|soccer|recipe|cook|garden|travel|horoscope|celebrity|gossip|fashion|beauty|diet|weight)\b/i;
      return stories
        .filter((s: any) => s?.title && s?.url && !SKIP_KW.test(s.title))
        .map((s: any) => ({
          title: s.title,
          url: s.url,
          source: new URL(s.url).hostname.replace("www.",""),
          isTech: TECH_DOMAINS.test(s.url) || AI_KEYWORDS.test(s.title),
        }))
        .sort((a: any, b: any) => (b.isTech ? 1 : 0) - (a.isTech ? 1 : 0));
    } catch { return []; }
  };

  // ────────────────────────────────────────────────────────────────────────
  // WIKIPEDIA API  (free, no key, random AI topic)
  // ────────────────────────────────────────────────────────────────────────
  const fetchWikiAI = async (): Promise<{title:string;extract:string;url:string}[]> => {
    const results: {title:string;extract:string;url:string}[] = [];
    const indices = new Set<number>();
    while (indices.size < 7) indices.add(Math.floor(Math.random() * WIKI_AI_TOPICS.length));
    await Promise.all([...indices].map(async idx => {
      try {
        const topic = WIKI_AI_TOPICS[idx];
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${topic}`);
        const data = await res.json();
        if (data.extract) results.push({
          title: data.title,
          extract: data.extract,
          url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${topic}`,
        });
      } catch {}
    }));
    return results;
  };

  const fetchDevTo = async (): Promise<NewsItem[]> => {
    try {
      // Fetch from multiple hot tech tags for variety
      const tags = ["webdev","javascript","typescript","python","programming","devops","cloud","security","ux","career","productivity","opensource","linux","testing","architecture","beginners"];
      const picked = tags.sort(() => Math.random() - 0.5).slice(0, 4);
      const results = await Promise.all(
        picked.map(tag =>
          fetch(`https://dev.to/api/articles?tag=${tag}&per_page=20&top=3`)
            .then(r => r.json()).catch(() => [])
        )
      );
      const all: any[] = results.flat();
      const seen = new Set<string>();
      return all
        .filter((a: any) => a?.title && a?.url && !seen.has(a.url) && seen.add(a.url))
        .sort(() => Math.random() - 0.5)
        .map((a: any) => ({
          type: "devto",
          tag: "Dev.to",
          title: a.title,
          desc: a.description || "",
          meta: new Date(a.published_at).toLocaleDateString("en-US", { month:"short", day:"numeric" }) + " · Dev.to",
          source: "dev.to",
          url: a.url,
          keywords: (a.tag_list || []).slice(0, 4),
        }));
    } catch { return []; }
  };

  // GitHub Trending (via unofficial scrape-free API)
  const fetchGithubTrending = async (): Promise<NewsItem[]> => {
    try {
      const r = await fetch("https://api.gitterapp.com/repositories?since=daily&spoken_language_code=en");
      const data: any[] = await r.json();
      return data.slice(0, 20).map((repo: any) => ({
        type: "github",
        tag: "GitHub Trending",
        title: `⭐ ${repo.name} — ${repo.description?.slice(0, 80) || ""}`,
        desc: repo.description || "",
        meta: `${repo.stars_today || ""} stars today · ${repo.language || ""}`.trim().replace(/^·\s*/, ""),
        source: "github.com",
        url: repo.url || `https://github.com/${repo.author}/${repo.name}`,
        keywords: [repo.language, ...(repo.tags || [])].filter(Boolean).slice(0, 4),
      }));
    } catch { return []; }
  };

  // Reddit r/programming, r/technology, r/science via public JSON
  const fetchReddit = async (): Promise<NewsItem[]> => {
    const subs = [
      "programming","technology","webdev","science","worldnews",
      "todayilearned","interestingasfuck","Futurology","space","psychology",
      "explainlikeimfive","dataisbeautiful","business","books","askscience",
      "geek","changemyview","philosophy","education","self",
    ];
    const picked = subs.sort(() => Math.random() - 0.5).slice(0, 4);
    const results = await Promise.all(picked.map(sub =>
      fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=10`)
        .then(r => r.json()).catch(() => null)
    ));
    const items: NewsItem[] = [];
    for (const res of results) {
      if (!res?.data?.children) continue;
      for (const { data: p } of res.data.children) {
        if (!p?.title || p.stickied || p.over_18 || !p.url) continue;
        const url = p.url.startsWith("https://www.reddit.com") || p.is_self
          ? `https://www.reddit.com${p.permalink}` : p.url;
        items.push({
          type: "reddit",
          tag: `r/${p.subreddit}`,
          title: p.title,
          desc: p.selftext?.slice(0, 200) || "",
          meta: `${p.score?.toLocaleString()} upvotes · r/${p.subreddit}`,
          source: p.domain || "reddit.com",
          url,
          keywords: extractKeywords(p.title),
        });
      }
    }
    return items;
  };

  // ────────────────────────────────────────────────────────────────────────
  // BUILD NEWS  (HN + Dev.to + Wikipedia + GitHub + Reddit — pool system)
  // ────────────────────────────────────────────────────────────────────────
  const showFromPool = (pool: NewsItem[], seen: string[]): boolean => {
    const unseen = pool.filter(a => !seen.includes(a.url));
    if (unseen.length < 6) return false;
    const displayed = unseen.slice(0, 6);
    const remaining = unseen.slice(6);
    const newSeen = [...seen, ...displayed.map(d => d.url)].slice(-400);
    localStorage.setItem("puc_news_pool", JSON.stringify(remaining));
    localStorage.setItem("puc_news_seen", JSON.stringify(newSeen));
    setNews(displayed);
    setExpandedNews(null);
    return true;
  };

  const fetchAndBuildNews = async () => {
    setNewsLoading(true);
    try {
      // Try showing from existing pool first
      const poolRaw = localStorage.getItem("puc_news_pool");
      const seenRaw = localStorage.getItem("puc_news_seen");
      const seen: string[] = seenRaw ? JSON.parse(seenRaw) : [];
      if (poolRaw && showFromPool(JSON.parse(poolRaw), seen)) {
        setNewsLoading(false);
        return;
      }
      // Pool exhausted → fetch fresh from all sources
      // Pool exhausted → fetch fresh from all sources
      const [hnStories, devToItems, wikiItems, ghItems, redditItems] = await Promise.all([
        fetchHNStories(), fetchDevTo(), fetchWikiAI(), fetchGithubTrending(), fetchReddit(),
      ]);

      // Cap each source to 12 items to prevent any one source dominating the pool
      const cap = <T,>(arr: T[], n: number) => arr.sort(() => Math.random() - 0.5).slice(0, n);

      const hnNews: NewsItem[] = cap(hnStories, 12).map(s => ({
        type: "hot", tag: "Hacker News",
        title: s.title, desc: s.title,
        meta: "Today · " + s.source, source: s.source, url: s.url,
        keywords: extractKeywords(s.title),
      }));
      const wikiNews: NewsItem[] = cap(wikiItems, 12).map(w => ({
        type: "wiki", tag: "Wikipedia",
        title: w.title, desc: w.extract.slice(0, 220),
        meta: "Wikipedia", source: "en.wikipedia.org", url: w.url,
        keywords: extractKeywords(w.title),
      }));
      const devNews  = cap(devToItems, 12);
      const ghNews   = cap(ghItems, 12);
      const rdNews   = cap(redditItems, 12);

      // Interleave sources evenly: round-robin so pool starts balanced
      const sources = [hnNews, devNews, wikiNews, ghNews, rdNews];
      const all: NewsItem[] = [];
      const maxLen = Math.max(...sources.map(s => s.length));
      for (let i = 0; i < maxLen; i++) {
        for (const src of sources) {
          if (i < src.length) all.push(src[i]);
        }
      }

      // Light shuffle within each window of 5 to preserve balance but add variety
      for (let i = 0; i < all.length - 4; i += 5) {
        const chunk = all.slice(i, i + 5).sort(() => Math.random() - 0.5);
        for (let j = 0; j < chunk.length; j++) all[i + j] = chunk[j];
      }

      // If everything already seen → reset seen and show fresh
      const activeSeen = all.every(a => seen.includes(a.url)) ? [] : seen;
      if (!showFromPool(all, activeSeen)) {
        // Fewer than 6 total — just show all
        setNews(all);
        setExpandedNews(null);
        localStorage.setItem("puc_news_pool", "[]");
        localStorage.setItem("puc_news_seen", JSON.stringify(all.map(a => a.url)));
      }
    } catch (e) {
      console.error("fetchAndBuildNews error:", e);
    }
    setNewsLoading(false);
  };

  // ────────────────────────────────────────────────────────────────────────
  // ARTICLE — open with full body (pre-existing or ask Claude to expand)
  // ────────────────────────────────────────────────────────────────────────
  const openArticle = (idx: number) => {
    const n = news[idx];
    setArtChatMsgs([]);
    setArtChatInput("");
    setExpandedNews(null);
    setArticle({
      title: n.title, tag: n.tag, meta: n.meta || "", url: n.url,
      body: n.desc || "",
      glossary: [],
      loading: false,
    });
  };

  // ── Article chat ─────────────────────────────────────────────────────────
  const sendArtChat = async () => {
    if (!artChatInput.trim() || !article) return;
    const msg = artChatInput; setArtChatInput("");
    setArtChatMsgs(p => [...p, { role:"user", text:msg }]);
    setArtChatLoading(true);
    const ctx = article.body ? `Bài đang đọc: ${article.title}\nTóm tắt: ${article.body.slice(0, 1000)}\n\n` : `Bài: ${article.title}\n\n`;
    const text = await callGemini(
      `${ctx}Câu hỏi: ${msg}`,
      "Chuyên gia AI hỗ trợ người đọc hiểu bài. Trả lời tiếng Việt, ngắn gọn, giữ thuật ngữ tiếng Anh."
    );
    setArtChatMsgs(p => [...p, { role:"ai", text }]);
    setArtChatLoading(false);
  };

  // ── Translator ────────────────────────────────────────────────────────────
  const translateDoc = async () => {
    if (!inputText.trim()) return;
    setTransLoading(true); setTranslatedText("");
    const text = await callGemini(
      `Dịch toàn bộ nội dung sau sang tiếng Việt. Giữ nguyên tất cả thuật ngữ tiếng Anh kỹ thuật và chú thích trong ngoặc đơn khi cần:\n\n${inputText}`,
      "Dịch giả AI/Tech chuyên nghiệp. Dịch chính xác, tự nhiên, giữ nguyên định dạng gốc.",
      2048
    );
    setTranslatedText(text); setTransLoading(false);
    const ns = { ...gameStats, translationsDone: gameStats.translationsDone + 1 };
    setGameStats(ns);
    localStorage.setItem("puc_game_stats", JSON.stringify(ns));
    checkAchievements(ns, xp, streak);
  };

  const VBOT_PROMPTS: Record<VBotMode, string> = {
    free:    `You are Aria, a witty and warm English conversation partner. Keep replies SHORT (2-3 sentences max) — this is voice chat. Occasionally make natural jokes or puns. If the user makes a grammar mistake, add at the very end: [FIX: "wrong" → "correct"]. Always ask a follow-up question.`,
    grammar: `You are Aria, an English grammar coach. For each message: 1) Note any grammar errors as [FIX: "wrong" → "correct" — reason]. 2) Continue conversation naturally. Keep replies SHORT (2-3 sentences) — voice chat.`,
  };

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/\[FIX:.*?\]/gs, "").trim();
    const utt = new SpeechSynthesisUtterance(clean);
    utt.lang = "en-US";
    utt.rate = 1.05;
    utt.pitch = 1.05;
    // Pick best available voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => /samantha|zira|google us english|microsoft zira/i.test(v.name))
      || voices.find(v => v.lang === "en-US")
      || voices[0];
    if (preferred) utt.voice = preferred;
    utt.onstart = () => { setVSpeaking(true); setVStatus("Aria is speaking..."); };
    utt.onend = () => { setVSpeaking(false); setVStatus("Tap the mic to respond"); };
    window.speechSynthesis.speak(utt);
  };

  const transcribeWithWhisper = async (audioBlob: Blob, mimeType: string): Promise<string> => {
    const key = geminiKeyRef.current;
    if (!key) return "";
    try {
      const ext = mimeType.includes("mp4") ? "audio.mp4" : mimeType.includes("ogg") ? "audio.ogg" : "audio.webm";
      const fd = new FormData();
      fd.append("file", audioBlob, ext);
      fd.append("model", "openai/whisper-large-v3-turbo");
      fd.append("language", "en");
      const res = await fetch("https://router.huggingface.co/v1/audio/transcriptions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${key}` },
        body: fd,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Whisper error:", err);
        return "";
      }
      const data = await res.json();
      return data.text?.trim() || "";
    } catch (e) { console.error("Whisper fetch error:", e); return ""; }
  };

  const getBestMimeType = () => {
    const types = ["audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus","audio/mp4"];
    return types.find(t => MediaRecorder.isTypeSupported(t)) || "";
  };

  const startListening = async () => {
    window.speechSynthesis.cancel();
    setVStatus("Requesting microphone...");

    // ── Attempt 1: Web Speech API — continuous, submit only on manual stop ──
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      try {
        const recog = new SR();
        vRecogRef.current = recog;
        recog.lang = "en-US";
        recog.continuous = true;
        recog.interimResults = true;
        recog.maxAlternatives = 1;
        let finalTranscript = "";
        recog.onstart = () => { setVListening(true); setVStatus("Listening... tap stop when done"); };
        recog.onresult = (e: any) => {
          let interim = "";
          for (let i = e.resultIndex; i < e.results.length; i++) {
            if (e.results[i].isFinal) finalTranscript += e.results[i][0].transcript;
            else interim += e.results[i][0].transcript;
          }
          // Show live preview in status
          const preview = (finalTranscript + interim).trim();
          if (preview) setVStatus(`"${preview.slice(0, 60)}${preview.length > 60 ? "…" : ""}"`);
        };
        recog.onerror = (e: any) => {
          if (e.error === "no-speech") return; // ignore silence, keep listening
          setVListening(false);
          setVStatus("Could not hear — try again");
        };
        recog.onend = () => {
          setVListening(false);
          const result = finalTranscript.trim();
          if (result) handleVoiceInput(result);
          else setVStatus("Tap the mic to start talking");
        };
        recog.start();
        return;
      } catch { /* fall through to Whisper */ }
    }

    // ── Attempt 2: MediaRecorder + Whisper (for browsers without Speech API) ──
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true }
      });
      const mimeType = getBestMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      vAudioChunksRef.current = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) vAudioChunksRef.current.push(e.data); };
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(vAudioChunksRef.current, { type: recorder.mimeType });
        if (blob.size < 500) {
          setVStatus("Too short — try speaking longer");
          setVListening(false);
          return;
        }
        setVStatus("Transcribing...");
        const text = await transcribeWithWhisper(blob, recorder.mimeType);
        setVListening(false);
        if (text) handleVoiceInput(text);
        else setVStatus("Could not understand — try again");
      };
      recorder.onerror = () => { stream.getTracks().forEach(t => t.stop()); setVListening(false); setVStatus("Recording error — try again"); };
      vMediaRecorderRef.current = recorder;
      recorder.start(100);
      setVListening(true);
      setVStatus("Recording... tap again to stop");
    } catch (err: any) {
      setVListening(false);
      setVStatus(err?.name === "NotAllowedError" ? "Microphone access denied — allow in browser settings" : "Microphone not available");
    }
  };

  const stopListening = () => {
    if (vMediaRecorderRef.current?.state === "recording") {
      vMediaRecorderRef.current.stop();
      setVStatus("Processing...");
    }
    if (vRecogRef.current) {
      try { vRecogRef.current.stop(); } catch {}
      setVListening(false);
    }
  };

  const handleVoiceInput = async (text: string) => {
    const newMsg: VBotMsg = { role: "user", text };
    setVMsgs(p => [...p, newMsg]);
    setVLoading(true);
    setTimeout(() => { const el = vMsgsRef.current; if (el) el.scrollTop = el.scrollHeight; }, 50);

    const history = [...vMsgs, newMsg].slice(-10)
      .map(m => `${m.role === "user" ? "User" : "Aria"}: ${m.text}`).join("\n");
    const raw = await callGemini(`${history}\nAria:`, VBOT_PROMPTS[vMode], 300);

    const corrMatch = raw.match(/\[FIX:\s*(.*?)\]/s);
    const correction = corrMatch?.[1]?.trim();
    const cleanText = raw.replace(/\[FIX:.*?\]/gs, "").trim();

    setVMsgs(p => [...p, { role: "ai", text: cleanText, correction }]);
    setVLoading(false);
    setVStatus("");
    setTimeout(() => { const el = vMsgsRef.current; if (el) el.scrollTop = el.scrollHeight; }, 50);
    speakText(raw);
  };

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput; setChatInput("");
    setChatMsgs(p => [...p, { role:"user", text:msg }]);
    setChatLoading(true);
    const ctx = translatedText ? `Tài liệu đã dịch:\n${translatedText.slice(0, 2000)}\n\n` : "";
    const text = await callGemini(`${ctx}Câu hỏi: ${msg}`, "Chuyên gia AI giải thích tài liệu bằng tiếng Việt, súc tích và rõ ràng.");
    setChatMsgs(p => [...p, { role:"ai", text }]); setChatLoading(false);
  };

  // ── Game helpers ─────────────────────────────────────────────────────────
  const getRank = (x: number) => RANKS.reduce((acc, r) => x >= r.min ? r : acc, RANKS[0]);
  const getLevel = (x: number) => {
    let lv = 1, needed = 100, rem = x;
    while (rem >= needed) { rem -= needed; lv++; needed = lv * 100; }
    return lv;
  };
  const getLevelProgress = (x: number) => {
    let lv = 1, needed = 100, rem = x;
    while (rem >= needed) { rem -= needed; lv++; needed = lv * 100; }
    return { cur: rem, needed, pct: (rem / needed) * 100 };
  };

  const getDailyQuests = () => {
    const seed = new Date().toDateString().split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const chosen: number[] = [];
    let s = seed;
    while (chosen.length < 3) {
      s = Math.abs((s * 1664525 + 1013904223) | 0);
      const idx = s % QUEST_POOL.length;
      if (!chosen.includes(idx)) chosen.push(idx);
    }
    return chosen.map(i => QUEST_POOL[i]);
  };

  const checkAchievements = (stats: typeof gameStats, xpVal: number, streakVal: number) => {
    const checks: {[id:string]: boolean} = {
      first_xp:    xpVal >= 1,
      xp_300:      xpVal >= 300,
      xp_800:      xpVal >= 800,
      xp_2000:     xpVal >= 2000,
      xp_4000:     xpVal >= 4000,
      streak_3:    streakVal >= 3,
      streak_7:    streakVal >= 7,
      tasks_5:     stats.totalTasksDone >= 5,
      tasks_20:    stats.totalTasksDone >= 20,
      interview_1: stats.interviewsDone >= 1,
      translate_1: stats.translationsDone >= 1,
      perfect_day: stats.perfectDays >= 1,
    };
    const newUnlocks = ACHIEVEMENTS_DEF.filter(a => checks[a.id]).map(a => a.id);
    setUnlockedAchievements(prev => {
      const merged = [...new Set([...prev, ...newUnlocks])];
      localStorage.setItem("puc_achievements", JSON.stringify(merged));
      return merged;
    });
  };

  const addXP = (amount: number) => {
    setXp(x => {
      const nx = x + amount;
      localStorage.setItem("puc_xp", String(nx));
      // Update streak
      const today = new Date().toDateString();
      try {
        const sd = JSON.parse(localStorage.getItem("puc_streak_v2") || "null");
        if (!sd || sd.last !== today) {
          const yesterday = new Date(Date.now() - 86400000).toDateString();
          const newCount = sd?.last === yesterday ? (sd.count + 1) : 1;
          setStreak(newCount);
          localStorage.setItem("puc_streak_v2", JSON.stringify({ last: today, count: newCount }));
        }
      } catch {}
      return nx;
    });
  };

  const completeQuest = (questId: string, questXp: number) => {
    if (dailyQuestsDone.includes(questId)) return;
    const newDone = [...dailyQuestsDone, questId];
    setDailyQuestsDone(newDone);
    localStorage.setItem("puc_daily_quests", JSON.stringify({ date: new Date().toDateString(), done: newDone }));
    addXP(questXp);
    const newStats = { ...gameStats, questsDone: gameStats.questsDone + 1 };
    const dailyTotal = getDailyQuests().length;
    if (newDone.length >= dailyTotal) {
      newStats.perfectDays = gameStats.perfectDays + 1;
    }
    setGameStats(newStats);
    localStorage.setItem("puc_game_stats", JSON.stringify(newStats));
    checkAchievements(newStats, xp + questXp, streak);
  };

  // ── Roadmap tasks ─────────────────────────────────────────────────────────
  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const nd = !t.done;
      if (nd) {
        addXP(t.xp);
        const ns = { ...gameStats, totalTasksDone: gameStats.totalTasksDone + 1 };
        setGameStats(ns);
        localStorage.setItem("puc_game_stats", JSON.stringify(ns));
        checkAchievements(ns, xp + t.xp, streak);
      } else {
        setXp(x => Math.max(0, x - t.xp));
      }
      return { ...t, done: nd };
    }));
  };
  const updateTask = (id: number, field: "text"|"xp", val: string) =>
    setTasks(prev => prev.map(t => t.id===id ? { ...t, [field]: field==="xp" ? parseInt(val)||0 : val } : t));
  const addTask = () => setTasks(prev => [...prev, { id:Date.now(), text:"", xp:20, done:false }]);
  const deleteTask = (id: number) => {
    const t = tasks.find(t => t.id===id);
    if (t?.done) setXp(x => Math.max(0, x - t.xp));
    setTasks(prev => prev.filter(t => t.id!==id));
  };

  // ── Interview ─────────────────────────────────────────────────────────────
  const submitAnswer = async (idx: number) => {
    const ans = answers[idx];
    if (!ans?.trim()) return;
    const q = ivDisplayed[idx];
    if (!q) return;
    setFeedbackLoading(p => ({ ...p, [idx]:true }));
    const text = await callGemini(
      `Đóng vai interviewer kỹ thuật senior tại ${q.company}. Đánh giá câu trả lời sau:
Bài toán: ${q.title} (${q.difficulty}) — Topics: ${q.topics}
Link: ${q.link}
Câu trả lời/approach của ứng viên: ${ans}

Đánh giá: độ chính xác thuật toán, time/space complexity, edge cases, gợi ý cải thiện.
Bắt đầu bằng "Điểm: X/10". Trả lời bằng tiếng Việt.`,
      "Interviewer kỹ thuật senior. Đánh giá khách quan, xây dựng."
    );
    setFeedbacks(p => ({ ...p, [idx]:text }));
    setFeedbackLoading(p => ({ ...p, [idx]:false }));
    const ns = { ...gameStats, interviewsDone: gameStats.interviewsDone + 1 };
    setGameStats(ns);
    localStorage.setItem("puc_game_stats", JSON.stringify(ns));
    checkAchievements(ns, xp, streak);
  };

  const nextQuestion = (idx: number) => {
    const pool = ivPoolRef.current;
    const usedLinks = new Set(ivDisplayed.map(q => q.link));
    const next = pool.find(q => !usedLinks.has(q.link));
    if (!next) return;
    setIvDisplayed(prev => {
      const updated = [...prev];
      updated[idx] = next;
      return updated;
    });
    setAnswers(p => { const n = {...p}; delete n[idx]; return n; });
    setFeedbacks(p => { const n = {...p}; delete n[idx]; return n; });
    setOpenQ(null);
    // rotate pool so next call picks a different question
    const i = pool.indexOf(next);
    ivPoolRef.current = [...pool.slice(i+1), ...pool.slice(0,i+1)];
  };

  const xpPct = Math.min((xp / 500) * 100, 100);
  const doneTasks = tasks.filter(t => t.done).length;
  const currentRank = getRank(xp);
  const currentLevel = getLevel(xp);
  const levelProgress = getLevelProgress(xp);
  const dailyQuests = getDailyQuests();

  return (
    <div>
      {/* CUSTOM CURSOR */}
      <div className="cursor-dot" style={{ transform: `translate(calc(${cursorPos.x}px - 50%), calc(${cursorPos.y}px - 50%))` }} />
      <div className="cursor-ring" style={{ transform: `translate(calc(${cursorLag.x}px - 50%), calc(${cursorLag.y}px - 50%))` }} />
      <div className="cursor-spotlight" style={{ background: `radial-gradient(500px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(80,70,229,0.055) 0%, transparent 70%)` }} />

      {/* ARTICLE PAGE */}
      {article && (
        <div className="article-page">
          <div className="article-back">
            <button className="article-back-btn" onClick={() => setArticle(null)}>← Quay lại</button>
            <span style={{fontSize:"0.8rem",color:"var(--muted)"}}>{article.tag} · {article.meta}</span>
          </div>
          <div className="article-split">
            <div className="article-split-left">
              <div className="article-inner">
                <span className="article-tag">{article.tag}</span>
                <div className="article-title">{article.title}</div>
                <div className="article-meta">
                  <span>{article.meta}</span>
                  <a href={article.url} target="_blank" rel="noreferrer" className="article-source-link">↗ Xem bài gốc</a>
                </div>
                {article.loading
                  ? <div style={{textAlign:"center",padding:"3rem",color:"var(--muted)"}}>
                      <span className="loading-dots">Claude đang biên soạn bài viết</span>
                    </div>
                  : <>
                      <div className="article-body">
                        {(article.body || "").split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
                      </div>
                      {article.glossary.length > 0 && (
                        <div className="article-glossary">
                          <div className="article-glossary-title">📖 Glossary — Thuật ngữ kỹ thuật</div>
                          {article.glossary.map((g, i) => (
                            <div key={i} className="glossary-item">
                              <div className="glossary-term">{g.term}</div>
                              <div className="glossary-def">{g.def}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      <a href={article.url} target="_blank" rel="noreferrer" className="article-source-link" style={{marginTop:"2.5rem",display:"inline-flex"}}>
                        ↗ Đọc bài gốc tại {article.url.replace("https://","")}
                      </a>
                    </>
                }
              </div>
            </div>
            <div className="article-split-right">
              <div className="art-chat-header">💬 Thảo luận với Claude về bài này</div>
              <div className="art-chat-msgs">
                {artChatMsgs.length === 0 && (
                  <div style={{fontSize:"0.8rem",color:"var(--muted)",textAlign:"center",padding:"1.5rem 1rem",lineHeight:1.7}}>
                    {!geminiKey ? "Nhập HuggingFace token để chat về bài viết..." : "Hỏi bất kỳ điều gì về bài viết — thuật ngữ, khái niệm, ứng dụng thực tế..."}
                  </div>
                )}
                {artChatMsgs.map((m,i) => (
                  <div key={i} className={`art-chat-msg ${m.role}`}>{m.text}</div>
                ))}
                {artChatLoading && (
                  <div className="art-chat-msg ai"><span className="loading-dots">Claude đang trả lời</span></div>
                )}
                <div ref={artChatEndRef} />
              </div>
              <div className="art-chat-input-row">
                <input
                  className="art-chat-input"
                  placeholder={geminiKey ? "Hỏi về bài viết..." : "Cần HuggingFace token..."}
                  value={artChatInput}
                  onChange={e => setArtChatInput(e.target.value)}
                  onKeyDown={e => e.key==="Enter" && !artChatLoading && sendArtChat()}
                  disabled={!geminiKey || article.loading}
                />
                <button
                  className="ai-btn"
                  style={{padding:"0.45rem 0.85rem",fontSize:"0.78rem"}}
                  onClick={sendArtChat}
                  disabled={artChatLoading || !artChatInput.trim() || !geminiKey || article.loading}
                >Gửi</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav ref={navRef} className="nav">
        <div className="nav-inner">
          <span className="nav-logo" onClick={() => goTo("home")}>Puc</span>
          <div className="nav-links">
            {/* Home with dropdown */}
            <div className="nav-item">
              <a className={`nav-link nav-item-trigger${page==='home'||page==='news'?" active":""}`} onClick={() => goTo('home')}>
                Home
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="10" height="10"><path d="M6 9l6 6 6-6"/></svg>
              </a>
              <div className="nav-dropdown">
                <div className="nav-dropdown-item" onClick={() => { goTo('home'); setTimeout(() => document.getElementById('translator')?.scrollIntoView({behavior:'smooth'}), 50); }}>
                  <div className="nav-dropdown-icon nav-dropdown-icon-1"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" width="14" height="14"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/></svg></div>
                  <div><div className="nav-dropdown-label">Speak English with Aria</div><div className="nav-dropdown-sub">Voice AI · Realtime</div></div>
                </div>
                <div className="nav-dropdown-divider" />
                <div className="nav-dropdown-item" onClick={() => { goTo('home'); setTimeout(() => document.getElementById('roadmap')?.scrollIntoView({behavior:'smooth'}), 50); }}>
                  <div className="nav-dropdown-icon nav-dropdown-icon-2"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" width="14" height="14"><rect x="2" y="7" width="20" height="12" rx="2"/><line x1="6" y1="13" x2="10" y2="13"/><line x1="8" y1="11" x2="8" y2="15"/></svg></div>
                  <div><div className="nav-dropdown-label">AI Learning RPG</div><div className="nav-dropdown-sub">Game · Quests · Rank</div></div>
                </div>
                <div className="nav-dropdown-divider" />
                <div className="nav-dropdown-item" onClick={() => { goTo('home'); setTimeout(() => document.getElementById('interview')?.scrollIntoView({behavior:'smooth'}), 50); }}>
                  <div className="nav-dropdown-icon nav-dropdown-icon-3"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" width="14" height="14"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg></div>
                  <div><div className="nav-dropdown-label">Luyện phỏng vấn</div><div className="nav-dropdown-sub">LeetCode · AI explain</div></div>
                </div>
              </div>
            </div>
            {([["Dự Án","projects"],["Blog","blog"],["Liên Hệ","contact"]] as [string,string][]).map(([l,p]) => (
              <a key={l} className={`nav-link${page===p?" active":""}`} onClick={() => goTo(p)}>{l}</a>
            ))}
          </div>
          <button className="nav-cta" onClick={() => { goTo('home'); setTimeout(() => document.getElementById('translator')?.scrollIntoView({behavior:'smooth'}), 50); }}>Practice English</button>
        </div>
      </nav>

      {/* HERO — home only */}
      {page === 'home' && (
        <section id="hero" className="hero">
          <div className="hero-aurora">
            <div className="aurora-blob aurora-1" />
            <div className="aurora-blob aurora-2" />
            <div className="aurora-blob aurora-3" />
            <div className="aurora-blob aurora-4" />
            <div className="hero-grid" />
          </div>
          <div className="hero-fade-bottom" />
          <div className="hero-content">
            <div className="hero-eyebrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="11" height="11"><path d="M12 2L13.9 10.1L22 12L13.9 13.9L12 22L10.1 13.9L2 12L10.1 10.1Z" fill="currentColor" stroke="none"/></svg>
              AI Developer · Experience Designer
            </div>
            <div className="hero-name" ref={nameRef}>
              <div className="hero-name-word">{'Ngọc'.split('').map((ch,i) => <span key={i} className="hero-letter hero-letter-ngoc" data-char={ch}>{ch}</span>)}</div>
              <div className="hero-name-word">{'Phúc'.split('').map((ch,i) => <span key={i} className="hero-letter hero-letter-phuc" data-char={ch}>{ch}</span>)}</div>
            </div>
            <p className="hero-tagline">
              Kiến trúc AI · Phát triển sản phẩm · Thiết kế trải nghiệm<br />
              I blend human creativity with intelligence to build things that matter.
            </p>
            <button className="hero-cta" onClick={() => goTo("news")}>
              Khám phá tác phẩm
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="14" height="14"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </section>
      )}

      {/* FEATURE CARDS — home only */}
      {page === 'home' && (
        <div className="features-section">
          <div className="features-eyebrow">Tính năng nổi bật</div>
          <div className="features-heading">Học · Luyện · Chinh phục</div>
          <div className="features-grid">
            {/* Card 1 — English */}
            <div className="feat-card feat-card-1" onClick={() => document.getElementById('translator')?.scrollIntoView({behavior:'smooth'})}>
              <div className="feat-card-accent" />
              <div className="feat-icon feat-icon-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/><circle cx="19" cy="5" r="3" fill="#fff" stroke="none" opacity="0.3"/><path d="M17 5h4M19 3v4"/></svg>
              </div>
              <div className="feat-tag feat-tag-1">AI · Voice</div>
              <div className="feat-title">Speak English with Aria</div>
              <div className="feat-desc">Talk directly with Aria — AI hears your voice, replies instantly, and corrects your grammar and pronunciation in real time.</div>
              <div className="feat-footer">
                <span className="feat-cta feat-cta-1">Bắt đầu ngay <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="13" height="13"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
                <span className="feat-pill feat-pill-1">Live</span>
              </div>
            </div>

            {/* Card 2 — AI Learning */}
            <div className="feat-card feat-card-2" onClick={() => document.getElementById('roadmap')?.scrollIntoView({behavior:'smooth'})}>
              <div className="feat-card-accent" />
              <div className="feat-icon feat-icon-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><rect x="2" y="7" width="20" height="12" rx="2"/><line x1="6" y1="13" x2="10" y2="13"/><line x1="8" y1="11" x2="8" y2="15"/><circle cx="16" cy="11" r="1" fill="#fff" stroke="none"/><circle cx="18" cy="13" r="1" fill="#fff" stroke="none"/><circle cx="16" cy="15" r="1" fill="#fff" stroke="none"/><circle cx="14" cy="13" r="1" fill="#fff" stroke="none"/></svg>
              </div>
              <div className="feat-tag feat-tag-2">RPG · Quests</div>
              <div className="feat-title">AI Learning RPG</div>
              <div className="feat-desc">Gamify hành trình học AI — hoàn thành quests, mở khoá skill, leo rank từ Novice đến Grand Master.</div>
              <div className="feat-footer">
                <span className="feat-cta feat-cta-2">Vào game <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="13" height="13"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
                <span className="feat-pill feat-pill-2">Beta</span>
              </div>
            </div>

            {/* Card 3 — Interview */}
            <div className="feat-card feat-card-3" onClick={() => document.getElementById('interview')?.scrollIntoView({behavior:'smooth'})}>
              <div className="feat-card-accent" />
              <div className="feat-icon feat-icon-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <div className="feat-tag feat-tag-3">LeetCode · AI</div>
              <div className="feat-title">Luyện phỏng vấn kỹ thuật</div>
              <div className="feat-desc">AI tự động chọn câu hỏi LeetCode phù hợp, giải thích chi tiết và luyện tập theo lộ trình phỏng vấn thực tế.</div>
              <div className="feat-footer">
                <span className="feat-cta feat-cta-3">Luyện tập <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="13" height="13"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
                <span className="feat-pill feat-pill-3">New</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEWS */}
      {(page==='home'||page==='news') && <div className="section-wrap dark" id="news">
        <div className="section">
          <div className="section-label">AI NEWS HÔM NAY</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"2rem",flexWrap:"wrap",gap:"1rem"}}>
            <div>
              <div className="section-title">Tech & AI News</div>
              <div className="section-sub">Hacker News · Dev.to · Wikipedia</div>
            </div>
            <button className="ai-btn" onClick={fetchAndBuildNews} disabled={newsLoading}>
              {newsLoading ? <span className="loading-dots">Đang tải</span> : <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Bài tiếp theo</>}
            </button>
          </div>
          {news.length === 0 && newsLoading && (
            <div style={{textAlign:"center",padding:"3rem",color:"var(--muted)"}}>
              <span className="loading-dots">Đang tải bài viết</span>
            </div>
          )}
          <div className="news-scroll" ref={newsScrollRef}>
            <div className="news-scroll-inner">
              {news.map((n, i) => (
                <div key={n.url+i} className="news-card" onClick={() => openArticle(i)}>
                  <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap",marginBottom:"0.75rem"}}>
                    <span className={`news-type-badge ${n.type==="wiki"?"news-type-wiki":n.type==="devto"||n.type==="reddit"?"news-type-social":n.type==="github"?"news-type-paper":"news-type-hot"}`}>
                      {n.type==="wiki"?"📚 Wiki":n.type==="devto"?"✍️ Dev.to":n.type==="github"?"⭐ GitHub":n.type==="reddit"?"🔴 Reddit":"🔥 HN"}
                    </span>
                    <span className="news-tag" style={{marginBottom:0}}>{n.source}</span>
                  </div>
                  <div className="news-title">{n.title}</div>
                  {n.keywords.length > 0 && (
                    <div style={{display:"flex",flexWrap:"wrap",gap:"0.35rem",margin:"0.6rem 0 0.5rem"}}>
                      {n.keywords.map((kw,ki) => (
                        <span key={ki} style={{fontSize:"0.63rem",padding:"0.15rem 0.55rem",borderRadius:"999px",background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.5)",border:"1px solid rgba(255,255,255,0.1)",letterSpacing:"0.04em"}}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="news-meta" style={{marginTop:"0.5rem"}}>{n.meta}</div>
                  <a href={n.url} target="_blank" rel="noreferrer" className="news-source-link" onClick={e => e.stopPropagation()}>
                    ↗ Read original
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>}

      {/* MAIN SECTIONS — hidden on placeholder pages */}
      {page !== 'projects' && page !== 'blog' && page !== 'contact' && <>

      {/* VOICE BOT */}
      <div className="section-wrap" id="translator">
        <div className="section">
          <div className="section-label">🎙️ VOICE ENGLISH PRACTICE</div>
          <div className="section-title">Speak with Aria</div>
          <div className="section-sub">Talk directly with Aria — AI listens to your voice, replies out loud, and corrects your grammar in real time</div>

          {!geminiKey ? (
            <div className="api-key-banner">
              <span>🔑</span>
              <span>Enter your HuggingFace token (hf_...) — free at <a href="https://huggingface.co/settings/tokens/new?ownUserPermissions=inference.serverless.write&tokenType=fineGrained" target="_blank" rel="noreferrer" style={{color:"#a78bfa"}}>huggingface.co/settings/tokens</a></span>
              <input className="api-key-input" placeholder="hf_..." value={keyInput} onChange={e => setKeyInput(e.target.value)} onKeyDown={e => e.key==="Enter" && saveKey()} type="password" />
              <button className="ai-btn" style={{borderRadius:"8px",padding:"0.45rem 1rem"}} onClick={saveKey}>Save</button>
            </div>
          ) : (
            <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"1.5rem",fontSize:"0.78rem",color:"var(--muted)"}}>
              <span style={{color:"#4ade80"}}>✓ HuggingFace token connected</span>
              <button onClick={() => { setGeminiKey(""); geminiKeyRef.current = ""; try { localStorage.removeItem("puc_gemini_key"); } catch {} }} style={{background:"none",border:"none",color:"rgba(255,255,255,0.3)",cursor:"pointer",fontSize:"0.75rem",textDecoration:"underline"}}>Remove key</button>
            </div>
          )}

          <div className="vbot-card">
            {/* Hero — orb + name + waveform + controls */}
            <div className="vbot-hero">
              <div className="vbot-orb-wrap" onClick={vListening ? stopListening : startListening}>
                <div className={`vbot-glow${vListening||vSpeaking?" on":""}`} />
                <div className={`vbot-orb${vListening?" listening":vSpeaking?" speaking":""}`}>
                  {vListening ? (
                    <svg className="vbot-orb-icon" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" width="32" height="32">
                      <rect x="9" y="2" width="6" height="12" rx="3" fill="white" stroke="none"/>
                      <path d="M5 10a7 7 0 0 0 14 0"/>
                      <line x1="12" y1="17" x2="12" y2="21"/>
                      <line x1="8" y1="21" x2="16" y2="21"/>
                    </svg>
                  ) : vSpeaking ? (
                    <svg className="vbot-orb-icon" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="30" height="30">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="rgba(255,255,255,0.9)" stroke="none"/>
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                    </svg>
                  ) : (
                    <svg className="vbot-orb-icon" viewBox="0 0 24 24" fill="white" width="34" height="34">
                      <path d="M12 2L13.9 10.1L22 12L13.9 13.9L12 22L10.1 13.9L2 12L10.1 10.1Z"/>
                    </svg>
                  )}
                </div>
              </div>
              <div className="vbot-waveform">
                {[0,1,2,3,4,5,6].map(i => (
                  <div key={i} className={`vbot-bar${vListening||vSpeaking?" active":" idle"}`} />
                ))}
              </div>
              <div className="vbot-name-row">
                <div className="vbot-name">Aria</div>
                <div className="vbot-online">
                  <span className="vbot-online-dot" />
                  Free · Whisper · 24/7
                </div>
              </div>
              <div className={`vbot-status${vListening||vSpeaking?" active":""}`}>{vStatus}</div>
              <div className="vbot-controls">
                <div className="vbot-mic-wrap">
                  <div className={`vbot-sonar${vListening?" active":""}`} />
                  <div className={`vbot-sonar vbot-sonar-2${vListening?" active":""}`} />
                  <button
                    className={`vbot-mic-btn${vListening?" listening":""}`}
                    onClick={vListening ? stopListening : startListening}
                    disabled={!geminiKey || vLoading}
                  >
                    {vListening ? (
                      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><rect x="5" y="5" width="14" height="14" rx="3"/></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22">
                        <rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor" stroke="none"/>
                        <path d="M5 10a7 7 0 0 0 14 0"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                      </svg>
                    )}
                  </button>
                </div>
                <div className="vbot-mic-label">{vListening ? "Tap to stop" : vSpeaking ? "Speaking..." : "Tap to talk"}</div>
                <div className="vbot-modes">
                  {(["free","grammar"] as VBotMode[]).map(m => (
                    <button key={m} className={`vbot-mode-chip${vMode===m?" active":""}`} onClick={() => { setVMode(m); setVMsgs([]); window.speechSynthesis.cancel(); setVStatus("Mode changed — tap mic to start"); }}>
                      {m==="free"
                        ? <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="11" height="11"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> Free</>
                        : <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="11" height="11"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Grammar</>
                      }
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="vbot-divider" />

            {/* Chat */}
            <div className="vbot-chat">
              <div className="vbot-msgs" ref={vMsgsRef}>
                {vMsgs.length === 0 && (
                  <div style={{textAlign:"center",padding:"2.5rem 1rem",color:"var(--muted)"}}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" width="48" height="48" style={{marginBottom:"0.75rem"}}>
                      <rect x="9" y="2" width="6" height="12" rx="3"/>
                      <path d="M5 10a7 7 0 0 0 14 0"/>
                      <line x1="12" y1="17" x2="12" y2="21"/>
                      <line x1="8" y1="21" x2="16" y2="21"/>
                    </svg>
                    <div style={{fontSize:"0.88rem",marginBottom:"0.4rem"}}>Tap the orb or mic to start speaking</div>
                    <div style={{fontSize:"0.75rem"}}>Aria will reply out loud — works in Chrome &amp; Safari</div>
                  </div>
                )}
                {vMsgs.map((m, i) => (
                  <div key={i} className={`vbot-turn ${m.role}`}>
                    <div className={`vbot-avatar ${m.role}`}>
                      {m.role==="ai" ? (
                        <svg viewBox="0 0 24 24" fill="white" width="13" height="13"><path d="M12 2L13.9 10.1L22 12L13.9 13.9L12 22L10.1 13.9L2 12L10.1 10.1Z"/></svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="rgba(255,255,255,0.65)" width="14" height="14"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.9 3.6-7 8-7s8 3.1 8 7H4z"/></svg>
                      )}
                    </div>
                    <div>
                      <div className={`vbot-bubble ${m.role}`}>{m.text}</div>
                      {m.correction && <div className="vbot-correction">✏️ {m.correction}</div>}
                    </div>
                  </div>
                ))}
                {vLoading && (
                  <div className="vbot-turn ai">
                    <div className="vbot-avatar ai">
                      <svg viewBox="0 0 24 24" fill="white" width="13" height="13"><path d="M12 2L13.9 10.1L22 12L13.9 13.9L12 22L10.1 13.9L2 12L10.1 10.1Z"/></svg>
                    </div>
                    <div className="vbot-bubble ai"><span className="loading-dots">Aria is thinking</span></div>
                  </div>
                )}
                <div ref={vEndRef} />
              </div>
              <div className="vbot-input-row">
                <input
                  className="vbot-text-input"
                  placeholder="Or type here if mic doesn't work..."
                  value={vInput}
                  onChange={e => setVInput(e.target.value)}
                  onKeyDown={e => { if(e.key==="Enter" && vInput.trim() && !vLoading) { handleVoiceInput(vInput); setVInput(""); } }}
                  disabled={!geminiKey}
                />
                <button className="vbot-send-btn" onClick={() => { if(vInput.trim()) { handleVoiceInput(vInput); setVInput(""); } }} disabled={!vInput.trim() || vLoading || !geminiKey}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2" fill="white" stroke="none"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GAME MODE */}
      <div className="section-wrap green" id="roadmap">
        <div className="section">
          <div className="section-label" style={{display:"flex",alignItems:"center",gap:"0.4rem"}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><rect x="2" y="7" width="20" height="12" rx="2"/><line x1="6" y1="13" x2="10" y2="13"/><line x1="8" y1="11" x2="8" y2="15"/><circle cx="16" cy="11" r="0.5" fill="currentColor"/><circle cx="18" cy="13" r="0.5" fill="currentColor"/><circle cx="16" cy="15" r="0.5" fill="currentColor"/><circle cx="14" cy="13" r="0.5" fill="currentColor"/></svg>GAME MODE</div>
          <div className="section-title">AI Learning RPG</div>
          <div className="section-sub">Hoàn thành quests, lên rank, mở khoá skill</div>

          {/* Stats Dashboard */}
          <div className="gm-stats">
            <div className="rank-badge">
              <span className="rank-icon" style={{filter:`drop-shadow(0 0 10px ${currentRank.glow})`,color:currentRank.color}}>{RANK_SVGS[currentRank.name]}</span>
              <span className="rank-name" style={{color:currentRank.color}}>{currentRank.name}</span>
            </div>
            <div className="level-info">
              <div className="level-row">
                <span className="level-title">Level {currentLevel}</span>
                <div className="xp-bar-lg">
                  <div className="xp-fill-lg" style={{width:`${levelProgress.pct}%`, background:`linear-gradient(90deg, ${currentRank.color}, ${currentRank.glow.replace('0.','0.9')})`}} />
                </div>
                <span className="xp-caption">{levelProgress.cur}/{levelProgress.needed}</span>
              </div>
              <div style={{display:"flex",gap:"1.5rem",flexWrap:"wrap"}}>
                <span style={{fontSize:"0.75rem",color:"var(--muted)",display:"flex",alignItems:"center",gap:"0.3rem"}}><svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12" style={{color:"var(--accent)"}}><path d="M13 2L3 14h9l-1 8 10-12h-9z"/></svg> <span style={{color:"var(--accent)",fontWeight:500}}>{xp}</span> XP tổng</span>
                <span style={{fontSize:"0.75rem",color:"var(--muted)",display:"flex",alignItems:"center",gap:"0.3rem"}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12" style={{color:currentRank.color}}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg> Rank <span style={{color:currentRank.color,fontWeight:500}}>{currentRank.name}</span></span>
                <span style={{fontSize:"0.75rem",color:"var(--muted)",display:"flex",alignItems:"center",gap:"0.3rem"}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12" style={{color:"#fbbf24"}}><path d="M8 21h8M12 21v-4M17 4h3v4a3 3 0 01-3 3M7 4H4v4a3 3 0 003 3M6 7a6 6 0 0012 0V4H6v3z"/></svg> <span style={{color:"var(--fg)",fontWeight:500}}>{unlockedAchievements.length}</span>/{ACHIEVEMENTS_DEF.length} badges</span>
              </div>
            </div>
            <div className="gm-right">
              <span className="streak-num">{streak}</span>
              <span className="streak-lbl" style={{display:"flex",alignItems:"center",gap:"0.3rem"}}><svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/></svg>streak</span>
            </div>
          </div>

          {/* Tab nav */}
          <div className="gm-tabs">
            {(["tasks","achievements"] as const).map(tab => (
              <button key={tab} className={`gm-tab${gameTab===tab?" active":""}`} onClick={() => setGameTab(tab)}>
                {tab==="tasks"
                  ? <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="13" height="13"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Tasks</>
                  : <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg> Achievements</>
                }
              </button>
            ))}
          </div>

          {/* Custom Tasks */}
          {(gameTab === "tasks" || gameTab === "quests" || gameTab === "skills") && (
            <div className="today-box">
              <div className="today-header">
                <div className="today-title" style={{display:"flex",alignItems:"center",gap:"0.4rem"}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>Custom Tasks — {doneTasks}/{tasks.length} hoàn thành</div>
              </div>
              <div className="task-list">
                {tasks.map(t => (
                  <div key={t.id} className={`task-item${t.done?" done":""}`}>
                    <div className={`task-check${t.done?" checked":""}`} onClick={() => toggleTask(t.id)}>
                      {t.done && <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                    <input className={`task-text-input${t.done?" done-text":""}`} value={t.text} placeholder="Nhập task..." onChange={e => updateTask(t.id,"text",e.target.value)} disabled={t.done} />
                    <input className="task-xp-input" value={t.xp} type="number" min={1} onChange={e => updateTask(t.id,"xp",e.target.value)} disabled={t.done} title="XP" />
                    <span style={{fontSize:"0.7rem",color:"var(--accent)",minWidth:"24px"}}>XP</span>
                    <button className="task-delete" onClick={() => deleteTask(t.id)}>×</button>
                  </div>
                ))}
                <button className="add-task-btn" onClick={addTask}>+ Thêm task mới</button>
              </div>
            </div>
          )}

          {/* Achievements */}
          {gameTab === "achievements" && (
            <div>
              <div style={{fontSize:"0.72rem",color:"var(--muted)",marginBottom:"1rem"}}>
                {unlockedAchievements.length}/{ACHIEVEMENTS_DEF.length} badges đã mở khoá
              </div>
              <div className="achiev-grid">
                {ACHIEVEMENTS_DEF.map(a => {
                  const unlocked = unlockedAchievements.includes(a.id);
                  return (
                    <div key={a.id} className={`achiev-card${unlocked?" unlocked":" locked"}`}>
                      <span className="ach-icon" style={{color: unlocked ? a.color : "rgba(255,255,255,0.2)", filter: unlocked ? `drop-shadow(0 0 6px ${a.color})` : "none"}}>{ACHIEV_SVGS[a.id] ?? a.icon}</span>
                      <span className="ach-name">{a.name}</span>
                      <span className="ach-desc">{a.desc}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* INTERVIEW */}
      <div className="section-wrap dark" id="interview">
        <div className="section">
          <div className="section-label">💼 PHỎNG VẤN KỸ THUẬT</div>
          <div className="section-title">Luyện phỏng vấn</div>
          <div className="section-sub">Câu hỏi thực từ Google, Meta, OpenAI, Nvidia…</div>
          {ivPoolLoading ? (
            <div style={{textAlign:"center",padding:"3rem",color:"var(--muted)"}}>
              <span className="loading-dots">Đang tải câu hỏi từ các công ty</span>
            </div>
          ) : (
          <div className="interview-list">
            {ivDisplayed.map((item,i) => (
              <div key={item.link+i} className="interview-item">
                <div className="interview-q" onClick={() => setOpenQ(openQ===i?null:i)}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",gap:"0.5rem",alignItems:"center",marginBottom:"0.3rem",flexWrap:"wrap"}}>
                      <span style={{fontSize:"0.65rem",padding:"0.15rem 0.55rem",borderRadius:"999px",background:"rgba(99,102,241,0.1)",color:"#4f46e5",fontWeight:600,letterSpacing:"0.05em"}}>{item.company}</span>
                      <span className={`interview-level level-${item.difficulty.toLowerCase()}`}>{item.difficulty}</span>
                    </div>
                    <span className="interview-q-text">{i+1}. {item.title}</span>
                    {item.topics && <div style={{fontSize:"0.7rem",color:"var(--muted)",marginTop:"0.25rem",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.topics}</div>}
                  </div>
                  <span style={{color:"var(--muted)",fontSize:"0.8rem",flexShrink:0,marginLeft:"0.75rem"}}>{openQ===i?"▲":"▼"}</span>
                </div>
                <div className={`interview-body${openQ===i?" open":""}`}>
                  <div style={{display:"flex",gap:"1rem",alignItems:"center",flexWrap:"wrap"}}>
                    <a href={item.link} target="_blank" rel="noreferrer" style={{fontSize:"0.75rem",color:"var(--accent)",display:"inline-flex",alignItems:"center",gap:"0.3rem",border:"1px solid rgba(80,70,229,0.25)",borderRadius:"8px",padding:"0.35rem 0.9rem",textDecoration:"none",fontWeight:500,background:"rgba(80,70,229,0.06)"}}>↗ Mở trên LeetCode</a>
                    <button className="ai-btn" style={{background:"rgba(99,102,241,0.08)",border:"1px solid rgba(99,102,241,0.25)",fontSize:"0.75rem",padding:"0.35rem 0.9rem",color:"var(--accent)",fontWeight:500}} onClick={() => nextQuestion(i)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Câu tiếp theo
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
          <div style={{textAlign:"center",marginTop:"5rem",color:"var(--muted)",fontSize:"0.75rem",letterSpacing:"0.06em"}}>
            © 2026 Puc — Nguyễn Ngọc Phúc. All rights reserved.
          </div>
        </div>
      </div>

      </>}

      {/* PLACEHOLDER PAGES */}
      {(page === 'projects' || page === 'blog' || page === 'contact') && (
        <div className="placeholder-page">
          <div className="placeholder-badge">Đang xây dựng</div>
          <div className="placeholder-title">
            {page === 'projects' ? 'Dự Án' : page === 'blog' ? 'Blog' : 'Liên Hệ'}
          </div>
          <div className="placeholder-sub">Trang này đang được phát triển...</div>
        </div>
      )}
    </div>
  );
}