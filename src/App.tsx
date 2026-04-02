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

  .translator-box { border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; background: rgba(255,255,255,0.03); overflow: hidden; }
  .translator-top { display: grid; grid-template-columns: 1fr 1fr; }
  .trans-panel { padding: 1.5rem; }
  .trans-panel.left { border-right: 1px solid rgba(255,255,255,0.08); }
  .trans-label-sm { font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.75rem; }
  .trans-textarea { width: 100%; background: transparent; border: none; outline: none; color: var(--fg); font-family: var(--font-body); font-size: 0.88rem; line-height: 1.7; resize: none; min-height: 180px; }
  .trans-textarea::placeholder { color: rgba(255,255,255,0.2); }
  .translator-bottom { border-top: 1px solid rgba(255,255,255,0.08); padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; }
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

const ROADMAP = [
  { level: "Deep Learning", icon: "🧠", current: true, topics: [
    { name: "Neural Networks cơ bản", desc: "Perceptron, activation functions, backpropagation", progress: 60 },
    { name: "CNNs", desc: "Convolutional Neural Networks cho xử lý ảnh", progress: 35 },
    { name: "RNNs & LSTMs", desc: "Sequence modeling, time series, NLP cơ bản", progress: 20 },
  ]},
  { level: "Computer Vision", icon: "👁", current: false, topics: [
    { name: "Image Classification", desc: "ResNet, EfficientNet, Vision Transformers", progress: 0 },
    { name: "Object Detection", desc: "YOLO, Faster R-CNN, detection pipelines", progress: 0 },
    { name: "Segmentation", desc: "Semantic & instance segmentation, SAM", progress: 0 },
  ]},
  { level: "LLMs", icon: "💬", current: false, topics: [
    { name: "Transformer Architecture", desc: "Attention mechanism, BERT, GPT internals", progress: 0 },
    { name: "Fine-tuning & RLHF", desc: "LoRA, QLoRA, instruction tuning", progress: 0 },
    { name: "RAG Systems", desc: "Retrieval-Augmented Generation, vector stores", progress: 0 },
  ]},
  { level: "GenAI", icon: "✨", current: false, topics: [
    { name: "Diffusion Models", desc: "Stable Diffusion, DALL-E, image generation", progress: 0 },
    { name: "Multimodal AI", desc: "Vision-language models, GPT-4V, Gemini", progress: 0 },
    { name: "AI Agents", desc: "Autonomous agents, tool use, multi-agent systems", progress: 0 },
  ]},
];

const INITIAL_NEWS = [
  {
    type: "hot", tag: "Anthropic", title: "Claude 4 ra mắt với khả năng lập luận vượt trội",
    desc: "Anthropic vừa công bố Claude 4 với context window 1M tokens và cải tiến đột phá về reasoning — mô hình có thể tự kiểm tra lỗi và sửa câu trả lời theo từng bước.",
    meta: "2 giờ trước · Anthropic Blog", source: "anthropic.com", url: "https://anthropic.com/news",
    fullBody: `Anthropic vừa chính thức ra mắt Claude 4, phiên bản mới nhất trong dòng Large Language Model (LLM) của họ, đánh dấu một bước tiến lớn trong lĩnh vực Artificial Intelligence. Điểm nổi bật nhất là context window được mở rộng lên 1 triệu tokens, cho phép mô hình xử lý và phân tích các tài liệu cực dài mà không mất thông tin ngữ cảnh.

Khả năng reasoning (lập luận) của Claude 4 được cải tiến đáng kể nhờ kỹ thuật mới gọi là Extended Thinking. Thay vì trả lời ngay lập tức, mô hình sẽ tự "suy nghĩ" qua nhiều bước, kiểm tra lại logic của mình và tự phát hiện lỗi trước khi đưa ra câu trả lời cuối cùng. Đây là bước tiến quan trọng trong việc giảm thiểu hiện tượng Hallucination — khi AI tự tạo ra thông tin không chính xác.

Về mặt kỹ thuật, Claude 4 sử dụng kiến trúc Transformer cải tiến với cơ chế Attention được tối ưu hóa cho việc xử lý chuỗi dài. Anthropic cũng áp dụng phương pháp Constitutional AI (CAI) — một hệ thống huấn luyện mà mô hình tự đánh giá và điều chỉnh hành vi của mình dựa trên các nguyên tắc an toàn được định sẵn.

Claude 4 có sẵn qua API và ứng dụng Claude.ai. Phiên bản Opus 4 dành cho các tác vụ phức tạp như lập trình, phân tích dữ liệu và nghiên cứu, trong khi Sonnet 4 cân bằng giữa tốc độ và chất lượng cho việc sử dụng hàng ngày. Haiku 4.5 phục vụ các tác vụ cần phản hồi nhanh với chi phí thấp.`,
    glossary: [
      { term: "Large Language Model (LLM)", def: "Mô hình ngôn ngữ lớn — hệ thống AI được huấn luyện trên lượng dữ liệu văn bản khổng lồ để hiểu và sinh ngôn ngữ tự nhiên" },
      { term: "Context Window", def: "Cửa sổ ngữ cảnh — lượng thông tin (đo bằng tokens) mà mô hình có thể xử lý cùng lúc trong một lần hội thoại" },
      { term: "Reasoning", def: "Khả năng lập luận, suy luận logic của AI để giải quyết vấn đề phức tạp" },
      { term: "Hallucination", def: "Hiện tượng AI tự tạo ra thông tin sai nhưng trông có vẻ đúng và thuyết phục" },
      { term: "Constitutional AI (CAI)", def: "Phương pháp huấn luyện AI tự đánh giá và điều chỉnh câu trả lời dựa trên bộ nguyên tắc đạo đức và an toàn" },
      { term: "Transformer", def: "Kiến trúc mạng nơ-ron sử dụng cơ chế Attention, nền tảng của hầu hết LLM hiện đại" },
    ],
  },
  {
    type: "wiki", tag: "Wikipedia · Lịch sử AI & Luật", title: "People v. Collins — Khi Xác Suất Đi Vào Phòng Xử Án",
    desc: "Năm 1968, một vụ án tại California lần đầu dùng lý thuyết xác suất để buộc tội bị cáo. Tòa án Tối cao sau đó bác bỏ vì áp dụng sai thống kê Bayes — bài học kinh điển về giới hạn của toán học trong hệ thống pháp lý.",
    meta: "Wikipedia · Cập nhật 2024", source: "en.wikipedia.org", url: "https://en.wikipedia.org/wiki/People_v._Collins",
    fullBody: `Vụ án People v. Collins (1968) là một trong những vụ án nổi tiếng nhất trong lịch sử luật pháp Mỹ liên quan đến việc sử dụng Probability Theory (lý thuyết xác suất) trong tố tụng hình sự. Vụ án xảy ra tại Los Angeles, California, khi một phụ nữ lớn tuổi bị giật túi xách bởi một cặp đôi có đặc điểm nhận dạng cụ thể.

Công tố viên đã mời một giáo sư toán học ra làm chứng, sử dụng phương pháp Product Rule trong Probability để tính xác suất rằng một cặp đôi ngẫu nhiên có tất cả các đặc điểm trùng khớp với mô tả nhân chứng. Ông ấy gán xác suất cho từng đặc điểm riêng lẻ — ví dụ: xe màu vàng (1/10), đàn ông có râu (1/4), phụ nữ tóc vàng (1/3) — rồi nhân tất cả lại để ra con số 1/12.000.000.

Tuy nhiên, Tòa án Tối cao California đã bác bỏ phán quyết. Lý do chính là công tố viên đã vi phạm nguyên tắc Statistical Independence — giả định rằng các đặc điểm hoàn toàn độc lập với nhau, điều này không đúng trong thực tế. Ngoài ra, việc áp dụng Prosecutor's Fallacy — nhầm lẫn giữa xác suất trùng khớp ngẫu nhiên với xác suất vô tội — đã dẫn đến kết luận sai lệch.

Vụ án này trở thành bài học kinh điển trong cả luật pháp và thống kê. Nó cho thấy rằng ngay cả những công cụ toán học mạnh mẽ như Bayesian Statistics cũng có thể bị lạm dụng nếu không hiểu đúng các giả định cơ bản. Ngày nay, vụ án thường được giảng dạy trong các khóa học về Forensic Statistics và AI Ethics để minh họa tầm quan trọng của việc áp dụng đúng phương pháp thống kê.`,
    glossary: [
      { term: "Probability Theory", def: "Lý thuyết xác suất — nhánh toán học nghiên cứu các hiện tượng ngẫu nhiên và khả năng xảy ra của sự kiện" },
      { term: "Product Rule", def: "Quy tắc nhân xác suất — P(A và B) = P(A) × P(B), chỉ đúng khi A và B độc lập" },
      { term: "Statistical Independence", def: "Tính độc lập thống kê — hai sự kiện không ảnh hưởng đến xác suất xảy ra của nhau" },
      { term: "Prosecutor's Fallacy", def: "Ngụy biện công tố — nhầm lẫn xác suất bằng chứng khi vô tội với xác suất vô tội khi có bằng chứng" },
      { term: "Bayesian Statistics", def: "Thống kê Bayes — phương pháp cập nhật niềm tin dựa trên bằng chứng mới, sử dụng công thức Bayes" },
      { term: "Forensic Statistics", def: "Thống kê pháp y — ứng dụng thống kê vào điều tra và tố tụng hình sự" },
    ],
  },
  {
    type: "paper", tag: "arXiv · Google Brain · 2017", title: "\"Attention Is All You Need\" — Paper Đổi Lịch Sử NLP",
    desc: "Vaswani et al. giới thiệu kiến trúc Transformer năm 2017 — loại bỏ hoàn toàn RNN và CNN, chỉ dùng cơ chế Attention. Nền tảng của GPT, BERT và mọi LLM hiện đại.",
    meta: "Vaswani, Shazeer et al. · Google Brain", source: "arxiv.org", url: "https://arxiv.org/abs/1706.03762",
    fullBody: `Paper "Attention Is All You Need" được công bố bởi nhóm nghiên cứu tại Google Brain vào năm 2017, do Ashish Vaswani cùng các đồng tác giả thực hiện. Bài báo giới thiệu kiến trúc Transformer — một mô hình hoàn toàn mới loại bỏ hoàn toàn Recurrent Neural Networks (RNNs) và Convolutional Neural Networks (CNNs) trong xử lý ngôn ngữ tự nhiên, chỉ dựa vào cơ chế Self-Attention.

Ý tưởng cốt lõi của Transformer là cơ chế Multi-Head Attention, cho phép mô hình "nhìn" vào tất cả các vị trí trong chuỗi đầu vào cùng một lúc thay vì xử lý tuần tự từng bước như RNN. Điều này giải quyết hai vấn đề lớn: thứ nhất, khả năng Parallelization (xử lý song song) giúp tăng tốc huấn luyện đáng kể; thứ hai, mô hình có thể nắm bắt các Long-Range Dependencies (phụ thuộc tầm xa) tốt hơn nhiều so với RNN vốn bị giới hạn bởi Vanishing Gradient Problem.

Kiến trúc Transformer sử dụng cấu trúc Encoder-Decoder. Encoder mã hóa chuỗi đầu vào thành các biểu diễn vector, trong khi Decoder sinh ra chuỗi đầu ra từng token một. Mỗi lớp trong Encoder và Decoder đều chứa Multi-Head Attention, Feed-Forward Neural Networks, Layer Normalization và Residual Connections. Positional Encoding được thêm vào để mô hình biết được vị trí tương đối của các tokens.

Paper này được trích dẫn hơn 100.000 lần và trở thành nền tảng cho hầu hết mọi mô hình ngôn ngữ lớn hiện đại. BERT (Google, 2018) sử dụng phần Encoder, GPT (OpenAI, 2018) sử dụng phần Decoder, và các mô hình sau này như GPT-4, Claude, LLaMA, Gemini đều dựa trên biến thể của kiến trúc Transformer gốc.`,
    glossary: [
      { term: "Self-Attention", def: "Cơ chế cho phép mỗi phần tử trong chuỗi 'chú ý' đến tất cả các phần tử khác để tính toán biểu diễn của mình" },
      { term: "Multi-Head Attention", def: "Chạy nhiều phép Attention song song với các trọng số khác nhau, giúp mô hình nắm bắt các loại quan hệ khác nhau" },
      { term: "Encoder-Decoder", def: "Kiến trúc 2 phần: Encoder mã hóa đầu vào, Decoder sinh đầu ra dựa trên mã hóa đó" },
      { term: "Positional Encoding", def: "Vector được thêm vào embedding để mã hóa thông tin vị trí, vì Attention không có khái niệm thứ tự" },
      { term: "Vanishing Gradient Problem", def: "Vấn đề gradient biến mất khi lan truyền ngược qua nhiều lớp, khiến RNN khó học các phụ thuộc dài" },
      { term: "Residual Connections", def: "Kết nối tắt (skip connections) giúp gradient lan truyền dễ dàng qua các lớp sâu" },
    ],
  },
  {
    type: "social", tag: "Trending · X / Reddit AI", title: "Chain-of-Thought Prompting Đang Viral Trên Cộng Đồng AI",
    desc: "Kỹ thuật yêu cầu AI 'suy nghĩ từng bước một' trước khi trả lời đang lan rộng sau khi nhiều developer chia sẻ kết quả ấn tượng — tỉ lệ đúng tăng 40% với bài toán toán học phức tạp.",
    meta: "Trending hôm nay · AI Community", source: "x.com", url: "https://x.com/search?q=chain+of+thought+prompting",
    fullBody: `Chain-of-Thought (CoT) Prompting là một kỹ thuật Prompt Engineering đang gây sốt trên các nền tảng mạng xã hội như X (Twitter) và Reddit, đặc biệt trong cộng đồng AI/ML. Ý tưởng đơn giản nhưng hiệu quả: thay vì yêu cầu AI trả lời trực tiếp, ta yêu cầu mô hình "suy nghĩ từng bước một" (think step by step) trước khi đưa ra câu trả lời cuối cùng.

Kỹ thuật này được giới thiệu chính thức trong paper "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models" bởi Jason Wei et al. tại Google Brain năm 2022. Nghiên cứu cho thấy rằng chỉ cần thêm các ví dụ có bước giải trung gian vào prompt (Few-Shot CoT), độ chính xác của mô hình trên các bài toán số học tăng từ 17.9% lên 58.1% trên benchmark GSM8K. Đặc biệt, phiên bản Zero-Shot CoT — chỉ cần thêm câu "Let's think step by step" — cũng mang lại cải thiện đáng kể.

Trên Reddit r/MachineLearning và X, nhiều developer chia sẻ các biến thể sáng tạo của CoT. Tree-of-Thoughts (ToT) mở rộng CoT bằng cách cho mô hình khám phá nhiều nhánh suy luận song song. Self-Consistency lấy mẫu nhiều chuỗi suy luận rồi chọn câu trả lời phổ biến nhất (Majority Voting). ReAct kết hợp reasoning với action, cho phép mô hình tương tác với môi trường bên ngoài.

Lý do CoT hiệu quả vẫn đang được nghiên cứu. Giả thuyết phổ biến nhất là kỹ thuật này kích hoạt các Emergent Abilities — khả năng chỉ xuất hiện ở các mô hình đủ lớn (thường trên 100 tỷ Parameters). Khi mô hình "viết ra" các bước trung gian, nó thực chất đang sử dụng các tokens đầu ra như một dạng Working Memory tạm thời, mở rộng khả năng tính toán vượt ra ngoài giới hạn của một lần Forward Pass.`,
    glossary: [
      { term: "Prompt Engineering", def: "Kỹ thuật thiết kế câu lệnh (prompt) để khai thác tối đa khả năng của mô hình AI" },
      { term: "Few-Shot / Zero-Shot", def: "Few-Shot: cho vài ví dụ mẫu. Zero-Shot: không cho ví dụ, chỉ mô tả yêu cầu" },
      { term: "Tree-of-Thoughts (ToT)", def: "Mở rộng của CoT — mô hình khám phá nhiều nhánh suy luận thay vì chỉ một chuỗi tuyến tính" },
      { term: "Self-Consistency", def: "Lấy mẫu nhiều chuỗi suy luận khác nhau rồi chọn đáp án xuất hiện nhiều nhất" },
      { term: "Emergent Abilities", def: "Khả năng mới 'nổi lên' khi mô hình đạt đủ quy mô lớn, không xuất hiện ở mô hình nhỏ" },
      { term: "Forward Pass", def: "Một lần truyền dữ liệu qua toàn bộ mạng nơ-ron từ đầu vào đến đầu ra" },
    ],
  },
  {
    type: "hot", tag: "OpenAI", title: "GPT-5 Vượt Ngưỡng 90% Trên Mọi Benchmark Toán Học",
    desc: "OpenAI công bố GPT-5 đạt 92% độ chính xác trên AMC và AIME — lần đầu tiên một AI vượt qua mức trung bình của thí sinh dự thi toán quốc tế.",
    meta: "4 giờ trước · OpenAI News", source: "openai.com", url: "https://openai.com/blog",
    fullBody: `OpenAI vừa công bố kết quả benchmark ấn tượng của GPT-5 trên các bài kiểm tra toán học nâng cao. Mô hình đạt 92% độ chính xác trên AMC (American Mathematics Competition) và AIME (American Invitational Mathematics Examination) — đây là lần đầu tiên một hệ thống AI vượt qua mức trung bình của các thí sinh dự thi toán quốc tế.

Điều đặc biệt là GPT-5 không chỉ giải được các bài toán đơn giản mà còn xử lý tốt các bài yêu cầu Multi-Step Reasoning — suy luận qua nhiều bước liên tiếp. Trên benchmark MATH (bộ 12.500 bài toán từ cấp phổ thông đến đại học), mô hình đạt 89.3%, tăng vọt so với GPT-4 chỉ đạt 52.9%. Trên GSM8K — bộ bài toán cấp tiểu học và trung học — GPT-5 đạt gần như hoàn hảo với 97.8%.

OpenAI cho biết cải tiến đến từ ba yếu tố chính. Thứ nhất là Scale — mô hình được huấn luyện với lượng dữ liệu và tài nguyên tính toán lớn hơn đáng kể. Thứ hai là Process Reward Models (PRM) — hệ thống đánh giá không chỉ đáp án cuối cùng mà còn từng bước giải, giúp mô hình học cách reasoning tốt hơn. Thứ ba là Synthetic Data — dữ liệu toán học được tạo và kiểm chứng tự động bởi các hệ thống Formal Verification.

Tuy nhiên, giới chuyên gia cũng lưu ý rằng benchmark scores không phải tất cả. Mô hình vẫn gặp khó khăn với các bài toán đòi hỏi Mathematical Intuition — khả năng "cảm nhận" hướng giải quyết mà chưa cần chứng minh chặt chẽ. Câu hỏi lớn vẫn còn: liệu AI có thực sự "hiểu" toán học hay chỉ đang Pattern Matching ở mức độ rất cao?`,
    glossary: [
      { term: "AMC / AIME", def: "Các kỳ thi toán học quốc gia tại Mỹ — AMC là vòng loại, AIME là vòng nâng cao dành cho top thí sinh" },
      { term: "Multi-Step Reasoning", def: "Suy luận qua nhiều bước logic liên tiếp để đến đáp án cuối cùng" },
      { term: "Benchmark", def: "Bộ bài kiểm tra tiêu chuẩn dùng để đo lường và so sánh hiệu suất của các mô hình AI" },
      { term: "Process Reward Models (PRM)", def: "Mô hình thưởng cho từng bước giải, không chỉ đáp án cuối — giúp AI học reasoning tốt hơn" },
      { term: "Formal Verification", def: "Phương pháp dùng toán học chặt chẽ để chứng minh tính đúng đắn của một chương trình hoặc lời giải" },
      { term: "Pattern Matching", def: "Nhận dạng khuôn mẫu — AI nhận ra các mẫu tương tự trong dữ liệu đã học thay vì thực sự 'hiểu'" },
    ],
  },
];

const INTERVIEW_QS = [
  { q: "Giải thích cơ chế Attention trong Transformer là gì và tại sao nó quan trọng?", level: "medium" },
  { q: "Sự khác biệt giữa Supervised, Unsupervised và Reinforcement Learning?", level: "easy" },
  { q: "Backpropagation hoạt động như thế nào? Giải thích bằng lời.", level: "medium" },
  { q: "Overfitting là gì? Các cách phòng tránh?", level: "easy" },
  { q: "Convolutional Neural Network khác gì so với Fully Connected Network?", level: "medium" },
  { q: "Gradient Vanishing problem là gì và cách giải quyết?", level: "hard" },
  { q: "Giải thích cách hoạt động của LSTM so với RNN thông thường.", level: "hard" },
];

type Task = { id: number; text: string; xp: number; done: boolean };
type NewsItem = typeof INITIAL_NEWS[0];
type ArticleData = { title: string; tag: string; meta: string; url: string; body: string; glossary: {term:string;def:string}[]; loading: boolean; };

export default function PucPortfolio() {
  const navRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const artChatEndRef = useRef<HTMLDivElement>(null);
  const newsScrollRef = useRef<HTMLDivElement>(null);

  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [newsLoading, setNewsLoading] = useState(false);
  const [expandedNews, setExpandedNews] = useState<number|null>(null);
  const [newsDetail, setNewsDetail] = useState<{[k:number]:string}>({});

  // Article page
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
  const [preloaded, setPreloaded] = useState<{[k:number]:{body:string;glossary:{term:string;def:string}[]}}>({});

  const [tasks, setTasks] = useState<Task[]>(() => {
    try { return JSON.parse(localStorage.getItem("puc_tasks_v2")||"null") || [
      { id:1, text:"Đọc 1 paper về Deep Learning", xp:30, done:false },
      { id:2, text:"Implement 1 layer CNN từ đầu", xp:50, done:false },
      { id:3, text:"Dịch 1 tài liệu AI bằng chatbot", xp:20, done:false },
      { id:4, text:"Trả lời 1 câu phỏng vấn AI", xp:35, done:false },
    ]; } catch { return []; }
  });
  const [xp, setXp] = useState<number>(() => { try { return parseInt(localStorage.getItem("puc_xp")||"0"); } catch { return 0; } });
  const [streak] = useState(3);
  const [activeLevel, setActiveLevel] = useState(0);
  const [openQ, setOpenQ] = useState<number|null>(null);
  const [answers, setAnswers] = useState<{[k:number]:string}>({});
  const [feedbacks, setFeedbacks] = useState<{[k:number]:string}>({});
  const [feedbackLoading, setFeedbackLoading] = useState<{[k:number]:boolean}>({});

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = globalStyles;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
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

  // Auto-scroll news carousel — pause when a card is expanded or on hover
  useEffect(() => {
    const el = newsScrollRef.current;
    if (!el || expandedNews !== null) return;
    let animId: number;
    let paused = false;
    const pause = () => { paused = true; };
    const resume = () => { paused = false; };
    const step = () => {
      if (!paused) {
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
          el.scrollLeft = 0;
        } else {
          el.scrollLeft += 0.6;
        }
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

  // Lock body scroll when article open
  useEffect(() => {
    document.body.style.overflow = article ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [article]);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });

  // --- DAILY NEWS SYSTEM ---
  const AI_KEYWORDS = /\b(ai|artificial intelligence|machine learning|deep learning|neural|llm|gpt|claude|gemini|transformer|openai|anthropic|diffusion|nlp|computer vision|reinforcement learning|rlhf|fine.?tun|langchain|rag|vector|embedding)\b/i;

  const WIKI_AI_TOPICS = [
    "Artificial_neural_network", "Backpropagation", "Turing_test", "ELIZA", "Perceptron",
    "Convolutional_neural_network", "Recurrent_neural_network", "Generative_adversarial_network",
    "Natural_language_processing", "Computer_vision", "Reinforcement_learning", "Expert_system",
    "Bayesian_network", "Support_vector_machine", "Random_forest", "Gradient_descent",
    "Overfitting", "Vanishing_gradient_problem", "Word2vec", "BERT_(language_model)",
    "ImageNet", "AlphaGo", "GPT-3", "Stable_Diffusion", "DALL-E", "ChatGPT",
    "AI_alignment", "Existential_risk_from_artificial_general_intelligence",
    "Chinese_room", "Moravec%27s_paradox", "Frame_problem", "Symbol_grounding_problem",
    "Explainable_artificial_intelligence", "Federated_learning", "Transfer_learning",
  ];

  const fetchHNStories = async (): Promise<{title:string;url:string;source:string}[]> => {
    try {
      const idsRes = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
      const ids: number[] = await idsRes.json();
      const stories = await Promise.all(
        ids.slice(0, 40).map(id =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())
        )
      );
      return stories
        .filter((s: any) => s?.title && AI_KEYWORDS.test(s.title))
        .slice(0, 2)
        .map((s: any) => ({ title: s.title, url: s.url || `https://news.ycombinator.com/item?id=${s.id}`, source: "news.ycombinator.com" }));
    } catch { return []; }
  };

  const fetchRedditAI = async (): Promise<{title:string;url:string;source:string;score:number}[]> => {
    try {
      const res = await fetch("https://www.reddit.com/r/MachineLearning/hot.json?limit=20");
      const data = await res.json();
      return (data?.data?.children || [])
        .map((c: any) => c.data)
        .filter((p: any) => p && !p.stickied && p.score > 50)
        .slice(0, 2)
        .map((p: any) => ({ title: p.title, url: `https://reddit.com${p.permalink}`, source: "reddit.com/r/MachineLearning", score: p.score }));
    } catch { return []; }
  };

  const fetchWikiAI = async (): Promise<{title:string;extract:string;url:string}|null> => {
    try {
      const topic = WIKI_AI_TOPICS[Math.floor(Math.random() * WIKI_AI_TOPICS.length)];
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${topic}`);
      const data = await res.json();
      return { title: data.title, extract: data.extract || "", url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${topic}` };
    } catch { return null; }
  };

  const generateDailyNews = async () => {
    setNewsLoading(true);
    try {
      const [hn, reddit, wiki] = await Promise.all([fetchHNStories(), fetchRedditAI(), fetchWikiAI()]);

      // Build raw items from fetched data
      const rawItems: { type: string; tag: string; title: string; desc: string; source: string; url: string }[] = [];

      hn.forEach(s => rawItems.push({ type: "hot", tag: "Hacker News", title: s.title, desc: s.title, source: s.source, url: s.url }));
      reddit.forEach(p => rawItems.push({ type: "social", tag: "Reddit · r/MachineLearning", title: p.title, desc: p.title, source: p.source, url: p.url }));
      if (wiki) rawItems.push({ type: "wiki", tag: `Wikipedia · ${wiki.title}`, title: wiki.title, desc: wiki.extract.slice(0, 200), source: "en.wikipedia.org", url: wiki.url });

      // If we got less than 3 items, keep some from INITIAL_NEWS as filler
      while (rawItems.length < 5 && rawItems.length < INITIAL_NEWS.length) {
        rawItems.push(INITIAL_NEWS[rawItems.length]);
      }

      // Now translate + generate full articles via Claude (parallel, Haiku for speed)
      const translated = await Promise.all(rawItems.slice(0, 5).map(async (item) => {
        if ((item as any).fullBody) return item as NewsItem; // Already has full content (from INITIAL_NEWS fallback)
        try {
          const raw = await callClaude(
            `Dịch và viết bài tiếng Việt chi tiết về chủ đề AI sau (4-5 đoạn, giữ nguyên thuật ngữ tiếng Anh):
Tiêu đề gốc: "${item.title}"
Mô tả: "${item.desc}"
Nguồn: ${item.source}
Format JSON: {"title":"Tiêu đề tiếng Việt hấp dẫn","desc":"2-3 câu mô tả tiếng Việt","fullBody":"nội dung bài đọc đầy đủ tiếng Việt với đoạn cách nhau bằng \\n\\n","glossary":[{"term":"Thuật ngữ EN","def":"Giải thích TV"}]}
Chỉ JSON.`,
            "Biên tập viên tech Việt Nam. Chỉ trả JSON thuần túy.",
            true
          );
          const parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
          return {
            ...item,
            title: parsed.title || item.title,
            desc: parsed.desc || item.desc,
            meta: new Date().toLocaleDateString("vi-VN") + " · " + item.source,
            fullBody: parsed.fullBody || item.desc,
            glossary: parsed.glossary || [],
          } as NewsItem;
        } catch {
          return { ...item, meta: new Date().toLocaleDateString("vi-VN") + " · " + item.source, fullBody: item.desc, glossary: [] } as NewsItem;
        }
      }));

      setNews(translated);
      setPreloaded({});

      // Cache to localStorage
      localStorage.setItem("puc_news_date", new Date().toDateString());
      localStorage.setItem("puc_news_data", JSON.stringify(translated));
    } catch {
      // Keep INITIAL_NEWS on failure
    }
    setNewsLoading(false);
  };

  // On mount: check cache or fetch new daily news + set midnight timer
  useEffect(() => {
    const cachedDate = localStorage.getItem("puc_news_date");
    const today = new Date().toDateString();

    if (cachedDate === today) {
      try {
        const cached = JSON.parse(localStorage.getItem("puc_news_data") || "null");
        if (cached?.length) { setNews(cached); return; }
      } catch {}
    }
    // Fetch new news (only if API key is configured)
    if (ANTHROPIC_KEY) generateDailyNews();
  }, []);

  // Midnight auto-refresh timer
  useEffect(() => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setDate(midnight.getDate() + 1);
    midnight.setHours(0, 0, 0, 0);
    const msUntilMidnight = midnight.getTime() - now.getTime();

    const timer = setTimeout(() => {
      if (ANTHROPIC_KEY) generateDailyNews();
    }, msUntilMidnight);

    return () => clearTimeout(timer);
  }, []);

  // Pre-generate all articles in background when news loads
  const preloadArticles = (items: NewsItem[]) => {
    setPreloaded({});
    items.forEach((n, i) => {
      callClaude(
        `Viết bài đọc chi tiết về chủ đề sau bằng tiếng Việt (4-6 đoạn, mỗi đoạn 3-4 câu).
Chủ đề: "${n.title}. ${n.desc}"
Yêu cầu:
- Giữ nguyên tất cả thuật ngữ tiếng Anh (như Neural Network, Fine-tuning, Benchmark, v.v.)
- KHÔNG phân tích, KHÔNG nhận xét cá nhân — chỉ trình bày thông tin
- Cuối bài thêm phần GLOSSARY liệt kê các thuật ngữ tiếng Anh với giải thích tiếng Việt
Format JSON: {"body":"nội dung bài đọc với các đoạn cách nhau bằng \\n\\n","glossary":[{"term":"Tên thuật ngữ","def":"Giải thích tiếng Việt"}]}
Chỉ JSON.`,
        "Bạn là biên tập viên tech. Chỉ trả JSON thuần túy.",
        true
      ).then(raw => {
        try {
          const parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
          setPreloaded(prev => ({ ...prev, [i]: { body: parsed.body||"", glossary: parsed.glossary||[] } }));
        } catch {
          setPreloaded(prev => ({ ...prev, [i]: { body: raw, glossary: [] } }));
        }
      });
    });
  };

  // Note: preloadArticles is called by generateDailyNews and refreshNews

  const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_KEY || "";

  const callClaude = async (prompt: string, system = "", fast = false) => {
    if (!ANTHROPIC_KEY) return "API key chưa được cấu hình.";
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: fast ? "claude-haiku-4-5-20251001" : "claude-sonnet-4-20250514",
        max_tokens: fast ? 800 : 1500,
        system: system || "Bạn là trợ lý AI chuyên về công nghệ. Trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu.",
        messages: [{ role:"user", content:prompt }],
      }),
    });
    const data = await res.json();
    return data.content?.[0]?.text || "Không có phản hồi.";
  };

  const fetchNewsDetail = async (idx: number) => {
    if (expandedNews === idx) { setExpandedNews(null); return; }
    setExpandedNews(idx);
    if (newsDetail[idx]) return;
    setNewsDetail(p => ({ ...p, [idx]:"loading" }));
    const text = await callClaude(
      `Phân tích ngắn 3-4 câu về tin AI này, tập trung ý nghĩa thực tế: "${news[idx].title}. ${news[idx].desc}"`,
      "Chuyên gia AI. Phân tích súc tích bằng tiếng Việt.",
      true
    );
    setNewsDetail(p => ({ ...p, [idx]:text }));
  };

  const openArticle = (idx: number) => {
    const n = news[idx];
    setArtChatMsgs([]);
    setArtChatInput("");
    setExpandedNews(null);
    const pre = preloaded[idx];
    setArticle({
      title: n.title, tag: n.tag, meta: n.meta, url: n.url,
      body: pre?.body || n.fullBody || n.desc,
      glossary: pre?.glossary || n.glossary || [],
      loading: false,
    });
  };

  const refreshNews = async () => {
    setNewsLoading(true);
    const text = await callClaude(
      `Tạo 5 bài tin đa dạng về AI bao gồm: 2 tin tức hot mới nhất, 1 bài Wikipedia về khái niệm/sự kiện AI thú vị, 1 tóm tắt paper khoa học AI nổi tiếng, 1 xu hướng mạng xã hội AI. Mỗi bài viết bằng tiếng Việt, desc 2-3 câu sinh động.
JSON: [{"type":"hot|wiki|paper|social","tag":"Nguồn/Chủ đề","title":"Tiêu đề TV","desc":"2-3 câu TV sinh động","meta":"X giờ trước · Nguồn","source":"domain.com","url":"https://..."}]. Chỉ JSON thuần túy.`,
      "Chỉ JSON thuần túy, không markdown.",
      true
    );
    try {
      const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
      setNews(parsed);
      setNewsDetail({});
      setExpandedNews(null);
      preloadArticles(parsed);
    } catch {}
    setNewsLoading(false);
  };

  const sendArtChat = async () => {
    if (!artChatInput.trim() || !article) return;
    const msg = artChatInput; setArtChatInput("");
    setArtChatMsgs(p => [...p, { role:"user", text:msg }]);
    setArtChatLoading(true);
    const ctx = article.body
      ? `Tiêu đề bài: ${article.title}\nNội dung tóm tắt: ${article.body.slice(0,1200)}\n\n`
      : `Bài đang xem: ${article.title}\n\n`;
    const text = await callClaude(
      `${ctx}Câu hỏi của người đọc: ${msg}`,
      "Bạn là chuyên gia AI đang hỗ trợ người đọc hiểu bài viết. Trả lời bằng tiếng Việt, ngắn gọn và rõ ràng. Giữ nguyên thuật ngữ tiếng Anh kỹ thuật."
    );
    setArtChatMsgs(p => [...p, { role:"ai", text }]);
    setArtChatLoading(false);
  };

  const translateDoc = async () => {
    if (!inputText.trim()) return;
    setTransLoading(true); setTranslatedText("");
    const text = await callClaude(`Dịch sang tiếng Việt, giữ thuật ngữ kỹ thuật và chú thích trong ngoặc:\n\n${inputText}`, "Dịch giả AI/Tech chuyên nghiệp.");
    setTranslatedText(text); setTransLoading(false);
  };

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput; setChatInput("");
    setChatMsgs(p => [...p, { role:"user", text:msg }]);
    setChatLoading(true);
    const ctx = translatedText ? `Tài liệu đã dịch:\n${translatedText}\n\n` : "";
    const text = await callClaude(`${ctx}Câu hỏi: ${msg}`, "Chuyên gia AI giải thích tài liệu bằng tiếng Việt.");
    setChatMsgs(p => [...p, { role:"ai", text }]); setChatLoading(false);
  };

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const nd = !t.done;
      setXp(x => nd ? x + t.xp : Math.max(0, x - t.xp));
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

  const submitAnswer = async (idx: number) => {
    const ans = answers[idx];
    if (!ans?.trim()) return;
    setFeedbackLoading(p => ({ ...p, [idx]:true }));
    const text = await callClaude(
      `Interviewer AI/ML senior. Đánh giá:\nCâu hỏi: ${INTERVIEW_QS[idx].q}\nTrả lời: ${ans}\n\n1. Cho điểm 1-10\n2. Điểm mạnh\n3. Cần cải thiện\n4. Gợi ý tốt hơn\nBắt đầu bằng "Điểm: X/10"`,
      "Interviewer AI/ML senior. Đánh giá khách quan bằng tiếng Việt."
    );
    setFeedbacks(p => ({ ...p, [idx]:text }));
    setFeedbackLoading(p => ({ ...p, [idx]:false }));
  };

  const xpPct = Math.min((xp / 500) * 100, 100);
  const doneTasks = tasks.filter(t => t.done).length;

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
            {/* LEFT — Article content */}
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
                      <span className="loading-dots">Claude đang dịch & biên tập bài viết</span>
                    </div>
                  : <>
                      <div className="article-body">
                        {article.body.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
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

            {/* RIGHT — AI Chat panel */}
            <div className="article-split-right">
              <div className="art-chat-header">
                💬 Thảo luận với AI về bài viết này
              </div>
              <div className="art-chat-msgs">
                {artChatMsgs.length === 0 && (
                  <div style={{fontSize:"0.8rem",color:"var(--muted)",textAlign:"center",padding:"1.5rem 1rem",lineHeight:1.7}}>
                    {article.loading
                      ? "Đợi bài tải xong để bắt đầu thảo luận..."
                      : "Hỏi bất kỳ điều gì về bài viết — thuật ngữ, khái niệm, ứng dụng thực tế..."}
                  </div>
                )}
                {artChatMsgs.map((m,i) => (
                  <div key={i} className={`art-chat-msg ${m.role}`}>{m.text}</div>
                ))}
                {artChatLoading && (
                  <div className="art-chat-msg ai"><span className="loading-dots">AI đang trả lời</span></div>
                )}
                <div ref={artChatEndRef} />
              </div>
              <div className="art-chat-input-row">
                <input
                  className="art-chat-input"
                  placeholder="Hỏi về bài viết..."
                  value={artChatInput}
                  onChange={e => setArtChatInput(e.target.value)}
                  onKeyDown={e => e.key==="Enter" && !artChatLoading && sendArtChat()}
                  disabled={article.loading}
                />
                <button
                  className="ai-btn"
                  style={{padding:"0.45rem 0.85rem",fontSize:"0.78rem"}}
                  onClick={sendArtChat}
                  disabled={artChatLoading || !artChatInput.trim() || article.loading}
                >
                  Gửi
                </button>
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
            {[["Home","hero"],["AI News","news"],["Dịch Tài Liệu","translator"],["Học AI","roadmap"],["Phỏng Vấn","interview"]].map(([l,id]) => (
              <a key={l} className="nav-link" onClick={() => scrollTo(id)}>{l}</a>
            ))}
          </div>
          <button className="nav-cta" onClick={() => scrollTo("translator")}>Analyze Document</button>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" className="hero">
        <video 
          ref={videoRef} 
          className="hero-video" 
          src="/hero.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
        />
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
              <div className="section-title">Tin AI mới nhất</div>
              <div className="section-sub">Tin hot · Wikipedia AI · Research Papers · Mạng xã hội — Dịch & phân tích bởi Claude</div>
            </div>
            <button className="ai-btn" onClick={refreshNews} disabled={newsLoading}>
              {newsLoading ? <span className="loading-dots">Đang tải</span> : "↻ Refresh tin mới"}
            </button>
          </div>
          <div className="news-scroll" ref={newsScrollRef}>
            <div className="news-scroll-inner">
              {news.map((n, i) => (
                <div key={i} className="news-card" onClick={() => openArticle(i)}>
                  <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap",marginBottom:"0.75rem"}}>
                    {n.type && (
                      <span className={`news-type-badge news-type-${n.type}`}>
                        {n.type==="wiki"?"📚 Wiki":n.type==="paper"?"🔬 Research":n.type==="hot"?"🔥 Hot":"📱 Social"}
                      </span>
                    )}
                    <span className="news-tag" style={{marginBottom:0}}>{n.tag}</span>
                  </div>
                  <div className="news-title">{n.title}</div>
                  <div className="news-desc">{n.desc}</div>
                  <div className="news-meta">{n.meta}</div>
                  <a href={n.url} target="_blank" rel="noreferrer" className="news-source-link" onClick={e => e.stopPropagation()}>
                    ↗ {n.source}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TRANSLATOR */}
      <div className="section-wrap" id="translator">
        <div className="section">
          <div className="section-label">🤖 AI DOC TRANSLATOR</div>
          <div className="section-title">Dịch tài liệu AI</div>
          <div className="section-sub">Paste tài liệu tiếng Anh → Claude dịch + giải thích thuật ngữ</div>
          <div className="translator-box">
            <div className="translator-top">
              <div className="trans-panel left">
                <div className="trans-label-sm">📄 Tài liệu gốc (tiếng Anh)</div>
                <textarea className="trans-textarea" placeholder="Paste tài liệu AI cần dịch vào đây..." value={inputText} onChange={e => setInputText(e.target.value)} />
              </div>
              <div className="trans-panel">
                <div className="trans-label-sm">🇻🇳 Bản dịch tiếng Việt</div>
                <textarea className="trans-textarea" placeholder="Bản dịch sẽ hiện ở đây..." value={transLoading ? "Claude đang dịch..." : translatedText} readOnly />
              </div>
            </div>
            <div className="translator-bottom">
              <span style={{fontSize:"0.78rem",color:"var(--muted)"}}>Powered by Claude Sonnet</span>
              <button className="ai-btn" onClick={translateDoc} disabled={transLoading || !inputText.trim()}>
                {transLoading ? <span className="loading-dots">Đang dịch</span> : "✨ Translate"}
              </button>
            </div>
            {(chatMsgs.length > 0 || translatedText) && (
              <>
                <div className="chat-area">
                  {chatMsgs.length === 0 && <div style={{fontSize:"0.82rem",color:"var(--muted)",textAlign:"center"}}>Hỏi Claude về nội dung tài liệu vừa dịch...</div>}
                  {chatMsgs.map((m,i) => <div key={i} className={`chat-msg ${m.role}`}>{m.text}</div>)}
                  {chatLoading && <div className="chat-msg ai"><span className="loading-dots">Claude đang trả lời</span></div>}
                  <div ref={chatEndRef} />
                </div>
                <div className="chat-input-row">
                  <input className="chat-input" placeholder="Hỏi thêm về tài liệu..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key==="Enter" && !chatLoading && sendChat()} />
                  <button className="ai-btn" onClick={sendChat} disabled={chatLoading || !chatInput.trim()}>Gửi</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ROADMAP */}
      <div className="section-wrap green" id="roadmap">
        <div className="section">
          <div className="section-label">🎮 HỌC AI — GAME MODE</div>
          <div className="section-title">Lộ trình học AI</div>
          <div className="section-sub">Tự set task, tự cộng XP — hoàn thành để lên level 🏆</div>
          <div className="roadmap-header">
            <div className="xp-bar-wrap">
              <span className="xp-label">⚡ {xp} XP</span>
              <div className="xp-bar"><div className="xp-fill" style={{width:`${xpPct}%`}} /></div>
              <span style={{fontSize:"0.75rem",color:"var(--muted)"}}>Level {Math.floor(xp/100)+1}</span>
            </div>
            <span className="streak">🔥 {streak} ngày streak</span>
          </div>
          <div className="today-box">
            <div className="today-header">
              <div className="today-title">📅 Tasks hôm nay — {doneTasks}/{tasks.length} hoàn thành</div>
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
          <div className="roadmap-tabs">
            {ROADMAP.map((r,i) => (
              <button key={i} className={`tab${activeLevel===i?" active":""}`} onClick={() => setActiveLevel(i)}>
                {r.icon} {r.level}{r.current?" ← đang học":""}
              </button>
            ))}
          </div>
          <div className="topic-grid">
            {ROADMAP[activeLevel].topics.map((t,i) => (
              <div key={i} className={`topic-card${ROADMAP[activeLevel].current?" active-topic":""}`}>
                <div style={{fontSize:"1.5rem",marginBottom:"0.5rem"}}>{["🧠","👁","💬","✨"][activeLevel]}</div>
                <div className="topic-name">{t.name}</div>
                <div className="topic-desc">{t.desc}</div>
                <div className="topic-progress"><div className="topic-fill" style={{width:`${t.progress}%`}} /></div>
                <div style={{fontSize:"0.7rem",color:"var(--muted)",marginTop:"0.4rem"}}>{t.progress}% hoàn thành</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* INTERVIEW */}
      <div className="section-wrap dark" id="interview">
        <div className="section">
          <div className="section-label">💼 PHỎNG VẤN AI</div>
          <div className="section-title">Luyện phỏng vấn</div>
          <div className="section-sub">Trả lời → Claude đóng vai interviewer cho điểm & lời khuyên</div>
          <div className="interview-list">
            {INTERVIEW_QS.map((item,i) => (
              <div key={i} className="interview-item">
                <div className="interview-q" onClick={() => setOpenQ(openQ===i?null:i)}>
                  <span className="interview-q-text">{i+1}. {item.q}</span>
                  <div style={{display:"flex",gap:"0.5rem",alignItems:"center",flexShrink:0}}>
                    <span className={`interview-level level-${item.level}`}>{item.level}</span>
                    <span style={{color:"var(--muted)",fontSize:"0.8rem"}}>{openQ===i?"▲":"▼"}</span>
                  </div>
                </div>
                <div className={`interview-body${openQ===i?" open":""}`}>
                  <div style={{fontSize:"0.78rem",color:"var(--muted)",marginBottom:"0.6rem"}}>✍️ Câu trả lời của bạn:</div>
                  <textarea className="interview-answer-area" placeholder="Nhập câu trả lời của bạn vào đây..." value={answers[i]||""} onChange={e => setAnswers(p => ({...p,[i]:e.target.value}))} />
                  <button className="ai-btn" style={{marginBottom:"1rem"}} onClick={() => submitAnswer(i)} disabled={feedbackLoading[i] || !answers[i]?.trim()}>
                    {feedbackLoading[i] ? <span className="loading-dots">Claude đang chấm điểm</span> : "📝 Nộp bài — Claude chấm điểm"}
                  </button>
                  {feedbacks[i] && (
                    <div className="feedback-box">
                      {feedbacks[i].startsWith("Điểm:") && <div className="score-badge">🏆 {feedbacks[i].split("\n")[0]}</div>}
                      <div style={{whiteSpace:"pre-line"}}>{feedbacks[i]}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center",marginTop:"5rem",color:"var(--muted)",fontSize:"0.75rem",letterSpacing:"0.06em"}}>
            © 2026 Puc — Nguyễn Ngọc Phúc. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}