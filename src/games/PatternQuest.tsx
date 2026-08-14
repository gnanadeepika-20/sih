import { useState, useEffect, useCallback } from 'react';
import type { GameComponentProps } from './types';
import { calculateGameStats } from './types';

const TOTAL_ROUNDS = 8;

const SHAPES = ['circle', 'square', 'triangle', 'diamond', 'star', 'hexagon'];
const COLORS = ['#0d9488', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

interface SequenceItem {
  shape: string;
  color: string;
}

interface SequenceData {
  sequence: SequenceItem[];
  answer: number; // correct option index
  options: SequenceItem[];
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function generateSequence(round: number): SequenceData {
  const length = 3 + Math.min(round, 4);
  const pattern = Math.floor(Math.random() * 3);
  const sequence: SequenceItem[] = [];

  if (pattern === 0) {
    // Color cycling: same shape, cycling colors
    const baseShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    for (let i = 0; i < length; i++) {
      sequence.push({ shape: baseShape, color: COLORS[i % COLORS.length] });
    }
    const nextColorIdx = length % COLORS.length;
    const correct: SequenceItem = { shape: baseShape, color: COLORS[nextColorIdx] };
    const distractors: SequenceItem[] = [];
    for (let i = 0; i < 3; i++) {
      const wrongIdx = (nextColorIdx + i + 1) % COLORS.length;
      distractors.push({ shape: baseShape, color: COLORS[wrongIdx] });
    }
    const options = shuffle([correct, ...distractors]);
    return { sequence, answer: options.indexOf(correct), options };
  } else if (pattern === 1) {
    // Shape cycling: same color, cycling shapes
    const baseColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    for (let i = 0; i < length; i++) {
      sequence.push({ shape: SHAPES[i % SHAPES.length], color: baseColor });
    }
    const nextShapeIdx = length % SHAPES.length;
    const correct: SequenceItem = { shape: SHAPES[nextShapeIdx], color: baseColor };
    const distractors: SequenceItem[] = [];
    for (let i = 0; i < 3; i++) {
      const wrongIdx = (nextShapeIdx + i + 1) % SHAPES.length;
      distractors.push({ shape: SHAPES[wrongIdx], color: baseColor });
    }
    const options = shuffle([correct, ...distractors]);
    return { sequence, answer: options.indexOf(correct), options };
  } else {
    // Alternating pattern (A-B-A-B)
    const shapeA = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const shapeB = SHAPES[(SHAPES.indexOf(shapeA) + 2) % SHAPES.length];
    const colorA = COLORS[Math.floor(Math.random() * COLORS.length)];
    const colorB = COLORS[(COLORS.indexOf(colorA) + 3) % COLORS.length];
    for (let i = 0; i < length; i++) {
      if (i % 2 === 0) sequence.push({ shape: shapeA, color: colorA });
      else sequence.push({ shape: shapeB, color: colorB });
    }
    const isEven = length % 2 === 0;
    const nextShape = isEven ? shapeA : shapeB;
    const nextColor = isEven ? colorA : colorB;
    const correct: SequenceItem = { shape: nextShape, color: nextColor };
    const distractors: SequenceItem[] = [
      { shape: isEven ? shapeB : shapeA, color: isEven ? colorB : colorA },
      { shape: nextShape, color: isEven ? colorB : colorA },
      { shape: isEven ? shapeB : shapeA, color: nextColor },
    ];
    const options = shuffle([correct, ...distractors]);
    return { sequence, answer: options.indexOf(correct), options };
  }
}

function ShapeSvg({ shape, color, size = 40 }: { shape: string; color: string; size?: number }) {
  const half = size / 2;
  if (shape === 'circle') return <svg width={size} height={size}><circle cx={half} cy={half} r={half - 2} fill={color} /></svg>;
  if (shape === 'square') return <svg width={size} height={size}><rect x="2" y="2" width={size - 4} height={size - 4} rx="4" fill={color} /></svg>;
  if (shape === 'triangle') return <svg width={size} height={size}><polygon points={`${half},4 ${size - 4},${size - 4} 4,${size - 4}`} fill={color} /></svg>;
  if (shape === 'diamond') return <svg width={size} height={size}><polygon points={`${half},4 ${size - 4},${half} ${half},${size - 4} 4,${half}`} fill={color} /></svg>;
  if (shape === 'star') return <svg width={size} height={size}><polygon points={`${half},4 ${half + 8},${half - 4} ${size - 4},${half - 4} ${half + 10},${half + 2} ${size - 8},${size - 4} ${half},${half + 8} 8,${size - 4} ${half - 10},${half + 2} 4,${half - 4} ${half - 8},${half - 4}`} fill={color} /></svg>;
  if (shape === 'hexagon') return <svg width={size} height={size}><polygon points={`${half},4 ${size - 4},${half - 6} ${size - 4},${half + 6} ${half},${size - 4} 4,${half + 6} 4,${half - 6}`} fill={color} /></svg>;
  if (shape === 'question') return <svg width={size} height={size}><circle cx={half} cy={half} r={half - 2} fill="none" stroke={color} strokeWidth="2" strokeDasharray="4 4" /><text x={half} y={half + 6} textAnchor="middle" fill={color} fontSize="20" fontWeight="bold">?</text></svg>;
  return <svg width={size} height={size}><circle cx={half} cy={half} r={half - 2} fill={color} /></svg>;
}

export function PatternQuest({ onComplete, onRoundChange }: GameComponentProps) {
  const [round, setRound] = useState(0);
  const [startTime] = useState(Date.now());
  const [correct, setCorrect] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [data, setData] = useState<SequenceData>(() => generateSequence(0));
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [locked, setLocked] = useState(false);

  const handleAnswer = useCallback((optionIdx: number) => {
    if (locked) return;
    setLocked(true);

    if (optionIdx === data.answer) {
      setCorrect(c => c + 1);
      setFeedback('correct');
      setDifficulty(d => Math.min(8, d + 1));
    } else {
      setMistakes(m => m + 1);
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      setLocked(false);
      setRound(r => r + 1);
    }, 1000);
  }, [data, locked]);

  useEffect(() => {
    if (round >= TOTAL_ROUNDS) {
      const stats = calculateGameStats(TOTAL_ROUNDS, correct, mistakes, startTime, difficulty);
      onComplete(stats);
    } else {
      setData(generateSequence(round));
    }
  }, [round]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 text-center">
        <p className="text-sm font-semibold text-ink-400 mb-1">What comes next in the sequence?</p>
      </div>

      {/* Sequence display */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap mb-8">
        {data.sequence.map((item, i) => (
          <div
            key={i}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-ink-50 border-2 border-ink-100 flex items-center justify-center animate-scale-in"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <ShapeSvg shape={item.shape} color={item.color} size={36} />
          </div>
        ))}
        {/* Question mark */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-sq-50 border-2 border-sq-200 border-dashed flex items-center justify-center">
          <ShapeSvg shape="question" color="#94a3b8" size={36} />
        </div>
      </div>

      {/* Answer options */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-lg">
        {data.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            disabled={locked}
            className="p-4 rounded-2xl border-2 border-ink-200 hover:border-sq-400 hover:bg-sq-50 transition-all disabled:opacity-50 flex items-center justify-center"
          >
            <ShapeSvg shape={opt.shape} color={opt.color} size={36} />
          </button>
        ))}
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`mt-6 px-5 py-3 rounded-xl font-semibold text-sm animate-fade-in ${
          feedback === 'correct' ? 'bg-emerald-50 text-emerald-700' : 'bg-coral-50 text-coral-700'
        }`}>
          {feedback === 'correct' ? 'Nice! You spotted the pattern.' : 'Almost. Look at how the shapes change between steps.'}
        </div>
      )}
    </div>
  );
}
