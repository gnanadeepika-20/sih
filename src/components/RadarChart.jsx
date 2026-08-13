import React from "react";
import {
  RadarChart as RechartsRadar,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

export default function RadarChart({ scores }) {
  const data = [
    { skill: "Logic", value: scores.logic || 75 },
    { skill: "Problem", value: scores.problem || 80 },
    { skill: "UI/UX", value: scores.ui || 70 },
    { skill: "Comm", value: scores.comm || 85 },
    { skill: "QA/Detail", value: scores.qa || 75 },
  ];

  return (
    <div className="w-full h-full min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadar data={data} outerRadius="68%">
          <PolarGrid stroke="#33366E" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: "#9497C9", fontSize: 12, fontWeight: 600, fontFamily: "JetBrains Mono" }}
          />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Skill Signature"
            dataKey="value"
            stroke="#FFB238"
            fill="#FFB238"
            fillOpacity={0.35}
            strokeWidth={2.5}
          />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  );
}
