interface SkillBarProps {
  skill: string;
  score: number;
  maxScore?: number;
  color?: string;
  delay?: number;
  showLabel?: boolean;
}

export function SkillBar({ skill, score, color = 'bg-sq-500', delay = 0, showLabel = true }: SkillBarProps) {
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-semibold text-ink-700">{skill}</span>
          <span className="text-sm font-bold text-ink-900 tabular-nums">{score}</span>
        </div>
      )}
      <div className="h-2.5 w-full rounded-full bg-ink-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${score}%`, transitionDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
}
