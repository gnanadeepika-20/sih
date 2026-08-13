import React, { useState } from "react";
import { Code2, AlertTriangle, CheckCircle2, ArrowRight, HelpCircle } from "lucide-react";
import { DEBUG_ROUNDS } from "../../data/gameData";

export default function DebugDetective({ onComplete }) {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [selectedLine, setSelectedLine] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentRound = DEBUG_ROUNDS[currentRoundIdx];

  const handleLineClick = (lineIdx) => {
    if (showFeedback) return;

    setSelectedLine(lineIdx);
    setShowFeedback(true);
    const isRight = lineIdx === currentRound.bugLine;
    if (isRight) setCorrectCount((c) => c + 1);

    setTimeout(() => {
      if (currentRoundIdx < DEBUG_ROUNDS.length - 1) {
        setCurrentRoundIdx((i) => i + 1);
        setSelectedLine(null);
        setShowFeedback(false);
      } else {
        const finalCorrect = isRight ? correctCount + 1 : correctCount;
        const score = Math.round((finalCorrect / DEBUG_ROUNDS.length) * 100);
        onComplete(score);
      }
    }, 1800);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-[#1B1E52] border border-[#33366E] rounded-2xl p-5 sm:p-7 animate-fade-in shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#33366E]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#FFB238]/20 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-[#FFB238]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F5F3ED] font-heading">
              Game 2: Debug Detective
            </h3>
            <p className="text-xs text-[#9497C9]">Spot the hidden logical or syntax bug</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#242868] text-[#34D1BF] border border-[#33366E]">
          Round {currentRoundIdx + 1} / {DEBUG_ROUNDS.length}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#FFB238] uppercase font-mono tracking-wider">
            {currentRound.title}
          </span>
          <span className="text-[11px] text-[#9497C9] px-2 py-0.5 rounded bg-[#12143A]">
            Difficulty: {currentRound.difficulty}
          </span>
        </div>
        <p className="text-xs text-[#9497C9] mt-1">
          Inspect the code snippet below and <strong className="text-[#F5F3ED]">tap the exact line</strong> that breaks the function.
        </p>
      </div>

      {/* Code Editor Frame */}
      <div className="bg-[#12143A] rounded-xl border border-[#33366E] overflow-hidden mb-4 shadow-inner">
        <div className="bg-[#1B1E52] px-4 py-2 border-b border-[#33366E] flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF7A6B]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFB238]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#34D1BF]" />
          <span className="text-xs font-mono text-[#9497C9] ml-2">solution.js</span>
        </div>

        <div className="p-3 font-mono text-xs sm:text-sm space-y-1">
          {currentRound.lines.map((line, idx) => {
            const isSelected = selectedLine === idx;
            const isTargetBug = showFeedback && idx === currentRound.bugLine;

            return (
              <button
                key={idx}
                onClick={() => handleLineClick(idx)}
                disabled={showFeedback}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-all duration-200 ${
                  isTargetBug
                    ? "bg-[#FF7A6B]/25 border-l-4 border-[#FF7A6B] text-[#F5F3ED] font-semibold"
                    : isSelected
                    ? "bg-[#FFB238]/20 border-l-4 border-[#FFB238] text-[#F5F3ED]"
                    : "hover:bg-[#242868] text-[#9497C9] hover:text-[#F5F3ED]"
                }`}
              >
                <span className="text-[#9497C9]/60 select-none w-5 text-right font-mono text-xs">
                  {idx + 1}
                </span>
                <span className="whitespace-pre flex-1">{line}</span>
                {isTargetBug && (
                  <AlertTriangle className="w-4 h-4 text-[#FF7A6B] shrink-0 animate-bounce" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Panel */}
      {showFeedback && (
        <div
          className={`p-4 rounded-xl border text-xs animate-fade-in ${
            selectedLine === currentRound.bugLine
              ? "bg-[#34D1BF]/15 border-[#34D1BF]/40 text-[#34D1BF]"
              : "bg-[#FF7A6B]/15 border-[#FF7A6B]/40 text-[#FF7A6B]"
          }`}
        >
          <div className="flex items-center gap-2 font-bold mb-1">
            {selectedLine === currentRound.bugLine ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#34D1BF]" />
                <span>Sharp Eye! Bug Identified Correctly.</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-[#FF7A6B]" />
                <span>Missed Bug on Line {currentRound.bugLine + 1}</span>
              </>
            )}
          </div>
          <p className="text-[#F5F3ED]/90 mt-1">{currentRound.explanation}</p>
          <div className="mt-2 font-mono text-[11px] bg-[#12143A] p-2 rounded text-[#34D1BF] border border-[#33366E]">
            Suggested Fix: {currentRound.fixedLine}
          </div>
        </div>
      )}
    </div>
  );
}
