import React, { useState } from "react";
import { Sparkles, ArrowRight, BookOpen, GraduationCap, Building2, User } from "lucide-react";

export default function Onboarding({ onComplete }) {
  const [name, setName] = useState("");
  const [year, setYear] = useState("3");
  const [college, setCollege] = useState("");
  const [stream, setStream] = useState("Computer Science");

  const streams = [
    "Computer Science / IT",
    "Electronics & Comm (ECE)",
    "Electrical / Mech / Civil",
    "Data Science & AI",
    "Commerce & Business",
    "Arts / Humanities / Design",
    "Other Stream"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onComplete({
      name: name.trim(),
      year,
      college: college.trim() || "National Institute of Technology",
      stream
    });
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-[#1B1E52] border border-[#33366E] rounded-2xl p-6 sm:p-8 shadow-2xl shadow-[#12143A]/80 animate-fade-in">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FFB238] to-[#FF7A6B] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#FFB238]/20">
          <Sparkles className="w-7 h-7 text-[#12143A]" />
        </div>
        <h2 className="text-2xl font-bold text-[#F5F3ED] font-heading">
          Discover Your True Career Fit
        </h2>
        <p className="text-sm text-[#9497C9] mt-1.5 max-w-sm mx-auto">
          No boring forms or fake self-ratings. Play 5 short interactive games to reveal your natural cognitive strengths.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-mono font-medium text-[#9497C9] uppercase mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#FFB238]" /> Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rahul Sharma"
            className="w-full bg-[#12143A] border border-[#33366E] rounded-xl px-4 py-3 text-sm text-[#F5F3ED] placeholder-[#9497C9]/60 focus:outline-none focus:border-[#FFB238] transition-colors"
          />
        </div>

        {/* Year of Study & Stream Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-medium text-[#9497C9] uppercase mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#34D1BF]" /> Year of Study
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-[#12143A] border border-[#33366E] rounded-xl px-4 py-3 text-sm text-[#F5F3ED] focus:outline-none focus:border-[#34D1BF] transition-colors"
            >
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year (Critical Placement Year)</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#9497C9] uppercase mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#FF7A6B]" /> College Name
            </label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="e.g. NIT Trichy"
              className="w-full bg-[#12143A] border border-[#33366E] rounded-xl px-4 py-3 text-sm text-[#F5F3ED] placeholder-[#9497C9]/60 focus:outline-none focus:border-[#FF7A6B] transition-colors"
            />
          </div>
        </div>

        {/* Stream */}
        <div>
          <label className="block text-xs font-mono font-medium text-[#9497C9] uppercase mb-1.5 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#FFB238]" /> Academic Stream / Major
          </label>
          <select
            value={stream}
            onChange={(e) => setStream(e.target.value)}
            className="w-full bg-[#12143A] border border-[#33366E] rounded-xl px-4 py-3 text-sm text-[#F5F3ED] focus:outline-none focus:border-[#FFB238] transition-colors"
          >
            {streams.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full bg-[#FFB238] hover:bg-[#FFB238]/90 text-[#12143A] font-heading font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#FFB238]/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          <span>Start Interactive Skill Quest</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-[#33366E]/60 text-center">
        <p className="text-[11px] text-[#9497C9]">
          ⚡ Takes ~15 minutes • 5 Playable Mini-Games • Technical & Non-Technical Mapping
        </p>
      </div>
    </div>
  );
}
