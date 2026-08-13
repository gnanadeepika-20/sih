import React, { useState, useEffect, useRef } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip
} from "recharts";
import {
  ChevronRight, Sparkles, Code2, MessageSquare,
  Brain, Trophy, ArrowRight, CheckCircle2, Rocket, BookOpen,
  Droplet, LayoutTemplate, ArrowUp, ArrowDown, ArrowLeft, Timer,
  Star, Zap, Target, TrendingUp, Award, Play, RotateCcw, X, ExternalLink
} from "lucide-react";

const ROLES = [
  { name: "Backend Development", track: "tech", emoji: "⚙️", weights: { logic: 0.4, problem: 0.4, ui: 0.2, comm: 0 }, desc: "Build robust APIs, databases & scalable systems" },
  { name: "Frontend / UI-UX Design", track: "tech", emoji: "🎨", weights: { ui: 0.5, logic: 0.35, problem: 0.15, comm: 0 }, desc: "Craft pixel-perfect interactive interfaces" },
  { name: "Data Analyst", track: "tech", emoji: "📊", weights: { logic: 0.5, problem: 0.3, ui: 0.2, comm: 0 }, desc: "Transform data into business intelligence" },
  { name: "Prompt Engineering / AI", track: "tech", emoji: "🤖", weights: { comm: 0.35, problem: 0.3, ui: 0.35, logic: 0 }, desc: "Design and optimize LLM-powered workflows" },
  { name: "QA & Testing", track: "tech", emoji: "🛡️", weights: { problem: 0.45, logic: 0.35, ui: 0.1, comm: 0.1 }, desc: "Ensure software quality and reliability" },
  { name: "Content Writing", track: "nontech", emoji: "✍️", weights: { comm: 0.5, ui: 0.35, logic: 0.15, problem: 0 }, desc: "Tell compelling stories that drive engagement" },
  { name: "Digital Marketing", track: "nontech", emoji: "📣", weights: { ui: 0.4, comm: 0.35, logic: 0.25, problem: 0 }, desc: "Grow brands and acquire customers at scale" },
  { name: "Business Analyst", track: "nontech", emoji: "💼", weights: { logic: 0.4, comm: 0.35, problem: 0.25, ui: 0 }, desc: "Bridge business needs with technical solutions" },
  { name: "Product Management", track: "nontech", emoji: "🧭", weights: { comm: 0.4, logic: 0.3, problem: 0.3, ui: 0 }, desc: "Define vision and drive product strategy" },
];

const ROADMAPS = {
  "Backend Development": { duration: "3 months", milestones: [
    { month: "Month 1", focus: "Data structures — arrays, linked lists, stacks", resource: "DSA in 30 Days (YouTube)", link: "https://youtube.com" },
    { month: "Month 2", focus: "Algorithms — sorting, searching, DP", resource: "LeetCode 50 medium problems", link: "https://leetcode.com" },
    { month: "Month 3", focus: "System design — APIs, DBs, caching", resource: "System Design Primer (GitHub)", link: "https://github.com" },
  ]},
  "Frontend / UI-UX Design": { duration: "3 months", milestones: [
    { month: "Month 1", focus: "Design fundamentals — hierarchy, spacing, color", resource: "Refactoring UI (book)", link: "https://refactoringui.com" },
    { month: "Month 2", focus: "Figma + interactive prototyping", resource: "Figma Academy (free)", link: "https://figma.com" },
    { month: "Month 3", focus: "Build 2 portfolio case studies", resource: "Dribbble inspiration", link: "https://dribbble.com" },
  ]},
  "Data Analyst": { duration: "3 months", milestones: [
    { month: "Month 1", focus: "Excel + SQL fundamentals", resource: "Mode SQL Tutorial (free)", link: "https://mode.com" },
    { month: "Month 2", focus: "Python for data — pandas, visualization", resource: "Kaggle micro-courses", link: "https://kaggle.com" },
    { month: "Month 3", focus: "Build a real dashboard project", resource: "Tableau Public gallery", link: "https://public.tableau.com" },
  ]},
  "Content Writing": { duration: "2 months", milestones: [
    { month: "Month 1", focus: "Writing clarity + structure + SEO basics", resource: "On Writing Well (book)", link: "https://goodreads.com" },
    { month: "Month 2", focus: "Build a writing portfolio (5 pieces)", resource: "Publish on Medium/Substack", link: "https://medium.com" },
  ]},
  "Digital Marketing": { duration: "3 months", milestones: [
    { month: "Month 1", focus: "Marketing + SEO + content strategy", resource: "HubSpot Academy (free cert)", link: "https://academy.hubspot.com" },
    { month: "Month 2", focus: "Google Ads + Analytics 4", resource: "Google Digital Garage", link: "https://learndigital.withgoogle.com" },
    { month: "Month 3", focus: "Run a mock ad campaign", resource: "Meta Blueprint (free)", link: "https://www.facebook.com/business/learn" },
  ]},
  "Business Analyst": { duration: "3 months", milestones: [
    { month: "Month 1", focus: "Business fundamentals + Excel modeling", resource: "Coursera Business Analysis", link: "https://coursera.org" },
    { month: "Month 2", focus: "SQL + data storytelling", resource: "Mode SQL Tutorial", link: "https://mode.com" },
    { month: "Month 3", focus: "Case study + BRD practice", resource: "PM/BA case interview guides", link: "https://google.com" },
  ]},
};

// ─── HERO / LANDING SCREEN ───────────────────────────────────────────────────
function HeroScreen({ onStart }) {
  const features = [
    { icon: "🎮", title: "Real Game Mechanics", desc: "Not quizzes — actual interactive games that reveal your true aptitude." },
    { icon: "🎯", title: "12 Career Paths", desc: "Technical & non-technical roles mapped to your exact cognitive profile." },
    { icon: "🗺️", title: "Personalized Roadmap", desc: "Month-by-month action plan with curated free resources to get job-ready." },
  ];
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #0D0F2E 0%, #12143A 50%, #1a0b2e 100%)" }}>
      {/* Animated BG Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full opacity-10 animate-pulse" style={{ background: "radial-gradient(circle, #FFB238, transparent)" }} />
        <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full opacity-10 animate-pulse" style={{ background: "radial-gradient(circle, #34D1BF, transparent)", animationDelay: "1s" }} />
        <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full opacity-5 animate-pulse" style={{ background: "radial-gradient(circle, #FF7A6B, transparent)", animationDelay: "2s" }} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 px-8 py-5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FFB238, #FF7A6B)" }}>
            <Rocket size={18} color="#12143A" />
          </div>
          <span className="text-xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>SkillQuest</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-mono font-semibold" style={{ background: "rgba(255,178,56,0.15)", color: "#FFB238", border: "1px solid rgba(255,178,56,0.3)" }}>SIH 2026</span>
        </div>
        <button
          onClick={onStart}
          className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
          style={{ background: "#FFB238", color: "#12143A", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Start Free →
        </button>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-semibold" style={{ background: "rgba(52,209,191,0.15)", color: "#34D1BF", border: "1px solid rgba(52,209,191,0.3)" }}>
          <Sparkles size={12} /> For Indian College Students • Pre-Placement Discovery
        </div>
        <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Find Your Career Fit
          <span className="block" style={{ background: "linear-gradient(90deg, #FFB238, #FF7A6B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Through Play
          </span>
        </h1>
        <p className="text-lg text-white/60 max-w-xl mb-10 leading-relaxed">
          No boring surveys. No fake self-ratings. Play 5 mini-games that reveal your natural cognitive strengths — and get matched to real tech careers.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <button
            onClick={onStart}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl"
            style={{ background: "linear-gradient(135deg, #FFB238, #FF7A6B)", color: "#12143A", boxShadow: "0 0 40px rgba(255,178,56,0.4)", fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <Play size={18} fill="#12143A" />
            Start 15-min Assessment — Free
          </button>
          <div className="text-sm text-white/40 font-mono">⚡ 5 games · 12 career paths · roadmap included</div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full">
          {features.map((f) => (
            <div key={f.title} className="p-5 rounded-2xl text-left transition-all hover:scale-[1.02]" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }}>
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-white mb-1 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{f.title}</h3>
              <p className="text-xs text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ONBOARDING FORM ─────────────────────────────────────────────────────────
function OnboardingScreen({ onComplete }) {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [stream, setStream] = useState("");
  const [college, setCollege] = useState("");

  const streams = ["Computer Science / IT", "Electronics (ECE)", "Mechanical / Civil", "Data Science / AI", "Commerce / Business", "Arts / Humanities", "Other"];

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "linear-gradient(135deg, #0D0F2E 0%, #12143A 50%, #1a0b2e 100%)" }}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-200px] right-[-100px] w-[500px] h-[500px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #FFB238, transparent)" }} />
      </div>
      <div className="relative z-10 w-full max-w-lg">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FFB238, #FF7A6B)" }}>
            <Rocket size={20} color="#12143A" />
          </div>
          <span className="text-xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>SkillQuest</span>
        </div>

        <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Let's get started</h2>
        <p className="text-white/50 text-sm mb-8">Quick setup — takes under 30 seconds.</p>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-mono text-white/40 uppercase tracking-wider block mb-1.5">Your Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-4 py-3.5 rounded-xl text-sm text-white outline-none transition-all focus:ring-2 ring-[#FFB238]/40"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-white/40 uppercase tracking-wider block mb-1.5">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl text-sm text-white outline-none appearance-none cursor-pointer"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: year ? "white" : "rgba(255,255,255,0.3)" }}
              >
                <option value="" disabled style={{ background: "#12143A" }}>Select year</option>
                {["1st Year", "2nd Year", "3rd Year", "4th Year"].map(y => <option key={y} value={y} style={{ background: "#12143A" }}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-mono text-white/40 uppercase tracking-wider block mb-1.5">College</label>
              <input
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. NIT Trichy"
                className="w-full px-4 py-3.5 rounded-xl text-sm text-white outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-mono text-white/40 uppercase tracking-wider block mb-2">Your Stream</label>
            <div className="flex flex-wrap gap-2">
              {streams.map((s) => (
                <button
                  key={s}
                  onClick={() => setStream(s)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                  style={{
                    background: stream === s ? "#FFB238" : "rgba(255,255,255,0.06)",
                    color: stream === s ? "#12143A" : "rgba(255,255,255,0.6)",
                    border: `1px solid ${stream === s ? "#FFB238" : "rgba(255,255,255,0.1)"}`,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => name.trim() && year && stream && onComplete({ name: name.trim(), year, stream, college })}
            disabled={!name.trim() || !year || !stream}
            className="w-full py-4 rounded-xl font-bold text-sm transition-all active:scale-95 mt-2 cursor-pointer disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #FFB238, #FF7A6B)", color: "#12143A", fontFamily: "'Space Grotesk', sans-serif", boxShadow: "0 0 30px rgba(255,178,56,0.3)" }}
          >
            Begin Skill Assessment →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── STEPPER PROGRESS BAR ────────────────────────────────────────────────────
const LEVELS = [
  { id: "game1", label: "Logic", emoji: "🧩" },
  { id: "game2", label: "Circuit", emoji: "⚡" },
  { id: "design-sandbox", label: "Sandbox", emoji: "🏖️" },
  { id: "design-room", label: "Room", emoji: "🏠" },
  { id: "game4", label: "Compose", emoji: "💬" },
  { id: "results", label: "Results", emoji: "🏆" },
];

function ProgressBar({ currentStep }) {
  const idx = LEVELS.findIndex((l) => l.id === currentStep);
  const percent = idx >= 0 ? Math.round((idx / (LEVELS.length - 1)) * 100) : 0;
  return (
    <div className="sticky top-0 z-50 px-6 py-4 border-b" style={{ background: "rgba(13,15,46,0.95)", backdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.07)" }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FFB238, #FF7A6B)" }}>
              <Rocket size={15} color="#12143A" />
            </div>
            <span className="text-white font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>SkillQuest</span>
          </div>
          <div className="flex-1 max-w-sm">
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${percent}%`, background: "linear-gradient(90deg, #FFB238, #34D1BF)" }} />
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {LEVELS.map((lvl, i) => (
              <div key={lvl.id} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all text-xs font-mono ${i === idx ? "text-white" : i < idx ? "text-green-400" : "text-white/30"}`}
                style={{ background: i === idx ? "rgba(255,178,56,0.2)" : "transparent" }}>
                <span>{lvl.emoji}</span>
                <span>{lvl.label}</span>
                {i < idx && <CheckCircle2 size={10} className="text-green-400" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── GAME SHELL ───────────────────────────────────────────────────────────────
function GameShell({ children, step }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #0D0F2E 0%, #12143A 60%, #0f1a2e 100%)" }}>
      <ProgressBar currentStep={step} />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── GAME CARD WRAPPER ────────────────────────────────────────────────────────
function GameCard({ title, subtitle, badge, children, accentColor = "#FFB238" }) {
  return (
    <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}>
      <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h2>
              {badge && <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold" style={{ background: `${accentColor}22`, color: accentColor, border: `1px solid ${accentColor}44` }}>{badge}</span>}
            </div>
            <p className="text-sm text-white/50">{subtitle}</p>
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── D-PAD CONTROLS ──────────────────────────────────────────────────────────
function DPad({ onUp, onDown, onLeft, onRight }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button onClick={onUp} className="w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-90 cursor-pointer" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
        <ArrowUp size={18} color="white" />
      </button>
      <div className="flex gap-1">
        <button onClick={onLeft} className="w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-90 cursor-pointer" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
          <ArrowLeft size={18} color="white" />
        </button>
        <button onClick={onDown} className="w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-90 cursor-pointer" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
          <ArrowDown size={18} color="white" />
        </button>
        <button onClick={onRight} className="w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-90 cursor-pointer" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
          <ArrowRight size={18} color="white" />
        </button>
      </div>
    </div>
  );
}

// ─── PRIMARY BUTTON ───────────────────────────────────────────────────────────
function PrimaryBtn({ children, onClick, disabled, color = "#FFB238" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-40"
      style={{ background: disabled ? "rgba(255,255,255,0.05)" : `linear-gradient(135deg, ${color}, ${color}cc)`, color: disabled ? "rgba(255,255,255,0.3)" : "#12143A", fontFamily: "'Space Grotesk', sans-serif", boxShadow: disabled ? "none" : `0 0 30px ${color}44` }}
    >
      {children} {!disabled && <ArrowRight size={16} />}
    </button>
  );
}

// ─── SOKOBAN GAME ─────────────────────────────────────────────────────────────
function SokobanGame({ name, onComplete }) {
  const SOK_SIZE = 5;
  const sokTarget = { r: 4, c: 2 };
  const sokStart = { r: 0, c: 2 };
  const sokBoxStart = { r: 2, c: 2 };
  const [player, setPlayer] = useState(sokStart);
  const [box, setBox] = useState(sokBoxStart);
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);

  function reset() { setPlayer(sokStart); setBox(sokBoxStart); setMoves(0); setSolved(false); }

  function move(dr, dc) {
    if (solved) return;
    const np = { r: player.r + dr, c: player.c + dc };
    if (np.r < 0 || np.r >= SOK_SIZE || np.c < 0 || np.c >= SOK_SIZE) return;
    const hitsBox = np.r === box.r && np.c === box.c;
    if (hitsBox) {
      const nb = { r: box.r + dr, c: box.c + dc };
      if (nb.r < 0 || nb.r >= SOK_SIZE || nb.c < 0 || nb.c >= SOK_SIZE) return;
      setBox(nb); setPlayer(np); setMoves(m => m + 1);
      if (nb.r === sokTarget.r && nb.c === sokTarget.c) {
        setSolved(true);
        setTimeout(() => {
          const score = moves <= 3 ? 100 : moves <= 5 ? 85 : moves <= 8 ? 70 : 60;
          onComplete(score);
        }, 1000);
      }
    } else { setPlayer(np); setMoves(m => m + 1); }
  }

  useEffect(() => {
    const h = (e) => {
      if (e.key === "ArrowUp") move(-1, 0);
      else if (e.key === "ArrowDown") move(1, 0);
      else if (e.key === "ArrowLeft") move(0, -1);
      else if (e.key === "ArrowRight") move(0, 1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [player, box, moves, solved]);

  return (
    <GameCard title="Crate Runner" subtitle="Push the crate onto the glowing target using the fewest moves possible." badge="Logic · Round 1/2" accentColor="#34D1BF">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
        {/* Grid */}
        <div>
          <div className="flex items-center justify-between mb-3 text-sm">
            <span className="text-white/50 font-mono">Moves: <span className="text-white font-bold">{moves}</span></span>
            {moves >= 6 && !solved && <button onClick={reset} className="text-xs text-[#FF7A6B] flex items-center gap-1 cursor-pointer hover:underline"><RotateCcw size={12} /> Reset</button>}
          </div>
          <div className="grid gap-1.5 p-3 rounded-2xl" style={{ gridTemplateColumns: `repeat(${SOK_SIZE}, 1fr)`, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            {Array.from({ length: SOK_SIZE * SOK_SIZE }).map((_, idx) => {
              const r = Math.floor(idx / SOK_SIZE), c = idx % SOK_SIZE;
              const isPlayer = player.r === r && player.c === c;
              const isBox = box.r === r && box.c === c;
              const isTarget = sokTarget.r === r && sokTarget.c === c;
              return (
                <div key={idx} className="w-12 h-12 rounded-xl flex items-center justify-center text-lg transition-all"
                  style={{ background: isTarget && !isBox ? "rgba(255,178,56,0.15)" : "rgba(255,255,255,0.04)", border: isTarget ? "2px dashed rgba(255,178,56,0.6)" : "1px solid rgba(255,255,255,0.06)" }}>
                  {isPlayer && <div className="w-5 h-5 rounded-full shadow-lg" style={{ background: "#34D1BF", boxShadow: "0 0 12px #34D1BF" }} />}
                  {isBox && (solved ? "✅" : "📦")}
                  {isTarget && !isBox && !isPlayer && <div className="w-3 h-3 rounded-full opacity-60" style={{ background: "#FFB238" }} />}
                </div>
              );
            })}
          </div>
          {solved && <div className="mt-3 text-center text-sm font-semibold" style={{ color: "#34D1BF" }}>🎉 Crate delivered! Moving to 2048...</div>}
        </div>
        {/* Controls */}
        {!solved && <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-white/40 font-mono mb-1">Arrow keys or tap:</p>
          <DPad onUp={() => move(-1,0)} onDown={() => move(1,0)} onLeft={() => move(0,-1)} onRight={() => move(0,1)} />
        </div>}
      </div>
    </GameCard>
  );
}

// ─── 2048 GAME ────────────────────────────────────────────────────────────────
function Merge2048({ onComplete }) {
  const [grid, setGrid] = useState(() => addTile(addTile(emptyGrid())));
  const [timeLeft, setTimeLeft] = useState(35);
  const [maxTile, setMaxTile] = useState(2);
  const [done, setDone] = useState(false);

  function emptyGrid() { return Array(4).fill(null).map(() => Array(4).fill(0)); }
  function addTile(g) {
    const empty = []; g.forEach((row, r) => row.forEach((v, c) => { if (!v) empty.push({ r, c }); }));
    if (!empty.length) return g;
    const { r, c } = empty[Math.floor(Math.random() * empty.length)];
    const ng = g.map(row => [...row]); ng[r][c] = Math.random() < 0.9 ? 2 : 4; return ng;
  }
  function slideLeft(row) {
    const nz = row.filter(v => v); const m = []; let i = 0;
    while (i < nz.length) { if (nz[i] === nz[i+1]) { m.push(nz[i]*2); i+=2; } else { m.push(nz[i]); i++; } }
    while (m.length < 4) m.push(0); return m;
  }
  function rotate(g) {
    const ng = emptyGrid();
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) ng[c][3-r] = g[r][c];
    return ng;
  }
  function move(dir) {
    if (done) return;
    let g = grid.map(r => [...r]);
    const rots = { left: 0, up: 1, right: 2, down: 3 }[dir];
    for (let i = 0; i < rots; i++) g = rotate(g);
    const ng = g.map(slideLeft);
    const moved = ng.some((row, r) => row.some((v, c) => v !== g[r][c]));
    let result = ng;
    for (let i = 0; i < (4 - rots) % 4; i++) result = rotate(result);
    if (moved) { const wt = addTile(result); setGrid(wt); setMaxTile(m => Math.max(m, ...wt.flat())); }
  }

  useEffect(() => {
    if (done) return;
    if (timeLeft <= 0) {
      setDone(true);
      const score = maxTile >= 128 ? 100 : maxTile >= 64 ? 85 : maxTile >= 32 ? 70 : maxTile >= 16 ? 55 : 40;
      setTimeout(() => onComplete(score), 800);
      return;
    }
    const t = setTimeout(() => setTimeLeft(s => s-1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, done]);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "ArrowUp") move("up"); else if (e.key === "ArrowDown") move("down");
      else if (e.key === "ArrowLeft") move("left"); else if (e.key === "ArrowRight") move("right");
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [grid, done]);

  const tileColors = { 0: "transparent", 2: "#FFB23822", 4: "#FFB23844", 8: "#FF7A6B44", 16: "#FF7A6B66", 32: "#34D1BF44", 64: "#34D1BF66", 128: "#34D1BF", 256: "#FFB238", 512: "#FF7A6B", 1024: "#a78bfa" };

  return (
    <GameCard title="Merge Chain" subtitle="Merge matching tiles before the timer runs out. Higher tiles = better score." badge="Logic · Round 2/2" accentColor="#FFB238">
      <div className="flex flex-col sm:flex-row items-center gap-8 justify-center">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm">
              <Timer size={15} color="#FF7A6B" />
              <span style={{ color: timeLeft <= 10 ? "#FF7A6B" : "rgba(255,255,255,0.6)" }} className="font-mono font-bold">{timeLeft}s</span>
            </div>
            <div className="text-sm font-mono text-white/60">Best tile: <span className="font-bold" style={{ color: "#FFB238" }}>{maxTile}</span></div>
          </div>
          <div className="grid grid-cols-4 gap-2 p-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            {grid.flat().map((v, i) => (
              <div key={i} className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm font-mono transition-all"
                style={{ background: tileColors[v] || "#a78bfa", color: v >= 8 ? (v >= 32 ? "#12143A" : "white") : "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {v || ""}
              </div>
            ))}
          </div>
          {done && <div className="mt-3 text-center text-sm font-semibold text-[#34D1BF]">⏱ Time's up! Calculating score...</div>}
        </div>
        {!done && <DPad onUp={() => move("up")} onDown={() => move("down")} onLeft={() => move("left")} onRight={() => move("right")} />}
      </div>
    </GameCard>
  );
}

// ─── CIRCUIT GAME ────────────────────────────────────────────────────────────
function CircuitGame({ onComplete }) {
  const ROWS = 6, COLS = 6;
  const source = { r: 2, c: 0 };
  const bulbs = [{ r: 0, c: 5 }, { r: 3, c: 5 }, { r: 5, c: 1 }];
  function idx(r, c) { return r * COLS + c; }
  const makeGrid = () => {
    const g = Array(ROWS * COLS).fill(null);
    g[idx(source.r, source.c)] = "source";
    bulbs.forEach(b => g[idx(b.r, b.c)] = "bulb");
    return g;
  };
  const [grid, setGrid] = useState(makeGrid);

  function toggle(i) {
    setGrid(g => { if (g[i] === "source" || g[i] === "bulb") return g; const ng = [...g]; ng[i] = ng[i] === "wire" ? null : "wire"; return ng; });
  }

  function getLit(g) {
    const conductive = v => v === "wire" || v === "source" || v === "bulb";
    const visited = new Set([idx(source.r, source.c)]);
    const q = [idx(source.r, source.c)];
    while (q.length) {
      const cur = q.shift(); const r = Math.floor(cur / COLS), c = cur % COLS;
      [[r-1,c],[r+1,c],[r,c-1],[r,c+1]].forEach(([nr,nc]) => {
        if (nr<0||nr>=ROWS||nc<0||nc>=COLS) return;
        const ni = idx(nr,nc);
        if (!visited.has(ni) && conductive(g[ni])) { visited.add(ni); q.push(ni); }
      });
    }
    return bulbs.filter(b => visited.has(idx(b.r, b.c)));
  }

  const lit = getLit(grid);
  const wireCount = grid.filter(v => v === "wire").length;

  return (
    <GameCard title="Circuit Bridge" subtitle="Tap cells to lay wire. Connect the power source ⚡ to as many bulbs 💡 as you can." badge="Problem Solving" accentColor="#FFB238">
      <div className="flex flex-col items-center gap-5">
        <div className="grid gap-1.5 p-3 rounded-2xl" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {grid.map((cell, i) => {
            const isBulb = cell === "bulb";
            const isLit = isBulb && lit.some(b => idx(b.r, b.c) === i);
            const isSource = cell === "source";
            return (
              <button key={i} onClick={() => toggle(i)} className="w-11 h-11 rounded-xl flex items-center justify-center text-base transition-all cursor-pointer"
                style={{ background: isSource ? "rgba(255,178,56,0.3)" : isLit ? "rgba(52,209,191,0.3)" : isBulb ? "rgba(255,255,255,0.06)" : cell === "wire" ? "rgba(255,122,107,0.35)" : "rgba(255,255,255,0.04)", border: isSource ? "1.5px solid #FFB238" : isBulb ? `1.5px dashed ${isLit ? "#34D1BF" : "rgba(255,255,255,0.25)"}` : cell === "wire" ? "1px solid rgba(255,122,107,0.5)" : "1px solid rgba(255,255,255,0.07)" }}>
                {isSource ? "⚡" : isLit ? "💡" : isBulb ? "○" : cell === "wire" ? "·" : ""}
              </button>
            );
          })}
        </div>
        <div className="text-center text-sm" style={{ color: lit.length === bulbs.length ? "#34D1BF" : "rgba(255,255,255,0.5)" }}>
          {lit.length === bulbs.length ? "🎉 All bulbs lit!" : `${lit.length} / ${bulbs.length} bulbs connected`}
        </div>
        <PrimaryBtn onClick={() => { const score = Math.min(100, 30 + lit.length * 20 + Math.min(wireCount, 10)); onComplete(score); }}>
          Done Wiring
        </PrimaryBtn>
      </div>
    </GameCard>
  );
}

// ─── POWDER SANDBOX ───────────────────────────────────────────────────────────
function PowderSandbox({ onComplete }) {
  const ROWS = 16, COLS = 14;
  const [grid, setGrid] = useState(() => Array(ROWS * COLS).fill(0));
  const [mat, setMat] = useState(1);
  const [placed, setPlaced] = useState(0);
  const [used, setUsed] = useState(new Set());
  const [isDrawing, setIsDrawing] = useState(false);

  const materials = [
    { id: 1, label: "🟡 Sand", color: "#FFB238" },
    { id: 2, label: "🔵 Water", color: "#34D1BF" },
    { id: 3, label: "🟠 Wall", color: "#FF7A6B" },
  ];

  function place(i) {
    setGrid(g => { const ng = [...g]; if (ng[i] !== mat) { ng[i] = mat; setPlaced(p=>p+1); setUsed(u => new Set(u).add(mat)); } return ng; });
  }

  useEffect(() => {
    const t = setInterval(() => {
      setGrid(g => {
        const ng = [...g];
        for (let r = ROWS - 2; r >= 0; r--) for (let c = 0; c < COLS; c++) {
          const i = r * COLS + c; const v = ng[i];
          if (v === 1) {
            if (!ng[(r+1)*COLS+c]) { ng[(r+1)*COLS+c]=1; ng[i]=0; }
            else if (c>0&&!ng[(r+1)*COLS+c-1]) { ng[(r+1)*COLS+c-1]=1; ng[i]=0; }
            else if (c<COLS-1&&!ng[(r+1)*COLS+c+1]) { ng[(r+1)*COLS+c+1]=1; ng[i]=0; }
          } else if (v === 2) {
            if (!ng[(r+1)*COLS+c]) { ng[(r+1)*COLS+c]=2; ng[i]=0; }
            else if (c>0&&!ng[(r+1)*COLS+c-1]) { ng[(r+1)*COLS+c-1]=2; ng[i]=0; }
            else if (c<COLS-1&&!ng[(r+1)*COLS+c+1]) { ng[(r+1)*COLS+c+1]=2; ng[i]=0; }
            else if (c>0&&!ng[r*COLS+c-1]) { ng[r*COLS+c-1]=2; ng[i]=0; }
            else if (c<COLS-1&&!ng[r*COLS+c+1]) { ng[r*COLS+c+1]=2; ng[i]=0; }
          }
        }
        return ng;
      });
    }, 80);
    return () => clearInterval(t);
  }, []);

  const matColors = { 1: "#FFB238", 2: "#34D1BF", 3: "#FF7A6B" };

  return (
    <GameCard title="Powder Sandbox" subtitle="Select a material and draw on the canvas. Watch physics happen in real-time!" badge="Creativity · Level 1/2" accentColor="#34D1BF">
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          {materials.map(m => (
            <button key={m.id} onClick={() => setMat(m.id)} className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer"
              style={{ background: mat === m.id ? m.color : "rgba(255,255,255,0.07)", color: mat === m.id ? "#12143A" : "rgba(255,255,255,0.6)", border: `1px solid ${mat === m.id ? m.color : "rgba(255,255,255,0.1)"}`, fontWeight: mat === m.id ? "700" : "400" }}>
              {m.label}
            </button>
          ))}
          <button onClick={() => { setGrid(Array(ROWS*COLS).fill(0)); setPlaced(0); setUsed(new Set()); }} className="px-3 py-1.5 rounded-lg text-xs font-mono text-white/40 transition-all cursor-pointer" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <RotateCcw size={12} />
          </button>
        </div>

        <div className="grid rounded-xl overflow-hidden border" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, borderColor: "rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.3)" }}
          onMouseLeave={() => setIsDrawing(false)}>
          {grid.map((v, i) => (
            <div key={i} className="cursor-crosshair" style={{ width: "18px", height: "18px", background: v ? matColors[v] : "transparent" }}
              onMouseDown={() => { setIsDrawing(true); place(i); }}
              onMouseEnter={() => isDrawing && place(i)}
              onMouseUp={() => setIsDrawing(false)}
              onTouchStart={() => place(i)}
            />
          ))}
        </div>

        <div className="text-xs text-white/40 font-mono text-center">
          {placed > 0 ? `${placed} particles placed · ${used.size}/3 materials used` : "Click and drag to draw particles"}
        </div>

        <PrimaryBtn onClick={() => { const score = Math.min(100, 30 + used.size * 20 + Math.min(placed, 30)); onComplete(score); }} color="#34D1BF">
          Next: Room Builder
        </PrimaryBtn>
      </div>
    </GameCard>
  );
}

// ─── ROOM BUILDER ─────────────────────────────────────────────────────────────
function RoomBuilder({ onComplete }) {
  const ROWS = 6, COLS = 8;
  const blocks = [
    { id: "floor", emoji: "⬛", label: "Floor", color: "#334155" },
    { id: "wall", emoji: "🧱", label: "Wall", color: "#78350f" },
    { id: "window", emoji: "🪟", label: "Window", color: "#0ea5e9" },
    { id: "door", emoji: "🚪", label: "Door", color: "#d97706" },
    { id: "plant", emoji: "🪴", label: "Plant", color: "#16a34a" },
    { id: "light", emoji: "💡", label: "Light", color: "#FFB238" },
  ];
  const [room, setRoom] = useState(() => Array(ROWS * COLS).fill(null));
  const [sel, setSel] = useState("floor");
  const [filled, setFilled] = useState(0);
  const [typesUsed, setTypesUsed] = useState(new Set());

  function place(i) {
    setRoom(r => { const nr = [...r]; if (nr[i] === sel) { nr[i] = null; } else { if (!nr[i]) setFilled(f=>f+1); nr[i] = sel; setTypesUsed(t => new Set(t).add(sel)); } return nr; });
  }

  return (
    <GameCard title="Block Yard" subtitle="Design a room layout! Click tiles to place elements. Use variety for a better score." badge="Creativity · Level 2/2" accentColor="#FF7A6B">
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-wrap gap-1.5 justify-center">
          {blocks.map(b => (
            <button key={b.id} onClick={() => setSel(b.id)} className="px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer font-mono"
              style={{ background: sel === b.id ? b.color : "rgba(255,255,255,0.06)", color: sel === b.id ? "white" : "rgba(255,255,255,0.5)", border: `1px solid ${sel === b.id ? b.color : "rgba(255,255,255,0.08)"}`, fontWeight: sel === b.id ? "700" : "400" }}>
              {b.emoji} {b.label}
            </button>
          ))}
        </div>

        <div className="grid gap-1 p-3 rounded-2xl" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {room.map((blockId, i) => {
            const b = blocks.find(b => b.id === blockId);
            return (
              <button key={i} onClick={() => place(i)} className="w-10 h-10 rounded-lg flex items-center justify-center text-sm transition-all cursor-pointer hover:scale-105"
                style={{ background: b ? `${b.color}55` : "rgba(255,255,255,0.03)", border: b ? `1px solid ${b.color}77` : "1px solid rgba(255,255,255,0.06)" }}>
                {b?.emoji || ""}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-white/40 font-mono text-center">
          {typesUsed.size > 0 ? `${typesUsed.size}/${blocks.length} types used · ${filled} tiles filled` : "Tap any tile to place blocks"}
        </div>

        <PrimaryBtn onClick={() => { const score = Math.min(100, typesUsed.size * 12 + (filled / (ROWS*COLS)) * 40 + 20); onComplete(score); }} color="#FF7A6B">
          Lock in Design Score
        </PrimaryBtn>
      </div>
    </GameCard>
  );
}

// ─── SIGNAL COMPOSER ─────────────────────────────────────────────────────────
function SignalComposer({ name, onComplete }) {
  const signalBlocks = {
    Opener: ["Hey team,", "Quick update:", "Heads up —", "Following up:"],
    Context: ["the launch moved to Friday.", "we found a bug in checkout.", "the client loved the mockups.", "traffic spiked this weekend."],
    Ask: ["Can you take a look?", "Let's sync tomorrow.", "No action needed yet.", "Ping me with questions."],
    Closer: ["Thanks!", "Appreciate it.", "More soon.", "— from SkillQuest"],
  };
  const categories = Object.keys(signalBlocks);
  const [picked, setPicked] = useState([]);

  function toggle(cat, text) {
    setPicked(p => {
      const ex = p.some(x => x.cat === cat && x.text === text);
      return ex ? p.filter(x => !(x.cat === cat && x.text === text)) : [...p, { cat, text }];
    });
  }

  const sentence = picked.map(p => p.text).join(" ");
  const catsUsed = new Set(picked.map(p => p.cat)).size;

  return (
    <GameCard title="Signal Composer" subtitle="Build a clear professional message for your team by selecting building blocks." badge="Communication" accentColor="#34D1BF">
      <div className="space-y-5">
        {/* Message preview */}
        <div className="min-h-[60px] p-4 rounded-xl relative" style={{ background: "rgba(52,209,191,0.06)", border: "1.5px dashed rgba(52,209,191,0.3)" }}>
          {sentence ? (
            <p className="text-sm text-white leading-relaxed">{sentence}</p>
          ) : (
            <p className="text-sm text-white/30 italic">Your message will appear here as you build it...</p>
          )}
        </div>

        {/* Word blocks */}
        {categories.map(cat => (
          <div key={cat}>
            <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-2">{cat}</p>
            <div className="flex flex-wrap gap-1.5">
              {signalBlocks[cat].map(text => {
                const active = picked.some(p => p.cat === cat && p.text === text);
                return (
                  <button key={text} onClick={() => toggle(cat, text)} className="px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer active:scale-95"
                    style={{ background: active ? "rgba(52,209,191,0.25)" : "rgba(255,255,255,0.06)", color: active ? "#34D1BF" : "rgba(255,255,255,0.6)", border: `1px solid ${active ? "rgba(52,209,191,0.5)" : "rgba(255,255,255,0.08)"}`, fontWeight: active ? "600" : "400" }}>
                    {text}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="text-xs text-white/40 font-mono">{catsUsed}/{categories.length} categories used</div>
        <PrimaryBtn onClick={() => { const score = Math.min(100, 25 + catsUsed * 15 + Math.min(picked.length, 6) * 3); onComplete(score); }} color="#34D1BF">
          See My Skill Signature
        </PrimaryBtn>
      </div>
    </GameCard>
  );
}

// ─── RESULTS SCREEN ───────────────────────────────────────────────────────────
function ResultsScreen({ user, scores, onRestart }) {
  const [showRoadmap, setShowRoadmap] = useState(null);

  const recs = ROLES.map(r => {
    const match = (scores.logic||0)*(r.weights.logic||0) + (scores.problem||0)*(r.weights.problem||0) + (scores.ui||0)*(r.weights.ui||0) + (scores.comm||0)*(r.weights.comm||0);
    return { ...r, match: Math.round(match) };
  }).sort((a,b) => b.match - a.match);

  const top3 = recs.slice(0, 3);
  const radarData = [
    { skill: "Logic", value: scores.logic || 0 },
    { skill: "Problem\nSolving", value: scores.problem || 0 },
    { skill: "Design\n& UI", value: scores.ui || 0 },
    { skill: "Comm", value: scores.comm || 0 },
  ];

  const skillLabels = [
    { key: "logic", label: "Logical Thinking", color: "#34D1BF" },
    { key: "problem", label: "Problem Solving", color: "#FFB238" },
    { key: "ui", label: "Design & Creativity", color: "#FF7A6B" },
    { key: "comm", label: "Communication", color: "#a78bfa" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0D0F2E 0%, #12143A 60%, #0f1a2e 100%)" }}>
      {/* Hero Result Banner */}
      <div className="relative overflow-hidden px-6 pt-12 pb-16 text-center border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #FFB238, transparent)" }} />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-mono font-semibold" style={{ background: "rgba(255,178,56,0.15)", color: "#FFB238", border: "1px solid rgba(255,178,56,0.3)" }}>
            <Trophy size={12} /> Assessment Complete
          </div>
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {user?.name?.split(" ")[0]}'s Skill Signature
          </h1>
          <p className="text-white/50 text-sm">Based on how you played — not what you said about yourself</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Scores + Radar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skill Bars */}
          <div className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h3 className="text-white font-bold mb-5 text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>In-Game Scores</h3>
            <div className="space-y-4">
              {skillLabels.map(s => (
                <div key={s.key}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-white/70">{s.label}</span>
                    <span className="font-mono font-bold" style={{ color: s.color }}>{scores[s.key] || 0}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${scores[s.key] || 0}%`, background: s.color, boxShadow: `0 0 8px ${s.color}88` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Radar Chart */}
          <div className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h3 className="text-white font-bold mb-2 text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Skill Radar</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="68%">
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11, fontFamily: "JetBrains Mono" }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar dataKey="value" stroke="#FFB238" fill="#FFB238" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Career Matches */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <h3 className="text-white font-bold text-xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Your Top Career Matches</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono" style={{ background: "rgba(52,209,191,0.15)", color: "#34D1BF", border: "1px solid rgba(52,209,191,0.3)" }}>Tech + Non-Tech</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {top3.map((r, i) => (
              <div key={r.name} className="p-5 rounded-2xl transition-all hover:scale-[1.02] relative overflow-hidden group"
                style={{ background: i === 0 ? "linear-gradient(135deg, rgba(255,178,56,0.12), rgba(255,122,107,0.08))" : "rgba(255,255,255,0.04)", border: i === 0 ? "1px solid rgba(255,178,56,0.35)" : "1px solid rgba(255,255,255,0.08)" }}>
                {i === 0 && <div className="absolute top-3 right-3"><Star size={14} fill="#FFB238" color="#FFB238" /></div>}
                <div className="text-4xl mb-3">{r.emoji}</div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full font-mono font-semibold" style={{ background: r.track === "tech" ? "rgba(52,209,191,0.15)" : "rgba(255,122,107,0.15)", color: r.track === "tech" ? "#34D1BF" : "#FF7A6B" }}>
                    {r.track === "tech" ? "Technical" : "Non-Tech"}
                  </span>
                </div>
                <h4 className="font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{r.name}</h4>
                <p className="text-xs text-white/50 mb-3 leading-relaxed">{r.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black font-mono" style={{ color: i === 0 ? "#FFB238" : "#34D1BF" }}>{Math.min(r.match, 97)}%</span>
                  {ROADMAPS[r.name] && (
                    <button onClick={() => setShowRoadmap(r)} className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all cursor-pointer hover:scale-105"
                      style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      Roadmap <ChevronRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All roles table */}
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="px-5 py-3 border-b text-xs font-mono text-white/40 uppercase tracking-wider" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.06)" }}>
            All 9 Career Paths Ranked
          </div>
          {recs.map((r, i) => (
            <div key={r.name} className="flex items-center gap-4 px-5 py-3 border-b last:border-0 hover:bg-white/[0.03] transition-colors"
              style={{ borderColor: "rgba(255,255,255,0.04)" }}>
              <span className="text-xl w-6">{r.emoji}</span>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">{r.name}</div>
                <span className="text-xs font-mono" style={{ color: r.track === "tech" ? "#34D1BF" : "#FF7A6B" }}>{r.track === "tech" ? "Technical" : "Non-Technical"}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono font-bold" style={{ color: i < 3 ? "#FFB238" : "rgba(255,255,255,0.5)" }}>{Math.min(r.match, 97)}%</div>
                <div className="w-20 h-1.5 rounded-full mt-1 overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.min(r.match, 97)}%`, background: i < 3 ? "#FFB238" : "rgba(255,255,255,0.2)" }} />
                </div>
              </div>
              {ROADMAPS[r.name] && (
                <button onClick={() => setShowRoadmap(r)} className="text-xs text-white/40 hover:text-white/70 transition-colors cursor-pointer flex items-center gap-1">
                  <BookOpen size={13} /> Plan
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Restart button */}
        <div className="text-center pt-4">
          <button onClick={onRestart} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer hover:scale-105"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <RotateCcw size={14} /> Retake Assessment
          </button>
        </div>
      </div>

      {/* Roadmap Modal */}
      {showRoadmap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }} onClick={() => setShowRoadmap(null)}>
          <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl" style={{ background: "#1B1E52", border: "1px solid rgba(255,255,255,0.12)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{showRoadmap.emoji}</span>
                  <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{showRoadmap.name}</h3>
                </div>
                <p className="text-xs text-white/40 font-mono">{ROADMAPS[showRoadmap.name]?.duration} roadmap</p>
              </div>
              <button onClick={() => setShowRoadmap(null)} className="p-2 rounded-xl cursor-pointer transition-all hover:bg-white/10" style={{ color: "rgba(255,255,255,0.4)" }}><X size={18} /></button>
            </div>
            <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
              {(ROADMAPS[showRoadmap.name]?.milestones || []).map((m, i) => (
                <div key={i} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded mb-2 inline-block" style={{ background: "rgba(52,209,191,0.15)", color: "#34D1BF" }}>{m.month}</span>
                  <p className="text-sm text-white font-semibold mb-1">{m.focus}</p>
                  <a href={m.link} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1 transition-colors hover:text-white" style={{ color: "#9497C9" }}>
                    <BookOpen size={11} /> {m.resource} <ExternalLink size={10} />
                  </a>
                </div>
              ))}
            </div>
            <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <button onClick={() => setShowRoadmap(null)} className="w-full py-3 rounded-xl font-bold text-sm cursor-pointer transition-all hover:scale-[1.02]" style={{ background: "#FFB238", color: "#12143A", fontFamily: "'Space Grotesk', sans-serif" }}>
                Got it — let's go! 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("hero"); // hero → onboarding → game1_sokoban → game1_2048 → game2 → sandbox → room → compose → results
  const [user, setUser] = useState(null);
  const [scores, setScores] = useState({ logic: 0, problem: 0, ui: 0, comm: 0 });
  const [sokScore, setSokScore] = useState(80);
  const [sandScore, setSandScore] = useState(0);

  const gameStep = {
    game1_sokoban: "game1",
    game1_2048: "game1",
    game2: "game2",
    sandbox: "design-sandbox",
    room: "design-room",
    compose: "game4",
    results: "results",
  }[screen] || "game1";

  return (
    <>
      {screen === "hero" && <HeroScreen onStart={() => setScreen("onboarding")} />}

      {screen === "onboarding" && (
        <OnboardingScreen onComplete={(u) => { setUser(u); setScreen("game1_sokoban"); }} />
      )}

      {screen === "game1_sokoban" && (
        <GameShell step={gameStep}>
          <SokobanGame name={user?.name} onComplete={(s) => { setSokScore(s); setScreen("game1_2048"); }} />
        </GameShell>
      )}

      {screen === "game1_2048" && (
        <GameShell step={gameStep}>
          <Merge2048 onComplete={(s) => { setScores(p => ({ ...p, logic: Math.round((sokScore + s) / 2) })); setScreen("game2"); }} />
        </GameShell>
      )}

      {screen === "game2" && (
        <GameShell step={gameStep}>
          <CircuitGame onComplete={(s) => { setScores(p => ({ ...p, problem: s })); setScreen("sandbox"); }} />
        </GameShell>
      )}

      {screen === "sandbox" && (
        <GameShell step={gameStep}>
          <PowderSandbox onComplete={(s) => { setSandScore(s); setScreen("room"); }} />
        </GameShell>
      )}

      {screen === "room" && (
        <GameShell step={gameStep}>
          <RoomBuilder onComplete={(s) => { setScores(p => ({ ...p, ui: Math.round((sandScore + s) / 2) })); setScreen("compose"); }} />
        </GameShell>
      )}

      {screen === "compose" && (
        <GameShell step={gameStep}>
          <SignalComposer name={user?.name} onComplete={(s) => { setScores(p => ({ ...p, comm: s })); setScreen("results"); }} />
        </GameShell>
      )}

      {screen === "results" && (
        <ResultsScreen user={user} scores={scores} onRestart={() => { setScreen("hero"); setScores({ logic: 0, problem: 0, ui: 0, comm: 0 }); setUser(null); }} />
      )}
    </>
  );
}
