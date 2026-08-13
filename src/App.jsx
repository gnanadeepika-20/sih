import React, { useState, useEffect, useRef } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from "recharts";
import {
  ChevronRight, Sparkles, Brain, Trophy, ArrowRight, CheckCircle2, Rocket,
  BookOpen, Timer, Star, RotateCcw, X, ExternalLink, ShieldAlert, ArrowLeft, ArrowUp, ArrowDown
} from "lucide-react";
import confetti from "canvas-confetti";
import OnboardingScreen from "./components/Onboarding";
import PetCompanion, { ForestPathTransition } from "./components/PetCompanion";
// ─── CONSTANTS & CONFIGURATIONS ──────────────────────────────────────────────
const LEVELS = [
  {
    id: 1,
    name: "Crate Runner",
    key: "level1",
    subtitle: "Warm Up",
    difficulty: 1,
    desc: "Basic spatial reasoning",
    icon: "🧩",
    skills: ["Basic reasoning", "Spatial thinking"]
  },
  {
    id: 2,
    name: "Think Ahead",
    key: "level2",
    subtitle: "Spatial Planning",
    difficulty: 2,
    desc: "Plan paths around dead ends & move limits",
    icon: "💡",
    skills: ["Path planning", "Obstacle avoidance", "Dead-end detection"]
  },
  {
    id: 3,
    name: "Merge Master",
    key: "level3",
    subtitle: "Pattern Recognition",
    difficulty: 3,
    desc: "Combine matching tiles strategically under pressure",
    icon: "🔢",
    skills: ["Pattern recognition", "Tile merging efficiency", "Risk management"]
  },
  {
    id: 4,
    name: "Logic Master",
    key: "level4",
    subtitle: "Advanced Reasoning",
    difficulty: 5,
    desc: "Connect START to END in order using the shortest path",
    icon: "👑",
    skills: ["Sequence optimization", "Shortest path navigation", "Decision analysis"]
  }
];

// Sokoban Maps
const LEVEL_1_MAP = [
  [1, 1, 1, 1, 1],
  [1, 'P', 0, 0, 1],
  [1, 0, 'B', 0, 1],
  [1, 0, 0, 'T', 1],
  [1, 1, 1, 1, 1]
];

const LEVEL_2_MAP = [
  [1, 1, 1, 1, 1, 1],
  [1, 'P', 0, 0, 0, 1],
  [1, 0, 1, 'B', 0, 1],
  [1, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 'T', 1],
  [1, 1, 1, 1, 1, 1]
];

// Path Finder Map (Level 4)
const LEVEL_4_MAP = [
  ['S',  0,  1,  0,  0,  0, '2'],
  [  0,  0,  1,  0,  1,  0,   0],
  [  0, '1', 0,  0,  1,  1,   0],
  [  1,  1,  1,  0,  0,  0,   0],
  [  0,  0,  1,  1,  1, '3',  1],
  [ '4', 0,  0,  0,  1,  0,   1],
  [  1,  1,  1,  0,  0,  0, 'E']
];

// BFS helper for Level 4 shortest path calculation
function getShortestPathLength(grid) {
  const findCoord = (val) => {
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c] === val) return { r, c };
      }
    }
    return null;
  };

  const order = ['S', '1', '2', '3', '4', 'E'];
  const coords = order.map(findCoord);

  let totalDist = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    const start = coords[i];
    const end = coords[i + 1];
    if (!start || !end) return 0;
    const dist = bfs(grid, start, end);
    if (dist === -1) return 0;
    totalDist += dist;
  }
  return totalDist;
}

function bfs(grid, start, end) {
  const queue = [[start.r, start.c, 0]];
  const visited = new Set([`${start.r},${start.c}`]);
  while (queue.length > 0) {
    const [r, c, d] = queue.shift();
    if (r === end.r && c === end.c) return d;
    const neighbors = [
      [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]
    ];
    for (const [nr, nc] of neighbors) {
      if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length) {
        if (grid[nr][nc] !== 1 && !visited.has(`${nr},${nc}`)) {
          visited.add(`${nr},${nc}`);
          queue.push([nr, nc, d + 1]);
        }
      }
    }
  }
  return -1;
}

// ─── HERO SCREEN ─────────────────────────────────────────────────────────────
function HeroScreen({ onStart }) {
  const features = [
    { icon: "🧩", title: "Crate Runner & Spatial Puzzles", desc: "Push crates and plan ahead to test your raw spatial reasoning." },
    { icon: "🔢", title: "Merge Chain Strategy", desc: "Combine tiles dynamically under time pressure to test pattern recognition." },
    { icon: "🗺️", title: "Path Finder Optimization", desc: "Connect checkpoints via the shortest route to test sequence optimization." },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#fcf8ff]">
      {/* Background Soft Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full opacity-30 blur-[120px]" style={{ background: "radial-gradient(circle, #c3c0ff, transparent)" }} />
        <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full opacity-30 blur-[120px]" style={{ background: "radial-gradient(circle, #ffdbcc, transparent)" }} />
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-10 px-8 py-5 flex items-center justify-between border-b border-[#e4e1ee] bg-[#fcf8ff]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm bg-[#1e00a9]">
            <Brain size={18} color="#ffffff" />
          </div>
          <span className="text-xl font-bold text-[#1b1b24] tracking-tight font-heading">SkillQuest</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold bg-[#e2dfff] text-[#1e00a9] border border-[#c3c0ff]">
            Logic Lab
          </span>
        </div>
        <button
          onClick={onStart}
          className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:opacity-90 active:scale-95 shadow-sm bg-[#1e00a9] text-white cursor-pointer"
        >
          Enter Lab →
        </button>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-16 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-semibold bg-[#f5f2ff] text-[#4d44e3] border border-[#c3c0ff]">
          <Sparkles size={12} /> Gamified Cognitive Assessment
        </div>
        <h1 className="text-5xl sm:text-7xl font-bold text-[#1b1b24] mb-6 leading-tight font-heading">
          Uncover Your Logical
          <span className="block mt-2 bg-gradient-to-r from-[#1e00a9] via-[#4d44e3] to-[#069488] bg-clip-text text-transparent">
            Aptitude
          </span>
        </h1>
        <p className="text-lg text-[#464555] max-w-2xl mb-10 leading-relaxed">
          No generic questionnaire. Play **4 levels** of progressive cognitive challenges designed to test spatial layout planning, pattern analysis, and sequence optimization.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <button
            onClick={onStart}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-bold transition-all duration-300 hover:bg-[#3525cd] active:scale-95 shadow-md bg-[#1e00a9] text-white cursor-pointer font-heading"
          >
            Start Logic Journey
            <ArrowRight size={18} />
          </button>
          <div className="text-sm text-[#5e5d68] font-mono">⚡ 4 Levels · Complete Profile Assessment</div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mt-4">
          {features.map((f) => (
            <div key={f.title} className="p-6 rounded-2xl text-left transition-all duration-300 hover:shadow-md border border-[#e4e1ee] bg-white shadow-sm">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-[#1b1b24] mb-2 text-base font-heading">{f.title}</h3>
              <p className="text-xs text-[#464555] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Onboarding imported from components/Onboarding.jsx

// ─── JOURNEY SCREEN ──────────────────────────────────────────────────────────
function JourneyScreen({ levels, completedLevels, levelScores, totalXP, user, onStartLevel, onShowResults }) {
  const isLevelUnlocked = (lvlId) => {
    if (lvlId === 1) return true;
    return completedLevels.includes(lvlId - 1);
  };

  const isAllLevelsCompleted = levels.every(l => completedLevels.includes(l.id));
  const currentStage = Math.min(4, completedLevels.length + 1);

  return (
    <div className="min-h-screen px-6 py-12 flex flex-col items-center bg-[#fcf8ff]">
      <div className="w-full max-w-2xl flex items-center justify-between mb-8 border-b border-[#e4e1ee] pb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm bg-[#1e00a9]">
            <Brain size={18} color="#ffffff" />
          </div>
          <span className="text-xl font-bold text-[#1b1b24] font-heading">Logic Lab Journey</span>
        </div>
        <div className="flex items-center gap-2 bg-[#f5f2ff] border border-[#c3c0ff] px-4 py-2 rounded-xl text-[#1e00a9] font-mono font-bold text-sm">
          <span>🧠</span>
          <span>{totalXP} XP</span>
        </div>
      </div>

      {/* Stitch Bento Guide Card for Animal Growth */}
      <div className="w-full max-w-xl mb-8 bg-white border border-[#c7c4d8] rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-center gap-6">
        <div className="w-36 h-36 flex-shrink-0 flex items-center justify-center">
          <PetCompanion stage={currentStage} petType={user?.petType || "bunny"} />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-[#f5f2ff] text-[#069488] border border-[#069488]/30 mb-2">
            <span>✨ Companion Level {currentStage} / 4</span>
          </div>
          <h3 className="text-lg font-bold text-[#1b1b24] font-heading">
            {user?.name ? `${user.name}'s Animal Guide` : "Your Animal Companion"}
          </h3>
          <p className="text-xs text-[#464555] mt-1 leading-relaxed">
            Your pet grows stronger with every completed assessment. Next evolution unlocks in the forest!
          </p>

          {/* Growth Bar */}
          <div className="mt-3 w-full bg-[#f0ecf9] h-2 rounded-full overflow-hidden border border-[#c7c4d8]">
            <div
              className="h-full bg-gradient-to-r from-[#069488] to-[#1e00a9] transition-all duration-700 rounded-full"
              style={{ width: `${(completedLevels.length / levels.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-xl text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1b1b24] mb-2 font-heading">Your Logic Progress</h2>
        <p className="text-[#5e5d68] text-xs sm:text-sm">Unlock progressive challenges to verify your cognitive capacity.</p>
      </div>

      {/* Levels list */}
      <div className="w-full max-w-xl space-y-4">
        {levels.map((lvl, index) => {
          const unlocked = isLevelUnlocked(lvl.id);
          const completed = completedLevels.includes(lvl.id);
          const score = levelScores[lvl.key];

          return (
            <div key={lvl.id} className="relative">
              {/* Connector line */}
              {index < levels.length - 1 && (
                <div
                  className="absolute left-[34px] top-[76px] w-[2px] h-[36px] z-0"
                  style={{
                    background: completedLevels.includes(lvl.id) ? "#069488" : "#c7c4d8"
                  }}
                />
              )}

              <div
                onClick={() => unlocked && onStartLevel(lvl)}
                className={`relative z-10 p-5 rounded-2xl flex items-center gap-4 border transition-all duration-300 ${
                  completed
                    ? "border-[#069488]/40 bg-[#f5f2ff] hover:shadow-md cursor-pointer"
                    : unlocked
                    ? "border-[#1e00a9]/30 bg-white hover:shadow-md cursor-pointer"
                    : "border-[#e4e1ee] bg-[#f0ecf9] opacity-60 cursor-not-allowed"
                }`}
              >
                {/* Icon Circle */}
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold border transition-all ${
                    completed
                      ? "border-[#069488] bg-[#069488]/15 text-[#069488]"
                      : unlocked
                      ? "border-[#1e00a9] bg-[#1e00a9]/10 text-[#1e00a9]"
                      : "border-[#c7c4d8] bg-white text-[#777587]"
                  }`}
                >
                  {completed ? "✓" : lvl.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#FF7A6B]">{lvl.subtitle}</span>
                    <div className="flex items-center gap-0.5 text-xs text-amber-500">
                      {Array.from({ length: lvl.difficulty }).map((_, i) => (
                        <Star key={i} size={10} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <h4 className="font-bold text-[#1b1b24] text-base mt-0.5 font-heading">
                    {lvl.id}. {lvl.name}
                  </h4>
                  <p className="text-xs text-[#5e5d68] leading-relaxed mt-0.5">{lvl.desc}</p>
                </div>

                <div className="text-right">
                  {completed ? (
                    <div>
                      <div className="text-xs font-mono font-bold text-[#069488]">Score: {score}</div>
                      <div className="text-[10px] text-[#5e5d68] font-mono mt-0.5">+{score} XP</div>
                    </div>
                  ) : unlocked ? (
                    <div className="flex items-center gap-1 text-xs text-[#1e00a9] font-bold">
                      Play <ChevronRight size={14} />
                    </div>
                  ) : (
                    <div className="text-xs text-[#777587]">Locked 🔒</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isAllLevelsCompleted && (
        <button
          onClick={onShowResults}
          className="w-full max-w-xl py-4 rounded-xl font-bold text-sm transition-all duration-300 hover:bg-[#3525cd] active:scale-95 cursor-pointer flex items-center justify-center gap-2 mt-10 shadow-md bg-[#1e00a9] text-white font-heading"
        >
          View Final Logic Profile <Trophy size={16} />
        </button>
      )}
    </div>
  );
}

// ─── GAME CARD WRAPPER ────────────────────────────────────────────────────────
function GameCard({ title, subtitle, badge, children, accentColor = "#FFB238", onReset }) {
  return (
    <div className="w-full max-w-xl rounded-3xl overflow-hidden border bg-[#1B1E52]/40 border-white/10 backdrop-blur-md shadow-2xl">
      <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h2>
            {badge && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold"
                style={{ background: `${accentColor}22`, color: accentColor, border: `1px solid ${accentColor}44` }}
              >
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-white/50 mt-0.5">{subtitle}</p>
        </div>
        {onReset && (
          <button
            onClick={onReset}
            className="p-2 rounded-xl text-white/40 hover:text-[#FF7A6B] hover:bg-white/5 transition-all cursor-pointer"
            title="Restart puzzle"
          >
            <RotateCcw size={16} />
          </button>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// D-pad Controls
function DPad({ onUp, onDown, onLeft, onRight }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button onClick={onUp} className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-100 hover:bg-white/10 active:scale-90 cursor-pointer bg-white/5 border border-white/10">
        <ArrowUp size={16} color="white" />
      </button>
      <div className="flex gap-1">
        <button onClick={onLeft} className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-100 hover:bg-white/10 active:scale-90 cursor-pointer bg-white/5 border border-white/10">
          <ArrowLeft size={16} color="white" />
        </button>
        <button onClick={onDown} className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-100 hover:bg-white/10 active:scale-90 cursor-pointer bg-white/5 border border-white/10">
          <ArrowDown size={16} color="white" />
        </button>
        <button onClick={onRight} className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-100 hover:bg-white/10 active:scale-90 cursor-pointer bg-white/5 border border-white/10">
          <ChevronRight size={16} color="white" />
        </button>
      </div>
    </div>
  );
}

// ─── LEVEL 1 & 2: SOKOBAN (CRATE RUNNER & THINK AHEAD) ──────────────────────
function SokobanGame({ level, onComplete }) {
  const isLevel2 = level.id === 2;
  const gridTemplate = isLevel2 ? LEVEL_2_MAP : LEVEL_1_MAP;
  const rows = gridTemplate.length;
  const cols = gridTemplate[0].length;
  const moveLimit = isLevel2 ? 24 : Infinity;

  // Find initial positions
  const getStartPositions = () => {
    let pStart = { r: 0, c: 0 };
    let bStart = { r: 0, c: 0 };
    let tStart = { r: 0, c: 0 };

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (gridTemplate[r][c] === 'P') pStart = { r, c };
        else if (gridTemplate[r][c] === 'B') bStart = { r, c };
        else if (gridTemplate[r][c] === 'T') tStart = { r, c };
      }
    }
    return { pStart, bStart, tStart };
  };

  const { pStart, bStart, tStart } = getStartPositions();

  const [player, setPlayer] = useState(pStart);
  const [box, setBox] = useState(bStart);
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);
  const [failures, setFailures] = useState(0);
  const [startTime] = useState(Date.now());

  const movesLeft = isLevel2 ? moveLimit - moves : Infinity;

  const reset = () => {
    setPlayer(pStart);
    setBox(bStart);
    setMoves(0);
    setSolved(false);
  };

  const handleMove = (dr, dc) => {
    if (solved || movesLeft <= 0) return;

    const np = { r: player.r + dr, c: player.c + dc };

    // Wall collision
    if (np.r < 0 || np.r >= rows || np.c < 0 || np.c >= cols) return;
    if (gridTemplate[np.r][np.c] === 1) return;

    const hitsBox = np.r === box.r && np.c === box.c;

    if (hitsBox) {
      const nb = { r: box.r + dr, c: box.c + dc };

      // Box wall collision
      if (nb.r < 0 || nb.r >= rows || nb.c < 0 || nb.c >= cols) return;
      if (gridTemplate[nb.r][nb.c] === 1) return;

      setBox(nb);
      setPlayer(np);
      setMoves(m => m + 1);

      // Check solve
      if (nb.r === tStart.r && nb.c === tStart.c) {
        setSolved(true);
        const completionTime = (Date.now() - startTime) / 1000;
        const totalMoves = moves + 1;

        // Calculate score
        let score = 100;
        if (!isLevel2) {
          // Level 1: 5 moves is optimal
          if (totalMoves > 5) score = Math.max(50, 100 - (totalMoves - 5) * 5);
        } else {
          // Level 2: 13 moves is optimal
          if (totalMoves > 13) {
            score = Math.max(40, 100 - (totalMoves - 13) * 5 - failures * 5);
          }
        }

        setTimeout(() => {
          onComplete(Math.round(score), {
            moves: totalMoves,
            time: completionTime,
            failures
          });
        }, 1200);
      }
    } else {
      setPlayer(np);
      setMoves(m => m + 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (solved || movesLeft <= 0) return;
      if (e.key === "ArrowUp") handleMove(-1, 0);
      else if (e.key === "ArrowDown") handleMove(1, 0);
      else if (e.key === "ArrowLeft") handleMove(0, -1);
      else if (e.key === "ArrowRight") handleMove(0, 1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [player, box, solved, moves]);

  // Failure tracking if player runs out of moves
  useEffect(() => {
    if (isLevel2 && movesLeft === 0 && !solved) {
      setFailures(f => f + 1);
      setTimeout(() => {
        alert("Out of moves! Automatically resetting the puzzle...");
        reset();
      }, 1000);
    }
  }, [movesLeft, solved]);

  return (
    <div className="flex flex-col items-center">
      <GameCard
        title={level.name}
        subtitle={level.desc}
        badge={isLevel2 ? "Logic · Level 2/4" : "Logic · Level 1/4"}
        accentColor={isLevel2 ? "#FFB238" : "#34D1BF"}
        onReset={reset}
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <div>
            <div className="flex items-center justify-between mb-4 text-xs font-mono">
              <span className="text-white/50">
                Moves: <span className="text-white font-bold">{moves}</span>
              </span>
              {isLevel2 && (
                <span className={movesLeft <= 5 ? "text-[#FF7A6B] font-bold" : "text-white/50"}>
                  Moves Left: <span className="font-bold">{movesLeft}</span>
                </span>
              )}
            </div>

            {/* Grid display */}
            <div
              className="grid gap-1.5 p-3 rounded-2xl bg-white/[0.03] border border-white/10"
              style={{
                gridTemplateColumns: `repeat(${cols}, 1fr)`
              }}
            >
              {Array.from({ length: rows * cols }).map((_, idx) => {
                const r = Math.floor(idx / cols);
                const c = idx % cols;
                const cellVal = gridTemplate[r][c];

                const isPlayer = player.r === r && player.c === c;
                const isBox = box.r === r && box.c === c;
                const isTarget = cellVal === 'T';
                const isWall = cellVal === 1;

                return (
                  <div
                    key={idx}
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-lg transition-all"
                    style={{
                      background: isWall
                        ? "#1E1F4B"
                        : isTarget && !isBox
                        ? "rgba(255,178,56,0.15)"
                        : "rgba(255,255,255,0.04)",
                      border: isWall
                        ? "1px solid rgba(255,255,255,0.08)"
                        : isTarget
                        ? "2px dashed rgba(255,178,56,0.6)"
                        : "1px solid rgba(255,255,255,0.05)"
                    }}
                  >
                    {isWall && "🧱"}
                    {isPlayer && (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-lg"
                        style={{
                          background: isLevel2 ? "#FFB238" : "#34D1BF",
                          boxShadow: `0 0 12px ${isLevel2 ? "#FFB238" : "#34D1BF"}88`
                        }}
                      >
                        🙂
                      </div>
                    )}
                    {isBox && (solved ? "✅" : "📦")}
                    {isTarget && !isBox && !isPlayer && (
                      <div className="w-3 h-3 rounded-full opacity-60 bg-[#FFB238]" />
                    )}
                  </div>
                );
              })}
            </div>
            {solved && (
              <div className="mt-4 text-center text-xs font-semibold text-[#34D1BF] font-mono animate-pulse">
                🎉 Target delivered! Merging data...
              </div>
            )}
          </div>

          {!solved && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-[10px] text-white/30 font-mono mb-1">ARROWS or TOUCH CONTROLS:</p>
              <DPad
                onUp={() => handleMove(-1, 0)}
                onDown={() => handleMove(1, 0)}
                onLeft={() => handleMove(0, -1)}
                onRight={() => handleMove(0, 1)}
              />
            </div>
          )}
        </div>
      </GameCard>
    </div>
  );
}

// ─── LEVEL 3: MERGE MASTER (2048 WITH UNDO) ──────────────────────────────────
function Merge2048({ onComplete }) {
  const [grid, setGrid] = useState(() => addTile(addTile(emptyGrid())));
  const [score, setScore] = useState(0);
  const [maxTile, setMaxTile] = useState(2);
  const [timeLeft, setTimeLeft] = useState(35);
  const [merges, setMerges] = useState(0);
  const [totalMoves, setTotalMoves] = useState(0);
  const [efficientMoves, setEfficientMoves] = useState(0);
  const [history, setHistory] = useState([]);
  const [done, setDone] = useState(false);

  function emptyGrid() {
    return Array(4).fill(null).map(() => Array(4).fill(0));
  }

  function addTile(g) {
    const empty = [];
    g.forEach((row, r) => row.forEach((v, c) => { if (!v) empty.push({ r, c }); }));
    if (!empty.length) return g;
    const { r, c } = empty[Math.floor(Math.random() * empty.length)];
    const ng = g.map(row => [...row]);
    ng[r][c] = Math.random() < 0.9 ? 2 : 4;
    return ng;
  }

  function slideLeft(row, localAcc) {
    const nz = row.filter(v => v);
    const m = [];
    let i = 0;
    while (i < nz.length) {
      if (nz[i] === nz[i + 1]) {
        m.push(nz[i] * 2);
        localAcc.scoreGain += nz[i] * 2;
        localAcc.mergeCount += 1;
        i += 2;
      } else {
        m.push(nz[i]);
        i++;
      }
    }
    while (m.length < 4) m.push(0);
    return m;
  }

  function rotate(g) {
    const ng = emptyGrid();
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        ng[c][3 - r] = g[r][c];
      }
    }
    return ng;
  }

  function move(dir) {
    if (done) return;

    let g = grid.map(r => [...r]);
    const rots = { left: 0, up: 1, right: 2, down: 3 }[dir];

    for (let i = 0; i < rots; i++) g = rotate(g);

    const localAcc = { scoreGain: 0, mergeCount: 0 };
    const ng = g.map(row => slideLeft(row, localAcc));

    const moved = ng.some((row, r) => row.some((v, c) => v !== g[r][c]));
    let result = ng;

    for (let i = 0; i < (4 - rots) % 4; i++) result = rotate(result);

    if (moved) {
      // Save history for Undo
      setHistory(prev => [...prev, {
        grid: grid.map(r => [...r]),
        score,
        maxTile,
        merges,
        efficientMoves
      }]);

      const wt = addTile(result);
      setGrid(wt);
      setScore(s => s + localAcc.scoreGain);
      setMerges(m => m + localAcc.mergeCount);
      setTotalMoves(t => t + 1);
      if (localAcc.mergeCount > 0) setEfficientMoves(e => e + 1);

      const newMax = Math.max(...wt.flat());
      setMaxTile(m => Math.max(m, newMax));
    }
  }

  function undo() {
    if (history.length === 0 || done) return;
    const last = history[history.length - 1];
    setGrid(last.grid);
    setScore(last.score);
    setMaxTile(last.maxTile);
    setMerges(last.merges);
    setEfficientMoves(last.efficientMoves);
    setHistory(prev => prev.slice(0, -1));
  }

  // Timer effect
  useEffect(() => {
    if (done) return;
    if (timeLeft <= 0) {
      setDone(true);
      // Calculate level score based on metrics
      const tileScore = maxTile >= 128 ? 40 : maxTile >= 64 ? 30 : maxTile >= 32 ? 20 : 10;
      const mergeBonus = Math.min(30, merges * 2);
      const moveEfficiency = totalMoves > 0 ? Math.round((efficientMoves / totalMoves) * 20) : 0;
      const finalScore = Math.min(100, tileScore + mergeBonus + moveEfficiency + 20);

      setTimeout(() => {
        onComplete(finalScore, { maxTile, merges, totalMoves, efficientMoves, score });
      }, 1000);
      return;
    }

    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, done]);

  // Key listening
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp") move("up");
      else if (e.key === "ArrowDown") move("down");
      else if (e.key === "ArrowLeft") move("left");
      else if (e.key === "ArrowRight") move("right");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [grid, done, score, maxTile, merges]);

  const tileColors = {
    0: "transparent",
    2: "#FFB23822",
    4: "#FFB23844",
    8: "#FF7A6B44",
    16: "#FF7A6B66",
    32: "#34D1BF44",
    64: "#34D1BF66",
    128: "#34D1BF",
    256: "#FFB238",
    512: "#FF7A6B",
    1024: "#a78bfa"
  };

  return (
    <div className="flex flex-col items-center">
      <GameCard
        title="Merge Master"
        subtitle="Combine matching tiles within the limit. Higher values reward significantly more XP."
        badge="Logic · Level 3/4"
        accentColor="#34D1BF"
      >
        <div className="flex flex-col sm:flex-row items-center gap-8 justify-center">
          <div>
            <div className="flex items-center justify-between mb-3 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-xs">
                <Timer size={14} className={timeLeft <= 8 ? "text-[#FF7A6B] animate-pulse" : "text-white/50"} />
                <span className={timeLeft <= 8 ? "text-[#FF7A6B] font-bold" : "text-white/60"}>{timeLeft}s</span>
              </div>
              <div className="text-white/50">
                Score: <span className="font-bold text-white">{score}</span>
              </div>
              <div className="text-white/50">
                Highest: <span className="font-bold text-[#FFB238]">{maxTile}</span>
              </div>
            </div>

            {/* Grid 2048 */}
            <div className="grid grid-cols-4 gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
              {grid.flat().map((v, i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm font-mono transition-all border"
                  style={{
                    background: tileColors[v] || "#a78bfa",
                    color: v >= 8 ? (v >= 32 ? "#12143A" : "white") : "rgba(255,255,255,0.7)",
                    borderColor: v ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)"
                  }}
                >
                  {v || ""}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-4">
              <button
                disabled={history.length === 0 || done}
                onClick={undo}
                className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border border-white/10 hover:bg-white/5 text-white/50 disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                ↶ Undo Move
              </button>
              {done && (
                <div className="text-xs font-semibold text-[#34D1BF] font-mono animate-pulse">
                  ⏱ Time up! Compiling metrics...
                </div>
              )}
            </div>
          </div>

          {!done && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-[10px] text-white/30 font-mono mb-1">ARROWS:</p>
              <DPad
                onUp={() => move("up")}
                onDown={() => move("down")}
                onLeft={() => move("left")}
                onRight={() => move("right")}
              />
            </div>
          )}
        </div>
      </GameCard>
    </div>
  );
}

// ─── LEVEL 4: LOGIC MASTER (PATH FINDER) ─────────────────────────────────────
function PathFinderGame({ onComplete }) {
  const rows = LEVEL_4_MAP.length;
  const cols = LEVEL_4_MAP[0].length;

  const [path, setPath] = useState([{ r: 0, c: 0 }]); // Starts at S (0,0)
  const [nextTarget, setNextTarget] = useState('1');
  const [timeLeft, setTimeLeft] = useState(60);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const shortestDist = getShortestPathLength(LEVEL_4_MAP);

  // Timer Effect
  useEffect(() => {
    if (done) return;
    if (timeLeft <= 0) {
      setDone(true);
      setTimeout(() => {
        onComplete(40, { pathLength: path.length, shortestDist, success: false });
      }, 1000);
      return;
    }

    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, done]);

  const handleCellClick = (r, c) => {
    if (done) return;
    const cellVal = LEVEL_4_MAP[r][c];

    // Wall blocker
    if (cellVal === 1) return;

    const last = path[path.length - 1];
    const isAdjacent = Math.abs(last.r - r) + Math.abs(last.c - c) === 1;

    if (!isAdjacent) return;

    // Check if clicked cell is already in path
    const existIdx = path.findIndex(p => p.r === r && p.c === c);

    if (existIdx !== -1) {
      // Backtrack path up to this clicked cell
      setPath(prev => prev.slice(0, existIdx + 1));
      // Re-evaluate nextTarget sequence based on remaining path content
      const truncatedPath = path.slice(0, existIdx + 1);
      const visitedVals = truncatedPath.map(p => LEVEL_4_MAP[p.r][p.c]);

      if (!visitedVals.includes('4')) {
        if (!visitedVals.includes('3')) {
          if (!visitedVals.includes('2')) {
            if (!visitedVals.includes('1')) {
              setNextTarget('1');
            } else {
              setNextTarget('2');
            }
          } else {
            setNextTarget('3');
          }
        } else {
          setNextTarget('4');
        }
      } else {
        setNextTarget('E');
      }
      return;
    }

    // Checking correct target sequence
    if (['1', '2', '3', '4', 'E'].includes(cellVal)) {
      if (cellVal !== nextTarget) {
        setErrorMsg(`Target out of sequence. Find ${nextTarget} first!`);
        setTimeout(() => setErrorMsg(""), 2000);
        return;
      }
    }

    // Add to path
    const newPath = [...path, { r, c }];
    setPath(newPath);

    // Sequence target progression
    if (cellVal === nextTarget) {
      if (nextTarget === '1') setNextTarget('2');
      else if (nextTarget === '2') setNextTarget('3');
      else if (nextTarget === '3') setNextTarget('4');
      else if (nextTarget === '4') setNextTarget('E');
      else if (nextTarget === 'E') {
        setDone(true);
        // Completed successfully! Calculate scores based on optimal path segment lengths
        const pathLen = newPath.length - 1;
        let score = 100;
        if (pathLen > shortestDist) {
          score = Math.max(50, 100 - (pathLen - shortestDist) * 5);
        }
        // Time bonus
        score = Math.min(100, score + Math.round(timeLeft / 60 * 10));

        setTimeout(() => {
          onComplete(Math.round(score), { pathLength: pathLen, shortestDist, success: true });
        }, 1200);
      }
    }
  };

  const isCellInPath = (r, c) => path.some(p => p.r === r && p.c === c);

  return (
    <div className="flex flex-col items-center">
      <GameCard
        title="Path Finder"
        subtitle="Connect all checkpoints in order: START → 1 → 2 → 3 → 4 → END using the shortest possible path."
        badge="Logic · Level 4/4"
        accentColor="#FF7A6B"
        onReset={() => {
          setPath([{ r: 0, c: 0 }]);
          setNextTarget('1');
          setErrorMsg("");
        }}
      >
        <div className="w-full flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 text-xs font-mono">
            <div className="flex items-center gap-1">
              <Timer size={14} className={timeLeft <= 10 ? "text-[#FF7A6B] animate-pulse" : "text-white/50"} />
              <span className={timeLeft <= 10 ? "text-[#FF7A6B] font-bold" : "text-white/60"}>{timeLeft}s</span>
            </div>
            <div className="text-white/50">
              Steps: <span className="text-white font-bold">{path.length - 1}</span>
            </div>
            <div className="text-[#34D1BF]">
              Next Target: <span className="font-bold">{nextTarget === 'E' ? "END 🔴" : nextTarget}</span>
            </div>
          </div>

          {errorMsg && (
            <div className="w-full bg-[#FF7A6B]/15 border border-[#FF7A6B]/30 px-3 py-2 rounded-xl text-[#FF7A6B] text-[11px] font-bold flex items-center gap-1.5 mb-3 font-mono animate-shake">
              <ShieldAlert size={12} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Grid display */}
          <div className="grid gap-1 p-3 rounded-2xl bg-white/[0.02] border border-white/10 relative overflow-hidden" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {Array.from({ length: rows * cols }).map((_, idx) => {
              const r = Math.floor(idx / cols);
              const c = idx % cols;
              const val = LEVEL_4_MAP[r][c];

              const inPath = isCellInPath(r, c);
              const isStart = val === 'S';
              const isEnd = val === 'E';
              const isTargetNum = ['1', '2', '3', '4'].includes(val);
              const isWall = val === 1;

              // Check if it's the tip of the path
              const isTip = path[path.length - 1].r === r && path[path.length - 1].c === c;

              return (
                <div
                  key={idx}
                  onClick={() => handleCellClick(r, c)}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold transition-all relative select-none cursor-pointer hover:bg-white/5`}
                  style={{
                    background: isWall
                      ? "#1A1A3C"
                      : isTip
                      ? "#34D1BF"
                      : inPath
                      ? "rgba(52,209,191,0.25)"
                      : isStart
                      ? "rgba(74,222,128,0.15)"
                      : isEnd
                      ? "rgba(239,68,68,0.15)"
                      : "rgba(255,255,255,0.03)",
                    border: isTip
                      ? "1px solid #34D1BF"
                      : inPath
                      ? "1.5px solid #34D1BF88"
                      : isStart
                      ? "1.5px solid #4ADE80"
                      : isEnd
                      ? "1.5px solid #EF4444"
                      : "1px solid rgba(255,255,255,0.05)",
                    color: isTip
                      ? "#12143A"
                      : isStart
                      ? "#4ADE80"
                      : isEnd
                      ? "#EF4444"
                      : inPath
                      ? "#34D1BF"
                      : "rgba(255,255,255,0.6)"
                  }}
                >
                  {isStart ? "🟢 START" : isEnd ? "🔴 END" : isWall ? "🧱" : val || ""}
                </div>
              );
            })}
          </div>

          <div className="mt-4 text-[10px] text-white/30 font-mono text-center leading-relaxed">
            💡 Click adjacent cells sequentially to trace the path.<br />Click a previously visited cell to backtrack instantly.
          </div>
        </div>
      </GameCard>
    </div>
  );
}

// ─── TRANSITION SCREEN ───────────────────────────────────────────────────────
function TransitionScreen({ level, score, onContinue }) {
  // Fire confetti once on transition complete
  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#34D1BF", "#FFB238", "#FF7A6B"]
      });
    } catch (e) {
      // fallback
    }
  }, [level]);

  // Level transition stats mock metrics for premium feels
  const planningVal = Math.round(score * 0.95);
  const accuracyVal = Math.round(score * 0.98);

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "linear-gradient(135deg, #0A0C27 0%, #12143A 60%, #150A2E 100%)" }}>
      <div className="w-full max-w-md p-8 rounded-3xl border border-white/10 bg-[#16194A]/70 backdrop-blur-xl text-center shadow-2xl relative overflow-hidden">
        {/* Glow behind */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-50px] left-[50%] -translate-x-[50%] w-[200px] h-[200px] rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle, #34D1BF, transparent)" }} />
        </div>

        <div className="relative z-10">
          <span className="text-3xl mb-3 block">🎉</span>
          <h2 className="text-2xl font-bold text-[#34D1BF] font-heading">NICE WORK!</h2>
          <p className="text-xs uppercase tracking-wider text-white/40 font-mono mt-1">Level {level.id} Complete</p>

          <div className="my-6 py-4 px-6 rounded-2xl bg-white/[0.03] border border-white/5">
            <div className="text-sm font-mono text-white/50 mb-1">Logic Score</div>
            <div className="text-4xl font-extrabold text-[#FFB238] font-mono leading-none">{score} <span className="text-xs text-white/30">/ 100</span></div>

            <div className="mt-5 space-y-2.5 text-left">
              {level.skills.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-white/70">
                  <CheckCircle2 size={13} className="text-[#34D1BF]" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 bg-[#FFB238]/10 border border-[#FFB238]/20 px-4 py-2 rounded-xl text-[#FFB238] font-mono font-bold text-xs w-fit mx-auto mb-8">
            <span>🧠</span>
            <span>+{score} XP earned</span>
          </div>

          <div className="border-t border-white/5 pt-6">
            {level.id < 4 ? (
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs text-[#34D1BF] font-bold font-mono mb-4">
                  <span>🔓</span> LEVEL {level.id + 1} UNLOCKED: {LEVELS[level.id].name}
                </div>
                <button
                  onClick={onContinue}
                  className="w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  style={{ background: "#FFB238", color: "#12143A", fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Continue Journey <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs text-[#34D1BF] font-bold font-mono mb-4">
                  🏆 JOURNEY COMPLETE
                </div>
                <button
                  onClick={onContinue}
                  className="w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #34D1BF, #FFB238)", color: "#12143A", fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Analyze Final Results <Trophy size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FINAL RESULTS SCREEN ────────────────────────────────────────────────────
function ResultsScreen({ user, levelScores, onRestart }) {
  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#34D1BF", "#FFB238", "#FF7A6B"]
      });
    } catch (e) {}
  }, []);

  const L1 = levelScores.level1 || 0;
  const L2 = levelScores.level2 || 0;
  const L3 = levelScores.level3 || 0;
  const L4 = levelScores.level4 || 0;

  // Final logic calculation weights
  const finalScore = Math.round(L1 * 0.15 + L2 * 0.20 + L3 * 0.25 + L4 * 0.40);

  // Skills Breakdown Mapping
  const planning = Math.round(L2 * 0.4 + L4 * 0.6);
  const spatial = Math.round(L1 * 0.3 + L2 * 0.4 + L4 * 0.3);
  const pattern = Math.round(L3 * 0.8 + L4 * 0.2);
  const decision = Math.round(L3 * 0.4 + L4 * 0.6);

  const radarData = [
    { skill: "Planning", value: planning },
    { skill: "Spatial", value: spatial },
    { skill: "Pattern", value: pattern },
    { skill: "Decision", value: decision },
  ];

  const levelPerformances = [
    { name: "L1 Warm Up", score: L1, fill: "#34D1BF" },
    { name: "L2 Planning", score: L2, fill: "#FFB238" },
    { name: "L3 Pattern", score: L3, fill: "#FF7A6B" },
    { name: "L4 Reasoning", score: L4, fill: "#a78bfa" }
  ];

  // Logic assessment summary copy
  const getBadgeText = (score, stage) => {
    if (stage === 'school') {
      if (score >= 90) return { title: "STEM Trailblazer", desc: "You possess exceptional forward planning and dynamic pattern analysis capabilities, ideal for STEM fields." };
      if (score >= 80) return { title: "Analytical Explorer", desc: "You maintain high accuracy and strategic structure, making you great for logic-heavy subjects." };
      if (score >= 65) return { title: "Creative Problem Solver", desc: "Solid spatial and reasoning capacities, great for applied arts and sciences." };
      return { title: "Foundational Builder", desc: "Good trial-and-error solver. Focus on spatial layout analysis for design and arts." };
    } else {
      if (score >= 90) return { title: "Elite Master Strategist", desc: "Your scores map perfectly to Data Science or Backend Architecture roles." };
      if (score >= 80) return { title: "Strong Logical Thinker", desc: "You'd excel in Product Management or Frontend Engineering." };
      if (score >= 65) return { title: "Analytical Navigator", desc: "Solid spatial reasoning, suitable for UI/UX Design or Financial Analysis." };
      return { title: "Experimental Optimizer", desc: "Good trial-and-error solver. Focus on QA Engineering or Operations roles." };
    }
  };

  const evaluation = getBadgeText(finalScore, user?.stage || 'college');

  return (
    <div className="min-h-screen bg-[#fcf8ff]">
      {/* Header Results Banner */}
      <div className="relative overflow-hidden px-6 pt-12 pb-14 text-center border-b border-[#e4e1ee] bg-[#fcf8ff]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-30 blur-3xl" style={{ background: "radial-gradient(circle, #c3c0ff, transparent)" }} />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-mono font-semibold bg-[#e2dfff] text-[#1e00a9] border border-[#c3c0ff]">
            <Trophy size={12} /> Cognitive Profile Verified
          </div>
          <h1 className="text-4xl font-bold text-[#1b1b24] mb-2 font-heading">
            {user?.name ? `${user.name.split(" ")[0]}'s Logic Signature` : "Your Logic Signature"}
          </h1>
          <p className="text-[#5e5d68] text-xs font-mono">Verified assessment metrics generated dynamically during play</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Fully Evolved Pet Companion Bento Card (Google Stitch Design) */}
        <div className="bg-[#f5f2ff] border border-[#c3c0ff] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="w-48 h-48 flex-shrink-0 flex items-center justify-center relative">
            <PetCompanion stage={4} petType={user?.petType || "bunny"} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-[#e2dfff] text-[#1e00a9] border border-[#c3c0ff] mb-3">
              <span>👑 Fully Evolved Animal Companion (Stage 4 Master)</span>
            </div>
            <h2 className="text-2xl font-bold text-[#1b1b24] font-heading">
              {user?.name ? `${user.name}'s Companion Guide` : "Your Master Companion"}
            </h2>
            <p className="text-sm text-[#464555] mt-2 leading-relaxed">
              "Congratulations! You've navigated through the full cognitive forest assessment. Your animal guide has evolved into a Master Strategist to assist your career journey."
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="bg-white text-[#069488] px-3 py-1 rounded-xl text-xs font-mono border border-[#069488]/30 shadow-sm">
                Stage 4: Grand Master
              </span>
              <span className="bg-white text-[#1e00a9] px-3 py-1 rounded-xl text-xs font-mono border border-[#c3c0ff] shadow-sm">
                Cognitive Growth: 100%
              </span>
            </div>
          </div>
        </div>

        {/* Profile score and radar charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Detailed Skill Scores */}
          <div className="p-6 rounded-2xl border border-[#e4e1ee] bg-white shadow-sm">
            <h3 className="text-[#1b1b24] font-bold mb-5 text-base tracking-wide font-heading">Cognitive Sub-Skills</h3>
            <div className="space-y-4">
              {[
                { key: "planning", label: "Planning & Forward Thinking", value: planning, color: "#069488" },
                { key: "spatial", label: "Spatial & Structural Layout", value: spatial, color: "#F59E0B" },
                { key: "pattern", label: "Pattern & Sequence Recognition", value: pattern, color: "#FF7A6B" },
                { key: "decision", label: "Adaptive Decision Making", value: decision, color: "#4D44E3" }
              ].map(s => (
                <div key={s.key}>
                  <div className="flex justify-between text-xs mb-1.5 font-mono">
                    <span className="text-[#464555]">{s.label}</span>
                    <span className="font-bold" style={{ color: s.color }}>{s.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#f0ecf9] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${s.value}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Radar Chart Visual */}
          <div className="p-6 rounded-2xl border border-[#e4e1ee] bg-white shadow-sm flex flex-col items-center justify-center">
            <h3 className="text-[#1b1b24] font-bold mb-3 text-base tracking-wide w-full text-left font-heading">Skill Radar Profile</h3>
            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="70%">
                  <PolarGrid stroke="#e4e1ee" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: "#464555", fontSize: 10, fontFamily: "monospace" }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar dataKey="value" stroke="#1e00a9" fill="#1e00a9" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Global summary badge & level graph */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 p-6 rounded-2xl border border-[#e4e1ee] bg-white shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase font-mono font-semibold tracking-wider text-[#069488] mb-1">Final Score</div>
              <div className="text-5xl font-black text-[#1b1b24] font-mono leading-none mb-3">{finalScore} <span className="text-xs text-[#5e5d68]">/ 100</span></div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-[#1e00a9] mb-4">
                🔥 {evaluation.title}
              </div>
              <p className="text-xs text-[#464555] leading-relaxed">{evaluation.desc}</p>
            </div>
          </div>

          {/* Level performance comparison bar chart */}
          <div className="md:col-span-2 p-6 rounded-2xl border border-[#e4e1ee] bg-white shadow-sm">
            <h3 className="text-[#1b1b24] font-bold mb-4 text-base tracking-wide font-heading">Level Score Breakdown</h3>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={levelPerformances} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fill: "#464555", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#5e5d68", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#ffffff", borderColor: "#e4e1ee", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                    itemStyle={{ color: "#1b1b24", fontSize: "11px" }}
                    labelStyle={{ color: "#5e5d68", fontSize: "10px" }}
                  />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]} maxBarSize={45}>
                    {levelPerformances.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Action list */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-6">
          <button
            onClick={onRestart}
            className="px-6 py-3.5 rounded-xl text-xs font-bold border border-[#outline] hover:bg-[#surface-variant] text-[#1b1b24] transition-all cursor-pointer flex items-center gap-2"
          >
            <RotateCcw size={14} /> Restart Assessment
          </button>
          <button
            onClick={() => alert("Logic Signature exported successfully! Storing values in database.")}
            className="px-6 py-3.5 rounded-xl text-xs font-bold bg-[#1e00a9] hover:bg-[#3525cd] text-white transition-all cursor-pointer flex items-center gap-2 shadow-sm"
          >
            Export Profile Verified ✓
          </button>
        </div>
      </div>
    </div>
  );
          >
            <RotateCcw size={14} /> Restart Assessment
          </button>
          <button
            onClick={() => alert("Logic Signature exported successfully! Storing values in database.")}
            className="px-6 py-3.5 rounded-xl text-xs font-bold bg-[#34D1BF] hover:bg-[#34D1BF]/90 text-[#12143A] transition-all cursor-pointer flex items-center gap-2"
          >
            Export Profile Verified ✓
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN CONTAINER ──────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("hero"); // hero | onboarding | journey | level | transition | results
  const [user, setUser] = useState(null);
  const [activeLevel, setActiveLevel] = useState(null);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [levelScores, setLevelScores] = useState({ level1: 0, level2: 0, level3: 0, level4: 0 });
  const [transitionScore, setTransitionScore] = useState(0);
  const [showForestPath, setShowForestPath] = useState(false);

  const totalXP = Object.values(levelScores).reduce((a, b) => a + b, 0);

  const startLevel = (lvl) => {
    setActiveLevel(lvl);
    setScreen("level");
  };

  const handleLevelComplete = (score, metrics) => {
    // Record level completion
    setLevelScores(prev => ({
      ...prev,
      [activeLevel.key]: score
    }));
    setTransitionScore(score);

    if (!completedLevels.includes(activeLevel.id)) {
      setCompletedLevels(prev => [...prev, activeLevel.id]);
    }
    setScreen("transition");
  };

  const handleTransitionContinue = () => {
    setShowForestPath(true);
  };

  const handleForestPathFinish = () => {
    setShowForestPath(false);
    if (activeLevel.id < 4) {
      setScreen("journey");
    } else {
      setScreen("results");
    }
  };

  const handleRestart = () => {
    setScreen("hero");
    setUser(null);
    setActiveLevel(null);
    setCompletedLevels([]);
    setLevelScores({ level1: 0, level2: 0, level3: 0, level4: 0 });
    setTransitionScore(0);
  };

  return (
    <div className="min-h-screen text-white select-none overflow-x-hidden" style={{ backgroundColor: "#0A0C27" }}>
      {screen === "hero" && (
        <HeroScreen onStart={() => setScreen("onboarding")} />
      )}

      {screen === "onboarding" && (
        <OnboardingScreen onComplete={(u) => { setUser(u); setScreen("journey"); }} />
      )}

      {screen === "journey" && (
        <JourneyScreen
          levels={LEVELS}
          completedLevels={completedLevels}
          levelScores={levelScores}
          totalXP={totalXP}
          user={user}
          onStartLevel={startLevel}
          onShowResults={() => setScreen("results")}
        />
      )}

      {showForestPath && activeLevel && (
        <ForestPathTransition
          level={activeLevel.id}
          completedLevels={completedLevels}
          activePet={user?.petType || "bunny"}
          onCompletePath={handleForestPathFinish}
        />
      )}

      {screen === "level" && activeLevel && (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0A0C27 0%, #12143A 60%, #170A2E 100%)" }}>
          {/* Return link */}
          <button
            onClick={() => setScreen("journey")}
            className="absolute top-6 left-6 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-white/50 border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all cursor-pointer z-50 font-mono"
          >
            <ArrowLeft size={13} /> Back to Journey
          </button>

          {activeLevel.id === 1 && (
            <SokobanGame level={activeLevel} onComplete={handleLevelComplete} />
          )}
          {activeLevel.id === 2 && (
            <SokobanGame level={activeLevel} onComplete={handleLevelComplete} />
          )}
          {activeLevel.id === 3 && (
            <Merge2048 onComplete={handleLevelComplete} />
          )}
          {activeLevel.id === 4 && (
            <PathFinderGame onComplete={handleLevelComplete} />
          )}
        </div>
      )}

      {screen === "transition" && activeLevel && (
        <TransitionScreen
          level={activeLevel}
          score={transitionScore}
          onContinue={handleTransitionContinue}
        />
      )}

      {screen === "results" && (
        <ResultsScreen
          user={user}
          levelScores={levelScores}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
