import { useEffect, useState } from 'react';

interface RadarChartProps {
  skills: { skill: string; score: number }[];
  size?: number;
  color?: string;
  fillColor?: string;
}

export function RadarChart({ skills, size = 320, color = '#0d9488', fillColor = 'rgba(20, 184, 166, 0.15)' }: RadarChartProps) {
  const [animated, setAnimated] = useState(false);
  const center = size / 2;
  const radius = size / 2 - 50;
  const n = skills.length;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (n < 3) return null;

  function getPoint(index: number, value: number) {
    const angle = (index / n) * Math.PI * 2 - Math.PI / 2;
    const r = (value / 100) * radius * (animated ? 1 : 0);
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  }

  function getLabelPoint(index: number) {
    const angle = (index / n) * Math.PI * 2 - Math.PI / 2;
    const r = radius + 28;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  }

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1.0];

  // Axes
  const axes = Array.from({ length: n }, (_, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  });

  // Data polygon
  const dataPoints = skills.map((s, i) => getPoint(i, s.score));
  const dataPath = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <svg width={size} height={size} className="overflow-visible">
      {/* Grid rings */}
      {rings.map((ring, i) => {
        const ringPoints = Array.from({ length: n }, (_, j) => {
          const angle = (j / n) * Math.PI * 2 - Math.PI / 2;
          return `${center + radius * ring * Math.cos(angle)},${center + radius * ring * Math.sin(angle)}`;
        }).join(' ');
        return (
          <polygon
            key={i}
            points={ringPoints}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        );
      })}

      {/* Axes */}
      {axes.map((p, i) => (
        <line
          key={i}
          x1={center}
          y1={center}
          x2={p.x}
          y2={p.y}
          stroke="#e2e8f0"
          strokeWidth="1"
        />
      ))}

      {/* Data area */}
      <polygon
        points={dataPath}
        fill={fillColor}
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        className="transition-all duration-1000 ease-out"
      />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="4"
          fill={color}
          className="transition-all duration-1000 ease-out"
        />
      ))}

      {/* Labels */}
      {skills.map((s, i) => {
        const lp = getLabelPoint(i);
        const isLeft = lp.x < center - 10;
        const isRight = lp.x > center + 10;
        const anchor = isLeft ? 'end' : isRight ? 'start' : 'middle';
        return (
          <text
            key={i}
            x={lp.x}
            y={lp.y}
            textAnchor={anchor}
            dominantBaseline="middle"
            className="text-[10px] font-semibold fill-ink-600"
          >
            {s.skill.length > 18 ? s.skill.slice(0, 16) + '…' : s.skill}
          </text>
        );
      })}
    </svg>
  );
}
