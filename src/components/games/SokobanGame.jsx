import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, CheckCircle2, Brain } from "lucide-react";

const SOK_SIZE = 5;
const SOK_PAR = 3;
const sokStart = { r: 0, c: 2 };
const sokBoxStart = { r: 2, c: 2 };
const sokTarget = { r: 4, c: 2 };

export default function SokobanGame({ onComplete }) {
  const [player, setPlayer] = useState(sokStart);
  const [box, setBox] = useState(sokBoxStart);
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);

  const resetGame = () => {
    setPlayer(sokStart);
    setBox(sokBoxStart);
    setMoves(0);
    setSolved(false);
  };

  const move = (dr, dc) => {
    if (solved) return;
    const np = { r: player.r + dr, c: player.c + dc };
    if (np.r < 0 || np.r >= SOK_SIZE || np.c < 0 || np.c >= SOK_SIZE) return;

    const hitsBox = np.r === box.r && np.c === box.c;
    if (hitsBox) {
      const nb = { r: box.r + dr, c: box.c + dc };
      if (nb.r < 0 || nb.r >= SOK_SIZE || nb.c < 0 || nb.c >= SOK_SIZE) return;

      setBox(nb);
      setPlayer(np);
      setMoves((m) => m + 1);

      if (nb.r === sokTarget.r && nb.c === sokTarget.c) {
        setSolved(true);
        const finalMoves = moves + 1;
        const score = finalMoves <= SOK_PAR ? 100 : finalMoves === SOK_PAR + 1 ? 85 : finalMoves === SOK_PAR + 2 ? 75 : 60;
        setTimeout(() => onComplete(score), 1000);
      }
    } else {
      setPlayer(np);
      setMoves((m) => m + 1);
    }
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp" || e.key === "w") move(-1, 0);
      else if (e.key === "ArrowDown" || e.key === "s") move(1, 0);
      else if (e.key === "ArrowLeft" || e.key === "a") move(0, -1);
      else if (e.key === "ArrowRight" || e.key === "d") move(0, 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [player, box, moves, solved]);

  return (
    <div className="w-full max-w-md mx-auto bg-[#1B1E52] border border-[#33366E] rounded-2xl p-5 sm:p-6 text-center animate-fade-in">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#33366E]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#34D1BF]/20 flex items-center justify-center">
            <Brain className="w-4 h-4 text-[#34D1BF]" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-[#F5F3ED] font-heading">Logic Round 1: Sokoban</h3>
            <p className="text-[11px] text-[#9497C9]">Push the crate onto the target</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-[#9497C9]">
            Moves: <strong className="text-[#FFB238] font-mono">{moves}</strong>
          </span>
          <button
            onClick={resetGame}
            title="Reset Grid"
            className="p-1.5 rounded-lg bg-[#242868] text-[#9497C9] hover:text-[#F5F3ED] border border-[#33366E]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <p className="text-xs text-[#9497C9] mb-4">
        Use Arrow Keys or On-Screen Controls to guide the teal player dot and push the orange crate.
      </p>

      {/* Grid */}
      <div className="grid grid-cols-5 gap-1.5 bg-[#12143A] p-2.5 rounded-2xl max-w-[260px] mx-auto border border-[#33366E]">
        {Array.from({ length: SOK_SIZE * SOK_SIZE }).map((_, idx) => {
          const r = Math.floor(idx / SOK_SIZE);
          const c = idx % SOK_SIZE;
          const isPlayer = player.r === r && player.c === c;
          const isBox = box.r === r && box.c === c;
          const isTarget = sokTarget.r === r && sokTarget.c === c;

          return (
            <div
              key={idx}
              className={`aspect-square rounded-xl flex items-center justify-center transition-all relative ${
                isTarget && !isBox
                  ? "bg-[#FFB238]/15 border-2 border-dashed border-[#FFB238]"
                  : "bg-[#242868] border border-[#33366E]"
              }`}
            >
              {/* Player Dot */}
              {isPlayer && (
                <div className="w-4 h-4 rounded-full bg-[#34D1BF] shadow-lg shadow-[#34D1BF]/50 transform scale-110 animate-pulse" />
              )}
              {/* Box */}
              {isBox && (
                <div
                  className={`w-full h-full rounded-lg m-1 shadow-md flex items-center justify-center font-bold text-xs transition-all ${
                    solved ? "bg-[#34D1BF] text-[#12143A]" : "bg-[#FF7A6B] text-[#12143A]"
                  }`}
                >
                  {solved ? "✓" : "📦"}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {solved ? (
        <div className="mt-4 p-3 rounded-xl bg-[#34D1BF]/15 border border-[#34D1BF]/40 text-[#34D1BF] text-xs font-semibold flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Crate Delivered! Moving to 2048 Challenge...</span>
        </div>
      ) : (
        /* D-Pad Controls */
        <div className="flex flex-col items-center gap-1.5 mt-5">
          <button
            onClick={() => move(-1, 0)}
            className="w-11 h-11 rounded-xl bg-[#242868] hover:bg-[#33366E] active:scale-95 text-[#F5F3ED] flex items-center justify-center border border-[#33366E] shadow-sm"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <div className="flex gap-1.5">
            <button
              onClick={() => move(0, -1)}
              className="w-11 h-11 rounded-xl bg-[#242868] hover:bg-[#33366E] active:scale-95 text-[#F5F3ED] flex items-center justify-center border border-[#33366E] shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => move(1, 0)}
              className="w-11 h-11 rounded-xl bg-[#242868] hover:bg-[#33366E] active:scale-95 text-[#F5F3ED] flex items-center justify-center border border-[#33366E] shadow-sm"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => move(0, 1)}
              className="w-11 h-11 rounded-xl bg-[#242868] hover:bg-[#33366E] active:scale-95 text-[#F5F3ED] flex items-center justify-center border border-[#33366E] shadow-sm"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
