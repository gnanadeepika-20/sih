import React from "react";
import { Users, Shield, TrendingUp, Award, BookOpen, BarChart2, PieChart, Download, Building } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function AdminDashboard({ user }) {
  // Mock cohort analytics for SIH hackathon demonstration
  const batchSkillData = [
    { skill: "Logic", avgScore: 78, highPerformers: 64 },
    { skill: "Problem Solving", avgScore: 82, highPerformers: 71 },
    { skill: "UI/UX & Design", avgScore: 68, highPerformers: 45 },
    { skill: "Communication", avgScore: 74, highPerformers: 58 },
    { skill: "QA & Detail", avgScore: 72, highPerformers: 52 },
  ];

  const roleDistribution = [
    { role: "Backend Dev", count: 120, percent: "28%" },
    { role: "Frontend / UI-UX", count: 85, percent: "20%" },
    { role: "Data Analyst", count: 70, percent: "16%" },
    { role: "Business Analyst", count: 60, percent: "14%" },
    { role: "Content Strategy", count: 45, percent: "11%" },
    { role: "Digital Marketing", count: 45, percent: "11%" },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-[#1B1E52] via-[#242868] to-[#1B1E52] border border-[#33366E] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#34D1BF] px-3 py-1 rounded-full bg-[#34D1BF]/15 border border-[#34D1BF]/30">
              Placement Cell & College Analytics
            </span>
            <span className="text-xs text-[#9497C9] font-mono">Academic Year 2025-2026</span>
          </div>
          <h2 className="text-2xl font-bold text-[#F5F3ED] font-heading">
            {user?.college || "National Institute of Technology"} — Talent Readiness Dashboard
          </h2>
          <p className="text-xs text-[#9497C9] mt-1">
            Aggregated Cognitive Skill Maps Across 425 Assessed Students (Pre-Placement Discovery)
          </p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-[#34D1BF] text-[#12143A] font-heading font-bold text-xs flex items-center gap-2 shadow-md shadow-[#34D1BF]/20">
          <Download className="w-4 h-4" />
          <span>Export Cohort Report (PDF)</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Assessed Students", val: "425", icon: Users, color: "text-[#34D1BF]", bg: "bg-[#34D1BF]/15" },
          { label: "Placement Readiness Index", val: "78.4%", icon: TrendingUp, color: "text-[#FFB238]", bg: "bg-[#FFB238]/15" },
          { label: "Tech Role Alignment", val: "64%", icon: Award, color: "text-[#FF7A6B]", bg: "bg-[#FF7A6B]/15" },
          { label: "Non-Tech Alignment", val: "36%", icon: BookOpen, color: "text-[#34D1BF]", bg: "bg-[#34D1BF]/15" },
        ].map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-[#1B1E52] border border-[#33366E] rounded-2xl p-4 shadow-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#9497C9]">{m.label}</span>
                <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${m.color}`} />
                </div>
              </div>
              <p className={`text-2xl font-bold font-mono ${m.color}`}>{m.val}</p>
            </div>
          );
        })}
      </div>

      {/* Chart & Distribution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Batch Average Skill Scores Chart */}
        <div className="bg-[#1B1E52] border border-[#33366E] rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#F5F3ED] font-heading flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#FFB238]" /> Cohort Average Skill Scores
            </h3>
            <span className="text-[11px] font-mono text-[#9497C9]">Batch Average</span>
          </div>

          <div className="w-full h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={batchSkillData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#33366E" />
                <XAxis dataKey="skill" tick={{ fill: "#9497C9", fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "#9497C9", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#12143A", borderColor: "#33366E", color: "#F5F3ED" }}
                />
                <Bar dataKey="avgScore" fill="#34D1BF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Role Distribution Breakdown */}
        <div className="bg-[#1B1E52] border border-[#33366E] rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#F5F3ED] font-heading flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#FF7A6B]" /> Recommended Track Distribution
            </h3>
            <span className="text-[11px] font-mono text-[#9497C9]">12 Roles</span>
          </div>

          <div className="space-y-3 pt-2">
            {roleDistribution.map((rd) => (
              <div key={rd.role} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#F5F3ED] font-semibold">{rd.role}</span>
                  <span className="text-[#FFB238] font-bold">
                    {rd.count} Students ({rd.percent})
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#12143A] overflow-hidden border border-[#33366E]">
                  <div
                    className="h-full bg-gradient-to-r from-[#34D1BF] to-[#FFB238]"
                    style={{ width: rd.percent }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
