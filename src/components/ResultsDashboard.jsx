import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Trophy, Sparkles, ChevronRight, CheckCircle2, RotateCcw, Compass, ArrowRight, Share2 } from "lucide-react";
import RadarChart from "./RadarChart";
import { calculateRecommendations } from "../data/roles";
import RoadmapModal from "./RoadmapModal";

export default function ResultsDashboard({ scores, user, onRestart }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // all -> tech -> nontech

  const recommendations = calculateRecommendations(scores);
  const top3 = recommendations.slice(0, 3);
  const filteredRoles =
    activeTab === "tech"
      ? recommendations.filter((r) => r.track === "tech")
      : activeTab === "nontech"
      ? recommendations.filter((r) => r.track === "nontech")
      : recommendations;

  // Fire celebratory confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FFB238", "#34D1BF", "#FF7A6B"],
      });
    } catch (e) {
      // fallback if confetti fails
    }
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1B1E52] via-[#242868] to-[#1B1E52] border border-[#33366E] rounded-2xl p-6 text-center relative overflow-hidden shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFB238] to-[#FF7A6B] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#FFB238]/30">
          <Trophy className="w-7 h-7 text-[#12143A]" />
        </div>

        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#34D1BF] px-3 py-1 rounded-full bg-[#34D1BF]/15 border border-[#34D1BF]/30 mb-2 inline-block">
          Skill Signature Verified
        </span>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F3ED] font-heading">
          {user?.name ? `${user.name}'s Cognitive Fit Profile` : "Your Cognitive Fit Profile"}
        </h2>

        <p className="text-xs sm:text-sm text-[#9497C9] mt-1.5 max-w-md mx-auto">
          Evaluated from real mini-game metrics — zero self-rated bias.
        </p>
      </div>

      {/* Grid: Radar Chart + Score Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Radar Chart Card */}
        <div className="bg-[#1B1E52] border border-[#33366E] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-[#F5F3ED] font-heading flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFB238]" /> Radar Skill Signature
            </h3>
            <span className="text-[11px] font-mono text-[#9497C9]">5 Core Aptitudes</span>
          </div>

          <div className="w-full h-56 my-auto">
            <RadarChart scores={scores} />
          </div>

          <p className="text-xs text-[#9497C9] text-center pt-2 border-t border-[#33366E]/50">
            Top Natural Trait:{" "}
            <strong className="text-[#FFB238] font-heading">
              {scores.logic >= scores.problem && scores.logic >= scores.ui
                ? "Logical Strategist"
                : scores.problem >= scores.ui && scores.problem >= scores.comm
                ? "Analytical Problem Solver"
                : scores.ui >= scores.comm
                ? "UI/UX & Creative Architect"
                : "Signal Communicator"}
            </strong>
          </p>
        </div>

        {/* Right: Scores Breakdown */}
        <div className="bg-[#1B1E52] border border-[#33366E] rounded-2xl p-5 shadow-lg space-y-3">
          <h3 className="text-sm font-bold text-[#F5F3ED] font-heading mb-3">
            In-Game Skill Metrics (0-100)
          </h3>

          {[
            { label: "Logical Thinking", val: scores.logic, color: "bg-[#34D1BF]", text: "text-[#34D1BF]" },
            { label: "Problem Solving & Debugging", val: scores.problem, color: "bg-[#FFB238]", text: "text-[#FFB238]" },
            { label: "UI/UX & Spatial Creativity", val: scores.ui, color: "bg-[#FF7A6B]", text: "text-[#FF7A6B]" },
            { label: "Communication & Signal", val: scores.comm, color: "bg-[#34D1BF]", text: "text-[#34D1BF]" },
            { label: "Attention to Detail / QA", val: scores.qa, color: "bg-[#FFB238]", text: "text-[#FFB238]" },
          ].map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#9497C9]">{item.label}</span>
                <span className={`font-bold ${item.text}`}>{item.val || 0} / 100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#12143A] overflow-hidden border border-[#33366E]">
                <div
                  className={`h-full rounded-full ${item.color} transition-all duration-1000`}
                  style={{ width: `${item.val || 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top 3 Career Matches */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#F5F3ED] font-heading">
              Top Recommended Career Paths
            </h3>
            <p className="text-xs text-[#9497C9]">
              Mapped mathematically to role requirements (Technical & Non-Technical)
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex bg-[#12143A] p-1 rounded-xl border border-[#33366E] text-xs">
            {["all", "tech", "nontech"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-lg font-semibold uppercase font-mono transition-all ${
                  activeTab === tab
                    ? "bg-[#FFB238] text-[#12143A]"
                    : "text-[#9497C9] hover:text-[#F5F3ED]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Roles List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {top3.map((role, idx) => (
            <div
              key={role.id}
              className="bg-[#1B1E52] border border-[#33366E] rounded-2xl p-5 flex flex-col justify-between hover:border-[#FFB238]/60 transition-all group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide ${
                      role.track === "tech"
                        ? "bg-[#34D1BF]/15 text-[#34D1BF] border border-[#34D1BF]/30"
                        : "bg-[#FF7A6B]/15 text-[#FF7A6B] border border-[#FF7A6B]/30"
                    }`}
                  >
                    {role.track === "tech" ? "Technical" : "Non-Technical"}
                  </span>
                  <span className="text-sm font-mono font-extrabold text-[#FFB238]">
                    {role.matchPercent}% Match
                  </span>
                </div>

                <h4 className="text-base font-bold text-[#F5F3ED] font-heading group-hover:text-[#FFB238] transition-colors">
                  {role.name}
                </h4>

                <p className="text-xs text-[#9497C9] mt-2 line-clamp-2">{role.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#33366E]/60 space-y-3">
                <div className="flex flex-wrap gap-1">
                  {role.topSkills.slice(0, 2).map((sk) => (
                    <span
                      key={sk}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#12143A] text-[#9497C9] border border-[#33366E]"
                    >
                      {sk}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedRole(role)}
                  className="w-full bg-[#FFB238] hover:bg-[#FFB238]/90 text-[#12143A] text-xs font-heading font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-[#FFB238]/20 transition-all active:scale-95"
                >
                  <span>Show me how to get there</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Roles Explorer Table */}
      <div className="bg-[#1B1E52] border border-[#33366E] rounded-2xl p-5 shadow-lg space-y-3">
        <h3 className="text-sm font-bold text-[#F5F3ED] font-heading">
          All 12 Role Fits Across Tech & Non-Tech
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#33366E] text-[#9497C9] font-mono">
                <th className="p-3 uppercase">Career Role</th>
                <th className="p-3 uppercase">Track</th>
                <th className="p-3 uppercase">Match Score</th>
                <th className="p-3 uppercase">Avg. Salary</th>
                <th className="p-3 uppercase text-right">Roadmap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#33366E]/40 font-mono">
              {filteredRoles.map((r) => (
                <tr key={r.id} className="hover:bg-[#242868]/60 transition-colors">
                  <td className="p-3 font-semibold text-[#F5F3ED]">{r.name}</td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded ${
                        r.track === "tech" ? "text-[#34D1BF] bg-[#34D1BF]/10" : "text-[#FF7A6B] bg-[#FF7A6B]/10"
                      }`}
                    >
                      {r.track === "tech" ? "Technical" : "Non-Tech"}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-[#FFB238]">{r.matchPercent}%</td>
                  <td className="p-3 text-[#9497C9]">{r.avgSalary}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedRole(r)}
                      className="text-xs text-[#34D1BF] hover:underline flex items-center justify-end gap-1 ml-auto"
                    >
                      <span>View Roadmap</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <button
          onClick={onRestart}
          className="px-5 py-3 rounded-xl bg-[#242868] hover:bg-[#33366E] text-[#F5F3ED] text-xs font-mono font-semibold flex items-center gap-2 border border-[#33366E] transition-all"
        >
          <RotateCcw className="w-4 h-4 text-[#FF7A6B]" />
          <span>Retake Assessment</span>
        </button>

        <p className="text-xs text-[#9497C9] text-center">
          SkillQuest System v2.0 • Ready for Placement Season discovery
        </p>
      </div>

      {/* Roadmap Modal */}
      {selectedRole && (
        <RoadmapModal role={selectedRole} onClose={() => setSelectedRole(null)} />
      )}
    </div>
  );
}
