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

  .news-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.25rem; }
  .news-card { border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 1.5rem; background: rgba(255,255,255,0.03); cursor: pointer; transition: background 0.2s, transform 0.2s; }
  .news-card:hover { background: rgba(255,255,255,0.07); transform: translateY(-3px); }
  .news-card.expanded { background: rgba(255,255,255,0.06); transform: none; border-color: rgba(168,230,207,0.25); }
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
  .article-page { position: fixed; inset: 0; background: #070b14; z-index: 200; overflow-y: auto; animation: slideUp 0.4s ease; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  .article-back { position: sticky; top: 0; background: rgba(7,11,20,0.9); backdrop-filter: blur(12px); padding: 1rem 2rem; display: flex; align-items: center; gap: 1rem; z-index: 10; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .article-back-btn { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: var(--fg); border-radius: 999px; padding: 0.4rem 1rem; font-size: 0.8rem; cursor: pointer; font-family: var(--font-body); transition: background 0.2s; }
  .article-back-btn:hover { background: rgba(255,255,255,0.12); }
  .article-inner { max-width: 760px; margin: 0 auto; padding: 3rem 2rem 6rem; }
  .article-tag { display: inline-block; font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.25rem 0.7rem; border-radius: 999px; background: rgba(168,230,207,0.15); color: var(--accent); border: 1px solid rgba(168,230,207,0.25); margin-bottom: 1.25rem; }
  .article-title { font-family: var(--font-name); font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 400; line-height: 1.2; margin-bottom: 1rem; }
  .article-meta { font-size: 0.75rem; color: var(--muted); margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
  .article-img { width: 100%; height: 320px; border-radius: 16px; background: linear-gradient(135deg, rgba(168,230,207,0.08), rgba(255,255,255,0.04)); display: flex; align-items: center; justify-content: center; margin-bottom: 2.5rem; border: 1px solid rgba(255,255,255,0.06); overflow: hidden; position: relative; }
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
    .news-grid, .topic-grid { grid-template-columns: 1fr; }
    .translator-top { grid-template-columns: 1fr; }
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
  { tag: "Anthropic", title: "Claude 4 ra mắt với khả năng lập luận vượt trội", desc: "Anthropic vừa công bố Claude 4 với context window 1M tokens và cải tiến lớn về reasoning...", meta: "2 giờ trước · Anthropic Blog", source: "anthropic.com", url: "https://anthropic.com/news" },
  { tag: "OpenAI", title: "GPT-5 đạt điểm benchmark mới trong toán học", desc: "OpenAI chia sẻ kết quả GPT-5 vượt qua các bài kiểm tra toán học nâng cao với độ chính xác 92%...", meta: "4 giờ trước · OpenAI News", source: "openai.com", url: "https://openai.com/blog" },
  { tag: "Google", title: "Gemini Ultra 2.0 tích hợp sâu vào Google Workspace", desc: "Google thông báo Gemini Ultra 2.0 sẽ có mặt trong Docs, Sheets và Gmail với tính năng AI mới...", meta: "6 giờ trước · Google AI Blog", source: "ai.google", url: "https://ai.google/discover/news" },
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
type ArticleData = { title: string; tag: string; meta: string; url: string; body: string; glossary: {term:string;def:string}[]; loading: boolean };

export default function PucPortfolio() {
  const navRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

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

  // Lock body scroll when article open
  useEffect(() => {
    document.body.style.overflow = article ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [article]);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });

  const callClaude = async (prompt: string, system = "") => {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514", max_tokens: 1500,
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
      "Chuyên gia AI. Phân tích súc tích bằng tiếng Việt."
    );
    setNewsDetail(p => ({ ...p, [idx]:text }));
  };

  const openArticle = async (idx: number) => {
    const n = news[idx];
    setArticle({ title:n.title, tag:n.tag, meta:n.meta, url:n.url, body:"", glossary:[], loading:true });
    const raw = await callClaude(
      `Viết bài đọc chi tiết về chủ đề sau bằng tiếng Việt (4-6 đoạn, mỗi đoạn 3-4 câu). 
Chủ đề: "${n.title}. ${n.desc}"
Yêu cầu:
- Giữ nguyên tất cả thuật ngữ tiếng Anh (như Neural Network, Fine-tuning, Benchmark, v.v.)
- KHÔNG phân tích, KHÔNG nhận xét cá nhân — chỉ trình bày thông tin
- Cuối bài thêm phần GLOSSARY liệt kê các thuật ngữ tiếng Anh với giải thích tiếng Việt
Format JSON: {"body":"nội dung bài đọc với các đoạn cách nhau bằng \\n\\n","glossary":[{"term":"Tên thuật ngữ","def":"Giải thích tiếng Việt"}]}
Chỉ JSON.`,
      "Bạn là biên tập viên tech. Chỉ trả JSON thuần túy."
    );
    try {
      const parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
      setArticle({ title:n.title, tag:n.tag, meta:n.meta, url:n.url, body:parsed.body||"", glossary:parsed.glossary||[], loading:false });
    } catch {
      setArticle({ title:n.title, tag:n.tag, meta:n.meta, url:n.url, body:raw, glossary:[], loading:false });
    }
  };

  const refreshNews = async () => {
    setNewsLoading(true);
    const text = await callClaude(
      `Tạo 3 tin tức AI mới nhất hôm nay. JSON: [{"tag":"Công ty","title":"Tiêu đề TV","desc":"2 câu TV","meta":"X giờ trước · Nguồn","source":"domain.com","url":"https://..."}]. Chỉ JSON.`,
      "Chỉ JSON thuần túy."
    );
    try { setNews(JSON.parse(text.replace(/```json|```/g,"").trim())); setNewsDetail({}); setExpandedNews(null); } catch {}
    setNewsLoading(false);
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
          <div className="article-inner">
            <span className="article-tag">{article.tag}</span>
            <div className="article-title">{article.title}</div>
            <div className="article-meta">
              <span>{article.meta}</span>
              <a href={article.url} target="_blank" rel="noreferrer" className="article-source-link">↗ Xem bài gốc</a>
            </div>

            {/* Placeholder image */}
            <div className="article-img">
              {article.loading
                ? <span className="article-img-loading"><span className="loading-dots">Đang tạo nội dung</span></span>
                : <div style={{width:"100%",height:"100%",background:`linear-gradient(135deg, hsl(${article.tag.length*30},40%,15%), hsl(${article.tag.length*50},30%,10%))`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"4rem"}}>
                    {article.tag==="Anthropic"?"🤖":article.tag==="OpenAI"?"⚡":article.tag==="Google"?"🔍":"🧠"}
                  </div>
              }
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
          <button className="nav-cta" onClick={() => scrollTo("translator")}>Dịch Ngay</button>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" className="hero">
        <video ref={videoRef} className="hero-video" autoPlay loop muted playsInline poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-name"><span>Ngọc </span><em>Phúc</em></div>
          <p className="hero-tagline">a storyteller, AI builder, and digital creative.<br />i blend human creativity with intelligence to build things that matter.</p>
          <button className="hero-cta" onClick={() => scrollTo("news")}>See What I'm Building ↓</button>
        </div>
      </section>

      {/* NEWS */}
      <div className="section-wrap dark" id="news">
        <div className="section">
          <div className="section-label">🗞 AI NEWS HÔM NAY</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"2.5rem",flexWrap:"wrap",gap:"1rem"}}>
            <div>
              <div className="section-title">Tin AI mới nhất</div>
              <div className="section-sub">Cập nhật & phân tích bởi Claude AI</div>
            </div>
            <button className="ai-btn" onClick={refreshNews} disabled={newsLoading}>
              {newsLoading ? <span className="loading-dots">Đang tải</span> : "Refresh tin mới"}
            </button>
          </div>
          <div className="news-grid">
            {news.map((n, i) => (
              <div key={i} className={`news-card${expandedNews===i?" expanded":""}`} onClick={() => fetchNewsDetail(i)}>
                <span className="news-tag">{n.tag}</span>
                <div className="news-title">{n.title}</div>
                <div className="news-desc">{n.desc}</div>
                <div className="news-meta">{n.meta}</div>
                <a href={n.url} target="_blank" rel="noreferrer" className="news-source-link" onClick={e => e.stopPropagation()}>
                  ↗ {n.source}
                </a>
                {expandedNews === i && (
                  <div className="news-expand" onClick={e => e.stopPropagation()}>
                    <div className="news-analysis">
                      {newsDetail[i] === "loading"
                        ? <span className="loading-dots">Claude đang phân tích</span>
                        : newsDetail[i]}
                    </div>
                    <button className="read-more-btn" onClick={() => openArticle(i)}>
                      📖 Đọc thêm — Bài dịch đầy đủ
                    </button>
                  </div>
                )}
              </div>
            ))}
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
                {transLoading ? <span className="loading-dots">Đang dịch</span> : "✨ Dịch ngay"}
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