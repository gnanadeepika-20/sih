import React from "react";
import { Rocket, Shield, RefreshCw, UserCheck, Sparkles } from "lucide-react";

export default function Header({ user, mode, setMode, onResetAssessment }) {
  return (
    <header className="w-full border-b border-[#33366E] bg-[#1B1E52]/90 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setMode("student")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFB238] to-[#FF7A6B] flex items-center justify-center shadow-lg shadow-[#FFB238]/20">
            <Rocket className="w-5 h-5 text-[#12143A]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#F5F3ED] tracking-tight font-heading">
                SkillQuest
              </h1>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#FFB238]/15 text-[#FFB238] border border-[#FFB238]/30">
                v2.0 SIH
              </span>
            </div>
            <p className="text-xs text-[#9497C9]">Discover Natural Strengths Through Play</p>
          </div>
        </div>

        {/* User Info & Mode Switcher */}
        <div className="flex items-center gap-3">
          {user && user.name && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#242868] border border-[#33366E]">
              <UserCheck className="w-4 h-4 text-[#34D1BF]" />
              <div className="text-xs">
                <span className="font-semibold text-[#F5F3ED]">{user.name}</span>
                <span className="text-[#9497C9] ml-1.5">
                  ({user.year ? `${user.year} yr` : "Student"} • {user.stream || "Tech"})
                </span>
              </div>
            </div>
          )}

          {/* Mode Selector Toggle */}
          <div className="flex items-center bg-[#12143A] p-1 rounded-xl border border-[#33366E]">
            <button
              onClick={() => setMode("student")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                mode === "student"
                  ? "bg-[#FFB238] text-[#12143A] shadow-md shadow-[#FFB238]/20"
                  : "text-[#9497C9] hover:text-[#F5F3ED]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>
            <button
              onClick={() => setMode("admin")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                mode === "admin"
                  ? "bg-[#34D1BF] text-[#12143A] shadow-md shadow-[#34D1BF]/20"
                  : "text-[#9497C9] hover:text-[#F5F3ED]"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Placement Cell</span>
            </button>
          </div>

          {/* Reset Button */}
          {user && (
            <button
              onClick={onResetAssessment}
              title="Restart Assessment"
              className="p-2 rounded-xl bg-[#242868] text-[#9497C9] hover:text-[#FF7A6B] hover:border-[#FF7A6B]/50 border border-[#33366E] transition-all"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
