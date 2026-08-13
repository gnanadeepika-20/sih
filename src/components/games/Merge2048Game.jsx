import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Timer, Brain, CheckCircle2 } from "lucide-react";

export default function Merge2048Game({ onComplete }) {
  const [grid, setGrid] = useState(() => initGrid());
  const [timeLeft, setTimeLeft] = useState(35);
  const [maxTile, setMaxTile] = useState(2);
  const [isDone, setIsDone] = useState(false);

  function initGrid() {
    let g = Array(4).fill(null).map(() => Array(4).fill(0));
    return addTile(addTile(g));
  }

  function addTile(g) {
    const empty = [];
    g.forEach((row, r) => row.forEach((v, c) => { if (v === 0) empty.push({ r, c }); }));
    if (empty.length === 0) return g;
    const { r, c } = empty[Math.floor(Math.random() * empty.length)];
    const ng = g.map((row) => [...row]);
    ng[r][c] = Math.random() < 0.9 ? 2 : 4;
    return ng;
  }

  function slideRowLeft(row) {
    const nonZero = row.filter((v) => v !== 0);
    const merged = [];
    let i = 0;
    while (i < nonZero.length) {
      if (nonZero[i] === nonZero[i + 1]) {
        merged.push(nonZero[i] * 2);
        i += 2;
      } else {
        merged.push(nonZero[i]);
        i += 1;
      }
    }
    while (merged.length < 4) merged.push(0);
    return merged;
  }

  function rotateGrid(g) {
    const ng = Array(4).fill(null).map(() => Array(4).fill(0));
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) ng[c][3 - r] = g[r][c];
    return ng;
  }

  function move(dir) {
    if (isDone) return;
    let g = grid.map((row) => [...row]);
    let rotations = { left: 0, up: 1, right: 2, down: 3 }[dir];
    for (let i = 0; i < rotations; i++) g = rotateGrid(g);
    const newRows = g.map((row) => slideRowLeft(row));
    let moved = newRows.some((row, r) => row.some((v, c) => v !== g[r][c]));
    let result = newRows;
    for (let i = 0; i < (4 - rotations) % 4; i++) result = rotateGrid(result);

    if (moved) {
      const withTile = addTile(result);
      setGrid(withTile);
      const newMax = Math.max(...withTile.flat());
      setMaxTile((m) => Math.max(m, newMax));
    }
  }

  // Timer effect
  useEffect(() => {
    if (isDone) return;
    if (timeLeft <= 0) {
      setIsDone(true);
      const score = maxTile >= 128 ? 100 : maxTile >= 64 ? 85 : maxTile >= 32 ? 75 : maxTile >= 16 ? 60 : 45;
      setTimeout(() => onComplete(score), 1000);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isDone, maxTile]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp" || e.key === "w") move("up");
      else if (e.key === "ArrowDown" || e.key === "s") move("down");
      else if (e.key === "ArrowLeft" || e.key === "a") move("left");
      else if (e.key === "ArrowRight" || e.key === "d") move("right");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [grid, isDone]);

  return (
    <div className="w-full max-w-md mx-auto bg-[#1B1E52] border border-[#33366E] rounded-2xl p-5 sm:p-6 text-center animate-fade-in">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#33366E]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FFB238]/20 flex items-center justify-center">
            <Brain className="w-4 h-4 text-[#FFB238]" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-[#F5F3ED] font-heading">Logic Round 2: 2048 Merge</h3>
            <p className="text-[11px] text-[#9497C9]">Pattern Recognition under pressure</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 text-[#FF7A6B] font-mono font-bold">
            <Timer className="w-3.5 h-3.5" /> {timeLeft}s
          </div>
          <span className="text-[#9497C9]">
            Max: <strong className="text-[#34D1BF] font-mono">{maxTile}</strong>
          </span>
        </div>
      </div>

      <p className="text-xs text-[#9497C9] mb-4">
        Slide matching numbers into each other to double their values before time expires!
      </p>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-2 bg-[#12143A] p-2.5 rounded-2xl max-w-[260px] mx-auto border border-[#33366E]">
        {grid.flat().map((v, idx) => (
          <div
            key={idx}
            className={`aspect-square rounded-xl flex items-center justify-center font-mono font-bold text-sm transition-all ${
              v === 0
                ? "bg-[#242868]/60 text-transparent"
                : v === 2
                ? "bg-[#FFB238]/20 text-[#FFB238] border border-[#FFB238]/40"
                : v === 4
                ? "bg-[#FFB238]/40 text-[#FFB238] border border-[#FFB238]/60 shadow-md"
                : v === 8
                ? "bg-[#FF7A6B]/40 text-[#FF7A6B] border border-[#FF7A6B]/60 shadow-md"
                : "bg-[#34D1BF] text-[#12143A] font-extrabold shadow-lg scale-105"
            }`}
          >
            {v || ""}
          </div>
        ))}
      </div>

      {isDone ? (
        <div className="mt-4 p-3 rounded-xl bg-[#34D1BF]/15 border border-[#34D1BF]/40 text-[#34D1BF] text-xs font-semibold flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Time's up! Max Tile: {maxTile}. Calculating Logic score...</span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1.5 mt-5">
          <button
            onClick={() => move("up")}
            className="w-11 h-11 rounded-xl bg-[#242868] hover:bg-[#33366E] active:scale-95 text-[#F5F3ED] flex items-center justify-center border border-[#33366E]"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <div className="flex gap-1.5">
            <button
              onClick={() => move("left")}
              className="w-11 h-11 rounded-xl bg-[#242868] hover:bg-[#33366E] active:scale-95 text-[#F5F3ED] flex items-center justify-center border border-[#33366E]"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => move("down")}
              className="w-11 h-11 rounded-xl bg-[#242868] hover:bg-[#33366E] active:scale-95 text-[#F5F3ED] flex items-center justify-center border border-[#33366E]"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => move("right")}
              className="w-11 h-11 rounded-xl bg-[#242868] hover:bg-[#33366E] active:scale-95 text-[#F5F3ED] flex items-center justify-center border border-[#33366E]"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
