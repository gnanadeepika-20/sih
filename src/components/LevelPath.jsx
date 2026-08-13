import React from "react";
import { Brain, Code2, Palette, MessageSquare, ShieldCheck, Trophy, CheckCircle2 } from "lucide-react";

export const LEVELS = [
  { id: "game1", label: "Logic", icon: Brain, description: "Sokoban & 2048" },
  { id: "game2", label: "Debug", icon: Code2, description: "Problem Solving" },
  { id: "game3", label: "Design", icon: Palette, description: "UI/UX & Sandbox" },
  { id: "game4", label: "Signal", icon: MessageSquare, description: "Communication" },
  { id: "game5", label: "QA Spotter", icon: ShieldCheck, description: "Detail & Anomaly" },
  { id: "results", label: "Results", icon: Trophy, description: "Skill Signature" },
];

export default function LevelPath({ currentStep }) {
  const currentIdx = LEVELS.findIndex((l) => l.id === currentStep);

  return (
    <div className="w-full bg-[#1B1E52]/60 border-b border-[#33366E] py-4 px-4 overflow-x-auto">
      <div className="max-w-4xl mx-auto flex items-center justify-between min-w-[550px]">
        {LEVELS.map((lvl, idx) => {
          const Icon = lvl.icon;
          const isDone = idx < currentIdx;
          const isActive = idx === currentIdx;

          return (
            <React.Fragment key={lvl.id}>
              <div className="flex flex-col items-center gap-1.5 group cursor-default">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isDone
                      ? "border-[#34D1BF] bg-[#34D1BF]/15 text-[#34D1BF]"
                      : isActive
                      ? "border-[#FFB238] bg-[#FFB238] text-[#12143A] shadow-lg shadow-[#FFB238]/30 scale-110"
                      : "border-[#33366E] bg-[#1B1E52] text-[#9497C9]"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-[#34D1BF]" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div className="text-center">
                  <span
                    className={`block text-[11px] font-mono font-semibold uppercase tracking-wider ${
                      isActive ? "text-[#FFB238]" : isDone ? "text-[#34D1BF]" : "text-[#9497C9]"
                    }`}
                  >
                    {lvl.label}
                  </span>
                  <span className="text-[10px] text-[#9497C9]/80 block hidden sm:block">
                    {lvl.description}
                  </span>
                </div>
              </div>

              {idx < LEVELS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 transition-colors duration-300 ${
                    idx < currentIdx ? "bg-[#34D1BF]" : "bg-[#33366E]"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
