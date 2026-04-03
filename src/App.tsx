import { useEffect, useRef, useState } from "react";

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500&display=swap');

  :root {
    --fg: #ffffff;
    --muted: rgba(255,255,255,0.55);
    --accent: #a8e6cf;
    --font-display: 'Instrument Serif', serif;
    --font-body: 'Inter', sans-serif;
    --font-name: 'Cormorant Garamond', serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: var(--font-body); background: #0a0f1a; color: var(--fg); overflow-x: hidden; }

  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; transition: background 0.4s; }
  .nav.scrolled { background: rgba(0,0,0,0.55); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
  .nav-inner { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 2.5rem; max-width: 1200px; margin: 0 auto; }
  .nav-logo { font-family: var(--font-name); font-weight: 300; font-size: 1.5rem; letter-spacing: 0.12em; cursor: pointer; }
  .nav-links { display: flex; gap: 2rem; }
  .nav-link { font-size: 0.8rem; color: var(--muted); text-decoration: none; cursor: pointer; transition: color 0.2s; }
  .nav-link:hover { color: var(--fg); }
  .nav-cta { background: white; color: #000; border: none; border-radius: 999px; padding: 0.55rem 1.4rem; font-size: 0.8rem; font-family: var(--font-body); cursor: pointer; font-weight: 500; }

  .hero { position: relative; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; overflow: hidden; }
  .hero-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }
  .hero-video::-webkit-media-controls, video::-webkit-media-controls-panel, video::-webkit-media-controls-play-button, video::-webkit-media-controls-start-playback-button { display: none !important; -webkit-appearance: none; }
  .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 60%, rgba(10,15,26,0.9) 100%); z-index: 1; }
  .hero-content { position: relative; z-index: 2; }
  .hero-name { font-family: var(--font-name); font-weight: 400; font-size: clamp(5rem, 16vw, 14rem); line-height: 0.88; letter-spacing: -0.02em; background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(220,210,255,0.95) 20%, rgba(255,255,255,0.6) 40%, rgba(180,170,220,0.5) 55%, rgba(255,255,255,0.9) 70%, rgba(200,195,240,0.7) 85%, rgba(255,255,255,0.4) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; mix-blend-mode: screen; filter: drop-shadow(0 0 30px rgba(255,255,255,0.4)); }
  .hero-name em { font-style: italic; font-weight: 300; background: linear-gradient(160deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,1) 25%, rgba(210,200,255,0.7) 50%, rgba(255,255,255,0.95) 70%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .hero-tagline { color: var(--muted); font-size: clamp(0.9rem, 1.5vw, 1rem); margin-top: 2rem; line-height: 1.8; }
  .hero-cta { margin-top: 2.5rem; display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--fg); border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 2px; cursor: pointer; background: none; border-top: none; border-left: none; border-right: none; font-family: var(--font-body); }

  .section { padding: 6rem 2rem; max-width: 1100px; margin: 0 auto; }
  .section-label { font-size: 0.7rem; letter-spacing: 0.18em; color: var(--muted); text-transform: uppercase; margin-bottom: 1rem; }
  .section-title { font-family: var(--font-name); font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 300; margin-bottom: 0.5rem; }
  .section-sub { color: var(--muted); font-size: 0.9rem; margin-bottom: 2.5rem; }
  .section-wrap { background: #0a0f1a; padding: 6rem 0; }
  .section-wrap.dark { background: #070b14; }
  .section-wrap.green { background: linear-gradient(to bottom, #0a1a0d, #070b14); }

  .news-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent; margin: 0 -2rem; padding: 0 2rem 1.25rem; }
  .news-scroll::-webkit-scrollbar { height: 4px; }
  .news-scroll::-webkit-scrollbar-track { background: transparent; }
  .news-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 999px; }
  .news-scroll-inner { display: flex; gap: 1.25rem; width: max-content; }
  .news-card { width: 310px; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 1.5rem; background: rgba(255,255,255,0.03); cursor: pointer; transition: background 0.2s, transform 0.2s; }
  .news-card:hover { background: rgba(255,255,255,0.07); transform: translateY(-3px); }
  .news-card.expanded { background: rgba(255,255,255,0.06); transform: none; border-color: rgba(168,230,207,0.25); }
  .news-type-badge { display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.6rem; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.15rem 0.5rem; border-radius: 999px; }
  .news-type-hot { background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.2); }
  .news-type-wiki { background: rgba(100,149,237,0.15); color: #6495ed; border: 1px solid rgba(100,149,237,0.25); }
  .news-type-paper { background: rgba(251,191,36,0.1); color: #fbbf24; border: 1px solid rgba(251,191,36,0.2); }
  .news-type-social { background: rgba(167,139,250,0.15); color: #a78bfa; border: 1px solid rgba(167,139,250,0.25); }
  .news-tag { display: inline-block; font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.2rem 0.6rem; border-radius: 999px; background: rgba(168,230,207,0.15); color: var(--accent); border: 1px solid rgba(168,230,207,0.25); margin-bottom: 0.75rem; }
  .news-title { font-family: var(--font-name); font-size: 1.15rem; font-weight: 400; line-height: 1.3; margin-bottom: 0.6rem; }
  .news-desc { font-size: 0.8rem; color: var(--muted); line-height: 1.7; margin-bottom: 1rem; }
  .news-meta { font-size: 0.7rem; color: rgba(255,255,255,0.3); }
  .news-source-link { font-size: 0.72rem; color: var(--accent); margin-top: 0.5rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.3rem; }
  .news-source-link:hover { text-decoration: underline; }
  .news-expand { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.08); }
  .news-analysis { font-size: 0.82rem; color: rgba(255,255,255,0.75); line-height: 1.8; margin-bottom: 1rem; }
  .read-more-btn { display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(168,230,207,0.1); border: 1px solid rgba(168,230,207,0.3); color: var(--accent); border-radius: 8px; padding: 0.45rem 1rem; font-size: 0.78rem; cursor: pointer; font-family: var(--font-body); transition: background 0.2s; margin-top: 0.5rem; }
  .read-more-btn:hover { background: rgba(168,230,207,0.2); }

  .ai-btn { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(168,230,207,0.1); border: 1px solid rgba(168,230,207,0.3); color: var(--accent); border-radius: 999px; padding: 0.5rem 1.2rem; font-size: 0.78rem; cursor: pointer; font-family: var(--font-body); transition: background 0.2s; }
  .ai-btn:hover { background: rgba(168,230,207,0.2); }
  .ai-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ARTICLE PAGE */
  .article-page { position: fixed; inset: 0; background: #070b14; z-index: 200; display: flex; flex-direction: column; animation: slideUp 0.4s ease; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  .article-back { background: rgba(7,11,20,0.95); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); padding: 0.75rem 1.5rem; display: flex; align-items: center; gap: 1rem; z-index: 10; border-bottom: 1px solid rgba(255,255,255,0.06); flex-shrink: 0; }
  .article-back-btn { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: var(--fg); border-radius: 999px; padding: 0.4rem 1rem; font-size: 0.8rem; cursor: pointer; font-family: var(--font-body); transition: background 0.2s; }
  .article-back-btn:hover { background: rgba(255,255,255,0.12); }
  .article-split { display: flex; flex: 1; overflow: hidden; }
  .article-split-left { flex: 1; overflow-y: auto; }
  .article-split-right { width: 360px; flex-shrink: 0; border-left: 1px solid rgba(255,255,255,0.07); display: flex; flex-direction: column; background: rgba(0,0,0,0.25); }
  .art-chat-header { padding: 0.9rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.07); font-size: 0.78rem; color: var(--muted); flex-shrink: 0; }
  .art-chat-msgs { flex: 1; overflow-y: auto; padding: 1rem 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; }
  .art-chat-msg { padding: 0.6rem 0.85rem; border-radius: 10px; font-size: 0.82rem; line-height: 1.65; max-width: 92%; }
  .art-chat-msg.user { background: rgba(168,230,207,0.12); color: var(--fg); align-self: flex-end; }
  .art-chat-msg.ai { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.85); align-self: flex-start; }
  .art-chat-input-row { padding: 0.75rem 1rem; border-top: 1px solid rgba(255,255,255,0.07); display: flex; gap: 0.5rem; flex-shrink: 0; }
  .art-chat-input { flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 0.5rem 0.85rem; color: var(--fg); font-family: var(--font-body); font-size: 0.82rem; outline: none; }
  .art-chat-input::placeholder { color: rgba(255,255,255,0.25); }
  .article-inner { max-width: 720px; margin: 0 auto; padding: 2.5rem 2rem 5rem; }
  .article-tag { display: inline-block; font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.25rem 0.7rem; border-radius: 999px; background: rgba(168,230,207,0.15); color: var(--accent); border: 1px solid rgba(168,230,207,0.25); margin-bottom: 1.25rem; }
  .article-title { font-family: var(--font-name); font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 400; line-height: 1.2; margin-bottom: 1rem; }
  .article-meta { font-size: 0.75rem; color: var(--muted); margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
  .article-img { width: 100%; height: 120px; border-radius: 12px; background: linear-gradient(135deg, rgba(168,230,207,0.08), rgba(255,255,255,0.04)); display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; border: 1px solid rgba(255,255,255,0.06); overflow: hidden; position: relative; }
  .article-img-loading { font-size: 0.85rem; color: var(--muted); }
  .article-body { font-size: 0.95rem; line-height: 1.95; color: rgba(255,255,255,0.85); }
  .article-body p { margin-bottom: 1.4rem; }
  .article-body .en-term { color: #e2c97e; font-style: italic; }
  .article-glossary { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.08); }
  .article-glossary-title { font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin-bottom: 1.25rem; }
  .glossary-item { display: flex; gap: 1rem; margin-bottom: 1rem; padding: 0.85rem 1rem; background: rgba(255,255,255,0.03); border-radius: 10px; border-left: 2px solid rgba(226,201,126,0.4); }
  .glossary-term { font-size: 0.82rem; color: #e2c97e; font-style: italic; min-width: 140px; font-weight: 500; }
  .glossary-def { font-size: 0.82rem; color: var(--muted); line-height: 1.6; }
  .article-source-link { display: inline-flex; align-items: center; gap: 0.5rem; color: var(--accent); font-size: 0.85rem; text-decoration: none; margin-top: 2rem; }
  .article-source-link:hover { text-decoration: underline; }

  /* VOICE BOT */
  .vbot-wrap { display: flex; gap: 2rem; align-items: flex-start; flex-wrap: wrap; }
  .vbot-left { flex: 1; min-width: 280px; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; padding: 2.5rem 1.5rem; border: 1px solid rgba(255,255,255,0.07); border-radius: 24px; background: rgba(255,255,255,0.02); }
  .vbot-orb { position: relative; width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
  .vbot-orb-inner { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg,#6366f1,#a78bfa); display: flex; align-items: center; justify-content: center; font-size: 2rem; transition: transform 0.2s; box-shadow: 0 0 30px rgba(99,102,241,0.3); z-index: 1; position: relative; }
  .vbot-orb:hover .vbot-orb-inner { transform: scale(1.08); }
  .vbot-ring { position: absolute; inset: 0; border-radius: 50%; border: 2px solid rgba(99,102,241,0.4); animation: none; }
  .vbot-ring.listening { animation: vbotPulse 1s ease-in-out infinite; }
  .vbot-ring.speaking { animation: vbotSpeak 0.6s ease-in-out infinite alternate; }
  @keyframes vbotPulse { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.25);opacity:0.15} }
  @keyframes vbotSpeak { from{transform:scale(1.05);opacity:0.5} to{transform:scale(1.3);opacity:0.1} }
  .vbot-ring2 { position: absolute; inset: -10px; border-radius: 50%; border: 1.5px solid rgba(167,139,250,0.2); }
  .vbot-ring2.listening { animation: vbotPulse 1s ease-in-out infinite 0.2s; }
  .vbot-ring2.speaking { animation: vbotSpeak 0.6s ease-in-out infinite alternate 0.15s; }
  .vbot-status-text { font-size: 0.82rem; color: var(--muted); text-align: center; min-height: 1.2em; }
  .vbot-status-text.active { color: #a78bfa; }
  .vbot-mic-btn { padding: 0.65rem 2rem; border-radius: 999px; border: 1.5px solid rgba(99,102,241,0.5); background: rgba(99,102,241,0.12); color: #a78bfa; font-family: var(--font-body); font-size: 0.85rem; cursor: pointer; transition: all 0.2s; font-weight: 500; }
  .vbot-mic-btn:hover { background: rgba(99,102,241,0.25); }
  .vbot-mic-btn.listening { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.5); color: #f87171; animation: vbotBlink 1s ease-in-out infinite; }
  @keyframes vbotBlink { 0%,100%{opacity:1} 50%{opacity:0.6} }
  .vbot-mic-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .vbot-modes-row { display: flex; gap: 0.4rem; flex-wrap: wrap; justify-content: center; }
  .vbot-mode-chip { font-size: 0.65rem; padding: 0.2rem 0.6rem; border-radius: 999px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); color: var(--muted); cursor: pointer; font-family: var(--font-body); transition: all 0.15s; }
  .vbot-mode-chip.active { background: rgba(99,102,241,0.2); border-color: rgba(99,102,241,0.5); color: #a78bfa; }
  .vbot-right { flex: 2; min-width: 300px; display: flex; flex-direction: column; gap: 0; border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; overflow: hidden; height: 480px; background: rgba(255,255,255,0.01); }
  .vbot-transcript { flex: 1; overflow-y: auto; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; }
  .vbot-turn { display: flex; flex-direction: column; gap: 0.2rem; }
  .vbot-turn.user { align-items: flex-end; }
  .vbot-turn.ai { align-items: flex-start; }
  .vbot-bubble { padding: 0.65rem 1rem; border-radius: 14px; font-size: 0.84rem; line-height: 1.7; max-width: 85%; }
  .vbot-bubble.user { background: rgba(99,102,241,0.2); color: var(--fg); border-bottom-right-radius: 3px; }
  .vbot-bubble.ai { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.9); border-bottom-left-radius: 3px; }
  .vbot-correction { font-size: 0.72rem; color: #fbbf24; padding: 0.3rem 0.65rem; background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.15); border-radius: 6px; max-width: 85%; align-self: flex-end; }
  .vbot-input-row { border-top: 1px solid rgba(255,255,255,0.07); padding: 0.75rem 1rem; display: flex; gap: 0.6rem; flex-shrink: 0; }
  .vbot-text-input { flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 0.55rem 0.9rem; color: var(--fg); font-family: var(--font-body); font-size: 0.83rem; outline: none; }
  .vbot-text-input::placeholder { color: rgba(255,255,255,0.2); }
  .vbot-send-btn { background: linear-gradient(135deg,#6366f1,#a78bfa); border: none; border-radius: 8px; padding: 0 0.9rem; color: white; font-size: 0.9rem; cursor: pointer; flex-shrink: 0; }
  .vbot-send-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .chat-area { padding: 1.5rem; border-top: 1px solid rgba(255,255,255,0.08); max-height: 320px; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; }
  .chat-msg { padding: 0.75rem 1rem; border-radius: 10px; font-size: 0.85rem; line-height: 1.7; max-width: 85%; }
  .chat-msg.user { background: rgba(168,230,207,0.12); color: var(--fg); align-self: flex-end; }
  .chat-msg.ai { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.85); align-self: flex-start; }
  .chat-input-row { border-top: 1px solid rgba(255,255,255,0.08); padding: 1rem 1.5rem; display: flex; gap: 0.75rem; }
  .chat-input { flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 0.6rem 1rem; color: var(--fg); font-family: var(--font-body); font-size: 0.85rem; outline: none; }
  .chat-input::placeholder { color: rgba(255,255,255,0.25); }

  .roadmap-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
  .xp-bar-wrap { display: flex; align-items: center; gap: 1rem; }
  .xp-label { font-size: 0.8rem; color: var(--accent); }
  .xp-bar { width: 180px; height: 6px; background: rgba(255,255,255,0.1); border-radius: 999px; overflow: hidden; }
  .xp-fill { height: 100%; background: linear-gradient(90deg, #a8e6cf, #7dd3b0); border-radius: 999px; transition: width 0.5s ease; }
  .streak { font-size: 0.85rem; color: #fbbf24; }
  .roadmap-tabs { display: flex; gap: 0.5rem; margin-bottom: 2rem; flex-wrap: wrap; }
  .tab { padding: 0.4rem 1rem; border-radius: 999px; border: 1px solid rgba(255,255,255,0.15); font-size: 0.78rem; cursor: pointer; color: var(--muted); background: transparent; font-family: var(--font-body); transition: all 0.2s; }
  .tab.active { background: var(--accent); color: #000; border-color: var(--accent); font-weight: 500; }
  .today-box { background: rgba(168,230,207,0.06); border: 1px solid rgba(168,230,207,0.2); border-radius: 14px; padding: 1.5rem; margin-bottom: 2rem; }
  .today-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
  .today-title { font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); }
  @media (max-width: 768px) { .gm-stats { grid-template-columns: auto 1fr auto; gap: 1rem; } .skill-node { width: 140px; } .achiev-grid { grid-template-columns: repeat(2,1fr); } }
  .task-list { display: flex; flex-direction: column; gap: 0.6rem; }
  .task-item { display: flex; align-items: center; gap: 0.9rem; padding: 0.75rem 1rem; border-radius: 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); }
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
  .gm-stats { display: grid; grid-template-columns: auto 1fr auto; gap: 1.5rem; align-items: center; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 1.25rem 1.5rem; margin-bottom: 2rem; }
  .rank-badge { display: flex; flex-direction: column; align-items: center; gap: 0.35rem; min-width: 64px; }
  .rank-icon { font-size: 2rem; line-height: 1; }
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
  .gm-tabs { display: flex; gap: 0.3rem; margin-bottom: 1.75rem; background: rgba(255,255,255,0.04); border-radius: 12px; padding: 0.3rem; }
  .gm-tab { flex: 1; padding: 0.5rem 0.3rem; border-radius: 8px; border: none; font-family: var(--font-body); font-size: 0.78rem; cursor: pointer; color: var(--muted); background: transparent; transition: all 0.2s; }
  .gm-tab.active { background: rgba(255,255,255,0.1); color: var(--fg); font-weight: 500; }
  .quest-grid { display: flex; flex-direction: column; gap: 0.75rem; }
  .quest-card { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); cursor: pointer; transition: all 0.2s; user-select: none; }
  .quest-card:hover:not(.done) { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.14); }
  .quest-card.done { opacity: 0.55; border-color: rgba(168,230,207,0.2); background: rgba(168,230,207,0.04); cursor: default; }
  .quest-icon { font-size: 1.3rem; width: 32px; text-align: center; flex-shrink: 0; }
  .quest-text { flex: 1; font-size: 0.88rem; line-height: 1.4; }
  .quest-xp { font-size: 0.78rem; color: var(--accent); font-weight: 600; white-space: nowrap; }
  .quest-done-check { font-size: 1rem; color: var(--accent); }
  .skill-tree-wrap { display: flex; flex-direction: column; gap: 2rem; }
  .tier-section { }
  .tier-label { font-size: 0.65rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .tier-nodes { display: flex; gap: 0.75rem; flex-wrap: wrap; }
  .skill-node { border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1rem 1.1rem; background: rgba(255,255,255,0.03); width: 180px; flex-shrink: 0; transition: all 0.25s; }
  .skill-node.unlocked { border-color: rgba(168,230,207,0.4); background: rgba(168,230,207,0.06); }
  .skill-node.locked { opacity: 0.38; filter: grayscale(0.5); }
  .sn-icon { font-size: 1.4rem; margin-bottom: 0.35rem; }
  .sn-name { font-size: 0.84rem; font-weight: 500; margin-bottom: 0.2rem; }
  .sn-desc { font-size: 0.71rem; color: var(--muted); line-height: 1.45; margin-bottom: 0.5rem; }
  .sn-req { font-size: 0.67rem; color: #fbbf24; }
  .sn-badge { font-size: 0.67rem; color: var(--accent); font-weight: 500; }
  .achiev-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.85rem; }
  .achiev-card { border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.1rem 1rem; background: rgba(255,255,255,0.03); display: flex; flex-direction: column; align-items: center; gap: 0.4rem; text-align: center; transition: all 0.2s; }
  .achiev-card.unlocked { border-color: rgba(168,230,207,0.25); box-shadow: 0 0 12px rgba(168,230,207,0.08); }
  .achiev-card.locked { opacity: 0.3; filter: grayscale(1); }
  .ach-icon { font-size: 1.75rem; }
  .ach-name { font-size: 0.78rem; font-weight: 500; }
  .ach-desc { font-size: 0.67rem; color: var(--muted); line-height: 1.4; }
  @keyframes xpPop { 0%{opacity:0;transform:translateY(4px) scale(0.9)} 15%{opacity:1;transform:translateY(0) scale(1.1)} 80%{opacity:1} 100%{opacity:0;transform:translateY(-24px)} }
  .xp-popup { position:fixed; pointer-events:none; z-index:9999; font-size:1rem; font-weight:700; color:#a8e6cf; text-shadow: 0 0 8px rgba(168,230,207,0.6); animation: xpPop 1.4s ease forwards; }
  .topic-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1rem; }
  .topic-card { border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.25rem; background: rgba(255,255,255,0.03); }
  .topic-card.active-topic { border-color: rgba(168,230,207,0.4); background: rgba(168,230,207,0.05); }
  .topic-name { font-size: 0.9rem; font-weight: 500; margin-bottom: 0.3rem; }
  .topic-desc { font-size: 0.75rem; color: var(--muted); line-height: 1.5; margin-bottom: 0.75rem; }
  .topic-progress { height: 3px; background: rgba(255,255,255,0.08); border-radius: 999px; overflow: hidden; }
  .topic-fill { height: 100%; background: var(--accent); border-radius: 999px; }

  .interview-list { display: flex; flex-direction: column; gap: 1rem; }
  .interview-item { border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; overflow: hidden; }
  .interview-q { padding: 1.25rem 1.5rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 1rem; transition: background 0.2s; }
  .interview-q:hover { background: rgba(255,255,255,0.05); }
  .interview-q-text { font-size: 0.9rem; font-weight: 500; }
  .interview-level { font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.2rem 0.6rem; border-radius: 999px; }
  .level-easy { background: rgba(74,222,128,0.1); color: #4ade80; border: 1px solid rgba(74,222,128,0.2); }
  .level-medium { background: rgba(251,191,36,0.1); color: #fbbf24; border: 1px solid rgba(251,191,36,0.2); }
  .level-hard { background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.2); }
  .interview-body { padding: 0 1.5rem; max-height: 0; overflow: hidden; transition: max-height 0.3s ease, padding 0.3s; }
  .interview-body.open { max-height: 600px; padding: 0 1.5rem 1.5rem; }
  .interview-answer-area { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 0.75rem 1rem; color: var(--fg); font-family: var(--font-body); font-size: 0.85rem; line-height: 1.7; resize: none; outline: none; min-height: 100px; margin-bottom: 0.75rem; }
  .interview-answer-area::placeholder { color: rgba(255,255,255,0.2); }
  .feedback-box { background: rgba(168,230,207,0.06); border: 1px solid rgba(168,230,207,0.2); border-radius: 10px; padding: 1rem 1.25rem; font-size: 0.85rem; line-height: 1.8; color: rgba(255,255,255,0.85); }
  .score-badge { display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(168,230,207,0.15); color: var(--accent); border-radius: 999px; padding: 0.3rem 0.8rem; font-size: 0.8rem; font-weight: 500; margin-bottom: 0.75rem; }

  .api-key-banner { background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.25); border-radius: 10px; padding: 0.75rem 1.25rem; margin-bottom: 1.5rem; font-size: 0.82rem; color: #fbbf24; display: flex; align-items: center; gap: 0.6rem; }
  .api-key-input { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 0.45rem 0.85rem; color: var(--fg); font-family: var(--font-body); font-size: 0.82rem; outline: none; width: 280px; }
  .api-key-input::placeholder { color: rgba(255,255,255,0.25); }

  .loading-dots::after { content: '...'; animation: dots 1.2s steps(3,end) infinite; }
  @keyframes dots { 0%,20%{content:'.'} 40%{content:'..'} 60%,100%{content:'...'} }

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

const RANKS = [
  { name:"Rookie",   icon:"🌱", min:0,     color:"#9ca3af", glow:"rgba(156,163,175,0.35)" },
  { name:"Iron",     icon:"⚙️",  min:300,   color:"#b0bec5", glow:"rgba(176,190,197,0.35)" },
  { name:"Bronze",   icon:"🥉", min:800,   color:"#cd7f32", glow:"rgba(205,127,50,0.45)"  },
  { name:"Silver",   icon:"🥈", min:2000,  color:"#c0c0c0", glow:"rgba(192,192,192,0.45)" },
  { name:"Gold",     icon:"🥇", min:4000,  color:"#fbbf24", glow:"rgba(251,191,36,0.5)"   },
  { name:"Platinum", icon:"💎", min:8000,  color:"#7dd3fc", glow:"rgba(125,211,252,0.5)"  },
  { name:"Diamond",  icon:"💠", min:15000, color:"#a78bfa", glow:"rgba(167,139,250,0.5)"  },
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
  { id:"tasks_5",       icon:"✅", name:"Task Starter",    desc:"Hoàn thành 5 tasks",              color:"#a8e6cf" },
  { id:"tasks_20",      icon:"🎯", name:"Focused",         desc:"Hoàn thành 20 tasks",             color:"#a8e6cf" },
  { id:"interview_1",   icon:"💼", name:"Candidate",       desc:"Hoàn thành 1 buổi phỏng vấn",    color:"#818cf8" },
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
  "Artificial_neural_network", "Backpropagation", "Turing_test", "Perceptron",
  "Convolutional_neural_network", "Recurrent_neural_network", "Generative_adversarial_network",
  "Natural_language_processing", "Computer_vision", "Reinforcement_learning",
  "Bayesian_network", "Support_vector_machine", "Gradient_descent",
  "Overfitting", "Vanishing_gradient_problem", "Word2vec", "BERT_(language_model)",
  "AlphaGo", "GPT-3", "Stable_Diffusion", "ChatGPT", "AI_alignment",
  "Explainable_artificial_intelligence", "Transfer_learning", "Transformer_(machine_learning_model)",
  "Attention_Is_All_You_Need", "Large_language_model", "Prompt_engineering",
];

const AI_KEYWORDS = /\b(ai|artificial intelligence|machine learning|deep learning|neural|llm|gpt|claude|gemini|transformer|openai|anthropic|diffusion|nlp|computer vision|reinforcement|rlhf|fine.?tun|langchain|rag|vector|embedding|chatbot|language model)\b/i;

type Task = { id: number; text: string; xp: number; done: boolean };
type ArticleData = { title: string; tag: string; meta: string; url: string; body: string; glossary: {term:string;def:string}[]; loading: boolean; };

export default function PucPortfolio() {
  const navRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
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
  type VBotMode = "free"|"grammar"|"joke"|"debate";
  const [vMsgs, setVMsgs] = useState<VBotMsg[]>([]);
  const [vInput, setVInput] = useState("");
  const [vLoading, setVLoading] = useState(false);
  const [vMode, setVMode] = useState<VBotMode>("free");
  const [vListening, setVListening] = useState(false);
  const [vSpeaking, setVSpeaking] = useState(false);
  const [vStatus, setVStatus] = useState("Tap the mic to start talking");
  const vEndRef = useRef<HTMLDivElement>(null);
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

  // ── On mount: load from pool or fetch fresh ────────────────────────────
  useEffect(() => {
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
          model: "mistralai/Mistral-7B-Instruct-v0.3",
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
    while (indices.size < 5) indices.add(Math.floor(Math.random() * WIKI_AI_TOPICS.length));
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
      const tags = ["ai","machinelearning","webdev","javascript","typescript","python","programming","devops","cloud","security"];
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
    const subs = ["programming","technology","MachineLearning","artificial","webdev","science","worldnews","todayilearned","interestingasfuck","futurology"];
    const picked = subs.sort(() => Math.random() - 0.5).slice(0, 3);
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
      const [hnStories, devToItems, wikiItems, ghItems, redditItems] = await Promise.all([
        fetchHNStories(), fetchDevTo(), fetchWikiAI(), fetchGithubTrending(), fetchReddit(),
      ]);

      const all: NewsItem[] = [];

      hnStories.forEach(s => all.push({
        type: "hot", tag: "Hacker News",
        title: s.title, desc: s.title,
        meta: "Today · " + s.source, source: s.source, url: s.url,
        keywords: extractKeywords(s.title),
      }));

      devToItems.forEach(d => all.push(d));

      wikiItems.forEach(w => all.push({
        type: "wiki", tag: "Wikipedia",
        title: w.title, desc: w.extract.slice(0, 220),
        meta: "Wikipedia", source: "en.wikipedia.org", url: w.url,
        keywords: extractKeywords(w.title),
      }));

      ghItems.forEach(g => all.push(g));
      redditItems.forEach(r => all.push(r));

      // Shuffle
      for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [all[i], all[j]] = [all[j], all[i]];
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
    joke:    `You are Aria, a hilarious English comedy AI. Your job: be funny! Tell jokes, puns, riddles. Explain wordplay if needed. Gently fix grammar: [FIX: ...]. Keep energy HIGH. Short replies — voice chat.`,
    debate:  `You are Aria, a sharp debate partner. Always argue the OPPOSITE side. Be direct, use rhetorical questions. Fix grammar: [FIX: ...]. Short punchy replies — voice chat.`,
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

  const transcribeWithWhisper = async (audioBlob: Blob): Promise<string> => {
    const key = geminiKeyRef.current;
    if (!key) return "";
    try {
      const res = await fetch(
        "https://router.huggingface.co/v1/audio/transcriptions",
        {
          method: "POST",
          headers: { "Authorization": `Bearer ${key}` },
          body: (() => {
            const fd = new FormData();
            fd.append("file", audioBlob, "audio.webm");
            fd.append("model", "openai/whisper-large-v3-turbo");
            return fd;
          })(),
        }
      );
      const data = await res.json();
      return data.text?.trim() || "";
    } catch { return ""; }
  };

  const startListening = async () => {
    window.speechSynthesis.cancel();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus" : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      vAudioChunksRef.current = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) vAudioChunksRef.current.push(e.data); };
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const audioBlob = new Blob(vAudioChunksRef.current, { type: mimeType });
        setVStatus("Transcribing with Whisper...");
        const text = await transcribeWithWhisper(audioBlob);
        if (text) {
          setVStatus("Processing...");
          handleVoiceInput(text);
        } else {
          setVStatus("Could not hear — try again");
        }
      };
      vMediaRecorderRef.current = recorder;
      recorder.start();
      setVListening(true);
      setVStatus("🔴 Recording... tap again to stop");
    } catch {
      // Fallback to browser SpeechRecognition
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SR) { setVStatus("Microphone access denied"); return; }
      const recog = new SR();
      vRecogRef.current = recog;
      recog.lang = "en-US";
      recog.continuous = false;
      recog.interimResults = false;
      recog.onstart = () => { setVListening(true); setVStatus("Listening..."); };
      recog.onresult = (e: any) => {
        setVListening(false);
        setVStatus("Processing...");
        handleVoiceInput(e.results[0][0].transcript);
      };
      recog.onerror = () => { setVListening(false); setVStatus("Could not hear — try again"); };
      recog.onend = () => setVListening(false);
      recog.start();
    }
  };

  const stopListening = () => {
    if (vMediaRecorderRef.current?.state === "recording") {
      vMediaRecorderRef.current.stop();
    }
    vRecogRef.current?.stop();
    setVListening(false);
    setVStatus("Processing...");
  };

  const handleVoiceInput = async (text: string) => {
    const newMsg: VBotMsg = { role: "user", text };
    setVMsgs(p => [...p, newMsg]);
    setVLoading(true);
    setTimeout(() => vEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

    const history = [...vMsgs, newMsg].slice(-10)
      .map(m => `${m.role === "user" ? "User" : "Aria"}: ${m.text}`).join("\n");
    const raw = await callGemini(`${history}\nAria:`, VBOT_PROMPTS[vMode], 300);

    const corrMatch = raw.match(/\[FIX:\s*(.*?)\]/s);
    const correction = corrMatch?.[1]?.trim();
    const cleanText = raw.replace(/\[FIX:.*?\]/gs, "").trim();

    setVMsgs(p => [...p, { role: "ai", text: cleanText, correction }]);
    setVLoading(false);
    setVStatus("");
    setTimeout(() => vEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
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
          <span className="nav-logo" onClick={() => scrollTo("hero")}>Puc</span>
          <div className="nav-links">
            {[["Home","hero"],["AI News","news"],["Luyện Tiếng Anh","translator"],["Học AI","roadmap"],["Phỏng Vấn","interview"]].map(([l,id]) => (
              <a key={l} className="nav-link" onClick={() => scrollTo(id)}>{l}</a>
            ))}
          </div>
          <button className="nav-cta" onClick={() => scrollTo("translator")}>Practice English</button>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" className="hero">
        <video ref={videoRef} className="hero-video" src="/hero.mp4" autoPlay loop muted playsInline />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-name"><span>Ngọc </span><em>Phúc</em></div>
          <p className="hero-tagline">
            AI architect - AI developer - Experience designer<br />
            I blend human creativity with intelligence to build things that matter.
          </p>
          <button className="hero-cta" onClick={() => scrollTo("news")}>My Creations ↓</button>
        </div>
      </section>

      {/* NEWS */}
      <div className="section-wrap dark" id="news">
        <div className="section">
          <div className="section-label">🗞 AI NEWS HÔM NAY</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"2rem",flexWrap:"wrap",gap:"1rem"}}>
            <div>
              <div className="section-title">Tech & AI News</div>
              <div className="section-sub">Hacker News · Dev.to · Wikipedia — pool lớn, không trùng lặp</div>
            </div>
            <button className="ai-btn" onClick={fetchAndBuildNews} disabled={newsLoading}>
              {newsLoading ? <span className="loading-dots">Đang tải</span> : "🔄 Bài tiếp theo"}
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
      </div>

      {/* VOICE BOT */}
      <div className="section-wrap" id="translator">
        <div className="section">
          <div className="section-label">🎙️ VOICE ENGLISH PRACTICE</div>
          <div className="section-title">Luyện nói tiếng Anh</div>
          <div className="section-sub">Nói chuyện trực tiếp với Aria — AI nghe giọng bạn, trả lời bằng giọng nói, sửa ngữ pháp realtime</div>

          {!geminiKey ? (
            <div className="api-key-banner">
              <span>🔑</span>
              <span>Nhập HuggingFace token (hf_...) — miễn phí tại <a href="https://huggingface.co/settings/tokens/new?ownUserPermissions=inference.serverless.write&tokenType=fineGrained" target="_blank" rel="noreferrer" style={{color:"#a78bfa"}}>huggingface.co/settings/tokens</a></span>
              <input className="api-key-input" placeholder="hf_..." value={keyInput} onChange={e => setKeyInput(e.target.value)} onKeyDown={e => e.key==="Enter" && saveKey()} type="password" />
              <button className="ai-btn" style={{borderRadius:"8px",padding:"0.45rem 1rem"}} onClick={saveKey}>Lưu</button>
            </div>
          ) : (
            <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"1.5rem",fontSize:"0.78rem",color:"var(--muted)"}}>
              <span style={{color:"#4ade80"}}>✓ HuggingFace token đã kết nối</span>
              <button onClick={() => { setGeminiKey(""); geminiKeyRef.current = ""; try { localStorage.removeItem("puc_gemini_key"); } catch {} }} style={{background:"none",border:"none",color:"rgba(255,255,255,0.3)",cursor:"pointer",fontSize:"0.75rem",textDecoration:"underline"}}>Xóa key</button>
            </div>
          )}

          <div className="vbot-wrap">
            {/* Left — orb + controls */}
            <div className="vbot-left">
              <div className="vbot-orb" onClick={vListening ? stopListening : startListening}>
                <div className={`vbot-ring ${vListening?"listening":vSpeaking?"speaking":""}`} />
                <div className={`vbot-ring2 ${vListening?"listening":vSpeaking?"speaking":""}`} />
                <div className="vbot-orb-inner">{vListening?"🎙️":vSpeaking?"🔊":"🤖"}</div>
              </div>
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:"var(--font-name)",fontSize:"1.2rem",marginBottom:"0.25rem"}}>Aria</div>
                <div style={{fontSize:"0.7rem",color:"#4ade80",display:"flex",alignItems:"center",gap:"0.3rem",justifyContent:"center"}}>
                  <span style={{width:6,height:6,borderRadius:"50%",background:"#4ade80",display:"inline-block",flexShrink:0}}/>
                  Free · Web Speech API · 24/7
                </div>
              </div>
              <button
                className={`vbot-mic-btn${vListening?" listening":""}`}
                onClick={vListening ? stopListening : startListening}
                disabled={!geminiKey || vLoading}
              >
                {vListening ? "⏹ Stop" : vSpeaking ? "🔊 Speaking..." : "🎙️ Hold to Talk"}
              </button>
              <div className={`vbot-status-text${vListening||vSpeaking?" active":""}`}>{vStatus}</div>
              <div className="vbot-modes-row">
                {(["free","grammar","joke","debate"] as VBotMode[]).map(m => (
                  <button key={m} className={`vbot-mode-chip${vMode===m?" active":""}`} onClick={() => { setVMode(m); setVMsgs([]); window.speechSynthesis.cancel(); setVStatus("Mode changed — tap mic to start"); }}>
                    {m==="free"?"💬 Free":m==="grammar"?"✏️ Grammar":m==="joke"?"😂 Jokes":"⚡ Debate"}
                  </button>
                ))}
              </div>
            </div>

            {/* Right — transcript */}
            <div className="vbot-right">
              <div className="vbot-transcript">
                {vMsgs.length === 0 && (
                  <div style={{textAlign:"center",padding:"2.5rem 1rem",color:"var(--muted)"}}>
                    <div style={{fontSize:"2rem",marginBottom:"0.75rem"}}>🎙️</div>
                    <div style={{fontSize:"0.88rem",marginBottom:"0.4rem"}}>Tap the mic and start speaking</div>
                    <div style={{fontSize:"0.75rem"}}>Aria will reply out loud — works in Chrome & Safari</div>
                  </div>
                )}
                {vMsgs.map((m, i) => (
                  <div key={i} className={`vbot-turn ${m.role}`}>
                    <div className={`vbot-bubble ${m.role}`}>{m.text}</div>
                    {m.correction && <div className="vbot-correction">✏️ {m.correction}</div>}
                  </div>
                ))}
                {vLoading && (
                  <div className="vbot-turn ai">
                    <div className="vbot-bubble ai"><span className="loading-dots">Aria is thinking</span></div>
                  </div>
                )}
                <div ref={vEndRef} />
              </div>
              {/* Also allow text input */}
              <div className="vbot-input-row">
                <input
                  className="vbot-text-input"
                  placeholder="Or type here if mic doesn't work..."
                  value={vInput}
                  onChange={e => setVInput(e.target.value)}
                  onKeyDown={e => { if(e.key==="Enter" && vInput.trim() && !vLoading) { handleVoiceInput(vInput); setVInput(""); } }}
                  disabled={!geminiKey}
                />
                <button className="vbot-send-btn" onClick={() => { if(vInput.trim()) { handleVoiceInput(vInput); setVInput(""); } }} disabled={!vInput.trim() || vLoading || !geminiKey}>➤</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GAME MODE */}
      <div className="section-wrap green" id="roadmap">
        <div className="section">
          <div className="section-label">🎮 GAME MODE</div>
          <div className="section-title">AI Learning RPG</div>
          <div className="section-sub">Hoàn thành quests, lên rank, mở khoá skill — học AI theo cách của game thủ</div>

          {/* Stats Dashboard */}
          <div className="gm-stats">
            <div className="rank-badge">
              <span className="rank-icon" style={{filter:`drop-shadow(0 0 10px ${currentRank.glow})`}}>{currentRank.icon}</span>
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
                <span style={{fontSize:"0.75rem",color:"var(--muted)"}}>⚡ <span style={{color:"var(--accent)",fontWeight:500}}>{xp}</span> XP tổng</span>
                <span style={{fontSize:"0.75rem",color:"var(--muted)"}}>🏅 Rank <span style={{color:currentRank.color,fontWeight:500}}>{currentRank.name}</span></span>
<span style={{fontSize:"0.75rem",color:"var(--muted)"}}>🏆 <span style={{color:"var(--fg)",fontWeight:500}}>{unlockedAchievements.length}</span>/{ACHIEVEMENTS_DEF.length} badges</span>
              </div>
            </div>
            <div className="gm-right">
              <span className="streak-num">{streak}</span>
              <span className="streak-lbl">🔥 streak</span>
            </div>
          </div>

          {/* Tab nav */}
          <div className="gm-tabs">
            {(["tasks","achievements"] as const).map(tab => (
              <button key={tab} className={`gm-tab${gameTab===tab?" active":""}`} onClick={() => setGameTab(tab)}>
                {tab==="tasks"?"✅ Tasks":"🏅 Achievements"}
              </button>
            ))}
          </div>

          {/* Custom Tasks */}
          {(gameTab === "tasks" || gameTab === "quests" || gameTab === "skills") && (
            <div className="today-box">
              <div className="today-header">
                <div className="today-title">📅 Custom Tasks — {doneTasks}/{tasks.length} hoàn thành</div>
              </div>
              <div className="task-list">
                {tasks.map(t => (
                  <div key={t.id} className={`task-item${t.done?" done":""}`}>
                    <div className={`task-check${t.done?" checked":""}`} onClick={() => toggleTask(t.id)}>
                      {t.done && <span style={{fontSize:"0.7rem",color:"#000"}}>✓</span>}
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
                      <span className="ach-icon" style={unlocked?{filter:`drop-shadow(0 0 6px ${a.color})`}:{}}>{a.icon}</span>
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
          <div className="section-sub">Câu hỏi thực từ Google, Meta, OpenAI, Nvidia… — nhấn câu tiếp theo để đổi bài</div>
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
                      <span style={{fontSize:"0.65rem",padding:"0.15rem 0.55rem",borderRadius:"999px",background:"rgba(99,102,241,0.2)",color:"#818cf8",fontWeight:600,letterSpacing:"0.05em"}}>{item.company}</span>
                      <span className={`interview-level level-${item.difficulty.toLowerCase()}`}>{item.difficulty}</span>
                    </div>
                    <span className="interview-q-text">{i+1}. {item.title}</span>
                    {item.topics && <div style={{fontSize:"0.7rem",color:"var(--muted)",marginTop:"0.25rem",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.topics}</div>}
                  </div>
                  <span style={{color:"var(--muted)",fontSize:"0.8rem",flexShrink:0,marginLeft:"0.75rem"}}>{openQ===i?"▲":"▼"}</span>
                </div>
                <div className={`interview-body${openQ===i?" open":""}`}>
                  <div style={{display:"flex",gap:"1rem",alignItems:"center",flexWrap:"wrap"}}>
                    <a href={item.link} target="_blank" rel="noreferrer" style={{fontSize:"0.82rem",color:"#818cf8",display:"inline-flex",alignItems:"center",gap:"0.3rem"}}>↗ Mở trên LeetCode</a>
                    <button className="ai-btn" style={{background:"rgba(99,102,241,0.12)",border:"1px solid rgba(99,102,241,0.3)",fontSize:"0.75rem",padding:"0.35rem 0.9rem"}} onClick={() => nextQuestion(i)}>
                      🔄 Câu tiếp theo
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
    </div>
  );
}