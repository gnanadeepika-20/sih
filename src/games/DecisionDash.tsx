import { useState, useEffect, useRef, useCallback } from 'react';
import type { GameComponentProps } from './types';
import { calculateGameStats } from './types';

const TOTAL_ROUNDS = 10;

interface DecisionScenario {
  situation: string;
  options: { text: string; value: number; optimal: boolean }[];
}

const SCENARIOS: DecisionScenario[] = [
  {
    situation: 'You\'re leading a team with a tight deadline. One member is struggling. What do you do?',
    options: [
      { text: 'Reassign their work to others silently', value: 60, optimal: false },
      { text: 'Talk to them, offer help, adjust tasks', value: 95, optimal: true },
      { text: 'Report them to management', value: 40, optimal: false },
      { text: 'Do their work yourself', value: 55, optimal: false },
    ],
  },
  {
    situation: 'You have 3 urgent tasks. Which do you prioritize?',
    options: [
      { text: 'The one with the nearest deadline', value: 70, optimal: false },
      { text: 'The one with highest impact + deadline', value: 95, optimal: true },
      { text: 'The easiest one first', value: 45, optimal: false },
      { text: 'The one your boss asked about last', value: 50, optimal: false },
    ],
  },
  {
    situation: 'A client wants a feature that will delay the project by 2 weeks. What do you do?',
    options: [
      { text: 'Say yes immediately to please them', value: 35, optimal: false },
      { text: 'Say no — stick to the plan', value: 60, optimal: false },
      { text: 'Propose a phased approach: ship now, add later', value: 95, optimal: true },
      { text: 'Ask the team to work weekends', value: 30, optimal: false },
    ],
  },
  {
    situation: 'You disagree with your manager\'s strategy. What do you do?',
    options: [
      { text: 'Stay quiet and follow orders', value: 40, optimal: false },
      { text: 'Argue publicly in the meeting', value: 35, optimal: false },
      { text: 'Schedule a 1:1 to share your perspective with data', value: 95, optimal: true },
      { text: 'Complain to coworkers', value: 20, optimal: false },
    ],
  },
  {
    situation: 'Your project budget is cut by 30%. What\'s your first move?',
    options: [
      { text: 'Cut the team\'s tools and perks', value: 30, optimal: false },
      { text: 'Re-prioritize features by ROI', value: 95, optimal: true },
      { text: 'Ask for more budget immediately', value: 50, optimal: false },
      { text: 'Reduce quality across the board', value: 25, optimal: false },
    ],
  },
  {
    situation: 'Two team members are in conflict. How do you handle it?',
    options: [
      { text: 'Ignore it — they\'ll figure it out', value: 25, optimal: false },
      { text: 'Pick a side based on who\'s right', value: 45, optimal: false },
      { text: 'Facilitate a conversation between them', value: 95, optimal: true },
      { text: 'Report both to HR', value: 35, optimal: false },
    ],
  },
  {
    situation: 'You discover a major bug right before launch. What do you do?',
    options: [
      { text: 'Ship anyway, fix it later', value: 30, optimal: false },
      { text: 'Delay launch, fix it properly', value: 85, optimal: false },
      { text: 'Assess severity, communicate, decide together', value: 95, optimal: true },
      { text: 'Quietly fix it without telling anyone', value: 40, optimal: false },
    ],
  },
  {
    situation: 'You\'re offered a promotion that means less hands-on work. What do you consider?',
    options: [
      { text: 'Take it immediately — it\'s a promotion', value: 50, optimal: false },
      { text: 'Decline — you love hands-on work', value: 55, optimal: false },
      { text: 'Evaluate growth path, skills needed, and long-term goals', value: 95, optimal: true },
      { text: 'Ask for more money first', value: 40, optimal: false },
    ],
  },
];

export function DecisionDash({ onComplete, onRoundChange }: GameComponentProps) {
  const [round, setRound] = useState(0);
  const [startTime] = useState(Date.now());
  const [correct, setCorrect] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [scenarioIdx, setScenarioIdx] = useState(() => Math.floor(Math.random() * SCENARIOS.length));
  const [usedScenarios, setUsedScenarios] = useState<Set<number>>(new Set([scenarioIdx]));
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scenario = SCENARIOS[scenarioIdx];

  const handleAnswer = useCallback((idx: number) => {
    if (locked) return;
    setLocked(true);
    setSelectedIdx(idx);
    if (timerRef.current) clearInterval(timerRef.current);

    const option = scenario.options[idx];
    if (option.optimal) {
      setCorrect(c => c + 1);
      setDifficulty(d => Math.min(8, d + 1));
    } else {
      setMistakes(m => m + 1);
    }

    setTimeout(() => {
      setSelectedIdx(null);
      setLocked(false);
      setTimeLeft(15);
      setRound(r => r + 1);
    }, 2000);
  }, [scenario, locked]);

  // Timer
  useEffect(() => {
    if (locked) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setMistakes(m => m + 1);
          setLocked(true);
          setTimeout(() => {
            setSelectedIdx(null);
            setLocked(false);
            setTimeLeft(15);
            setRound(r => r + 1);
          }, 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [round, locked]);

  useEffect(() => {
    if (round >= TOTAL_ROUNDS) {
      const stats = calculateGameStats(TOTAL_ROUNDS, correct, mistakes, startTime, difficulty);
      onComplete(stats);
    } else {
      let next: number;
      do {
        next = Math.floor(Math.random() * SCENARIOS.length);
      } while (usedScenarios.has(next) && usedScenarios.size < SCENARIOS.length);
      setScenarioIdx(next);
      setUsedScenarios(prev => new Set([...prev, next]));
    }
  }, [round]);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      {/* Timer */}
      <div className="mb-6 w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-ink-500">Decision time</span>
          <span className={`text-lg font-extrabold tabular-nums ${timeLeft <= 5 ? 'text-coral-600' : 'text-sq-600'}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-linear ${
              timeLeft <= 5 ? 'bg-coral-500' : 'bg-sq-500'
            }`}
            style={{ width: `${(timeLeft / 15) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-6 text-center">
        <p className="text-lg font-bold text-ink-900 text-balance">{scenario.situation}</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3 w-full">
        {scenario.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            disabled={locked}
            className={`p-4 rounded-2xl border-2 transition-all text-left font-semibold text-ink-700 disabled:opacity-50 ${
              locked && i === selectedIdx
                ? option.optimal
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                  : 'border-coral-400 bg-coral-50 text-coral-700'
                : locked && option.optimal
                ? 'border-emerald-400 bg-emerald-50'
                : 'border-ink-200 hover:border-sq-400 hover:bg-sq-50'
            }`}
          >
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-ink-100 text-ink-600 text-sm font-bold mr-3">
              {String.fromCharCode(65 + i)}
            </span>
            {option.text}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {locked && selectedIdx !== null && (
        <div className={`mt-6 px-5 py-3 rounded-xl font-semibold text-sm animate-fade-in ${
          scenario.options[selectedIdx].optimal ? 'bg-emerald-50 text-emerald-700' : 'bg-coral-50 text-coral-700'
        }`}>
          {scenario.options[selectedIdx].optimal
            ? 'Excellent strategic choice!'
            : 'There was a more strategic option. Consider the long-term impact.'}
        </div>
      )}
    </div>
  );
}
