import React, { useState } from "react";
import { X, BookOpen, ExternalLink, CheckSquare, Target, Calendar, Download, Sparkles } from "lucide-react";
import { getRoadmap } from "../data/roadmaps";

export default function RoadmapModal({ role, onClose }) {
  const [durationKey, setDurationKey] = useState("3_months");
  const [copied, setCopied] = useState(false);

  if (!role) return null;

  const milestones = getRoadmap(role.name, durationKey);

  const handleCopyRoadmap = () => {
    const text = milestones
      .map(
        (m) =>
          `[${m.phase}]: ${m.title}\nFocus: ${m.topics.join(", ")}\nProject: ${
            m.project
          }\nInterview Prep: ${m.interviewPrep}\n`
      )
      .join("\n");
    navigator.clipboard.writeText(`SkillQuest Roadmap for ${role.name} (${durationKey})\n\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#12143A]/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#1B1E52] border border-[#33366E] rounded-t-2xl sm:rounded-2xl p-5 sm:p-7 max-h-[85vh] overflow-y-auto shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#33366E]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FFB238] px-2 py-0.5 rounded bg-[#FFB238]/15 border border-[#FFB238]/30">
                Personalized Career Roadmap
              </span>
              <span className="text-xs text-[#9497C9] font-mono">{role.avgSalary}</span>
            </div>
            <h2 className="text-xl font-bold text-[#F5F3ED] font-heading">{role.name}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#242868] text-[#9497C9] hover:text-[#F5F3ED] border border-[#33366E]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timeline Selector */}
        <div className="flex items-center justify-between bg-[#12143A] p-1.5 rounded-xl border border-[#33366E]">
          <span className="text-xs font-mono font-semibold text-[#9497C9] ml-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#34D1BF]" /> Target Timeline:
          </span>
          <div className="flex gap-1">
            {[
              { id: "3_months", label: "3 Months (Fast)" },
              { id: "6_months", label: "6 Months (Deep)" },
              { id: "12_months", label: "12 Months (Mastery)" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setDurationKey(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  durationKey === t.id
                    ? "bg-[#FFB238] text-[#12143A] shadow-md"
                    : "text-[#9497C9] hover:text-[#F5F3ED]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Milestones List */}
        <div className="space-y-4">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="bg-[#12143A] border border-[#33366E] rounded-xl p-4 space-y-3 relative overflow-hidden group hover:border-[#FFB238]/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#34D1BF] px-2.5 py-0.5 rounded bg-[#34D1BF]/15 border border-[#34D1BF]/30">
                  {m.phase}
                </span>
                <span className="text-[11px] text-[#9497C9] font-mono">Milestone {idx + 1}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#F5F3ED] font-heading">{m.title}</h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {m.topics.map((top, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#242868] text-[#9497C9] border border-[#33366E]"
                    >
                      • {top}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resources */}
              {m.resources && m.resources.length > 0 && (
                <div className="pt-2 border-t border-[#33366E]/50">
                  <span className="text-[11px] font-mono text-[#9497C9] uppercase block mb-1.5">
                    Curated Free Learning Links:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {m.resources.map((res, rIdx) => (
                      <a
                        key={rIdx}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono text-[#34D1BF] hover:underline bg-[#34D1BF]/10 px-2.5 py-1 rounded-lg border border-[#34D1BF]/30 flex items-center gap-1"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>{res.name}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Portfolio Project */}
              <div className="bg-[#242868]/50 p-2.5 rounded-lg border border-[#33366E] text-xs">
                <span className="font-semibold text-[#FFB238] flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-[#FFB238]" /> Project to Build:
                </span>
                <p className="text-[#F5F3ED]/90 mt-0.5">{m.project}</p>
              </div>

              {/* Interview Focus */}
              <div className="text-[11px] text-[#9497C9] flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-[#34D1BF]" />
                <span>Interview Focus: {m.interviewPrep}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-[#33366E] flex items-center justify-between">
          <button
            onClick={handleCopyRoadmap}
            className="px-4 py-2.5 rounded-xl bg-[#242868] hover:bg-[#33366E] text-[#F5F3ED] text-xs font-mono font-semibold flex items-center gap-2 border border-[#33366E]"
          >
            <Download className="w-4 h-4 text-[#34D1BF]" />
            <span>{copied ? "Copied to Clipboard!" : "Export / Copy Plan"}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#FFB238] hover:bg-[#FFB238]/90 text-[#12143A] text-xs font-heading font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
