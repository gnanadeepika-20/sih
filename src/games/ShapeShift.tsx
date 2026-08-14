import { useState, useEffect, useCallback } from 'react';
import type { GameComponentProps } from './types';
import { calculateGameStats } from './types';

const TOTAL_ROUNDS = 8;

type Shape = 'square' | 'triangle' | 'circle';

interface TargetShape {
  shape: Shape;
  rotation: number;
  color: string;
}

function generateRound(round: number): { target: TargetShape; options: TargetShape[]; correctIdx: number } {
  const shapes: Shape[] = ['square', 'triangle', 'circle'];
  const colors = ['#0d9488', '#3b82f6', '#f59e0b', '#ef4444'];
  const rotations = [0, 45, 90, 135, 180, 225, 270, 315];

  const targetShape = shapes[Math.floor(Math.random() * shapes.length)];
  const targetRotation = rotations[Math.floor(Math.random() * rotations.length)];
  const targetColor = colors[Math.floor(Math.random() * colors.length)];

  const target: TargetShape = { shape: targetShape, rotation: targetRotation, color: targetColor };

  const options: TargetShape[] = [target];
  const usedRotations = new Set([targetRotation]);

  while (options.length < 4) {
    let rot: number;
    do {
      rot = rotations[Math.floor(Math.random() * rotations.length)];
    } while (usedRotations.has(rot) && usedRotations.size < rotations.length);
    usedRotations.add(rot);

    // Difficulty: at higher rounds, use closer rotations
    const offset = Math.max(15, 90 - round * 10);
    const variedRot = (targetRotation + (Math.random() > 0.5 ? offset : -offset) + 360) % 360;
    options.push({ shape: targetShape, rotation: variedRot, color: targetColor });
  }

  // Shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  const correctIdx = options.findIndex(o => o.rotation === targetRotation && o.shape === targetShape);

  return { target, options, correctIdx };
}

function ShapeRender({ shape, rotation, color, size = 60 }: { shape: Shape; rotation: number; color: string; size?: number }) {
  const half = size / 2;
  return (
    <svg width={size} height={size} style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.3s' }}>
      {shape === 'square' && <rect x="8" y="8" width={size - 16} height={size - 16} rx="6" fill={color} />}
      {shape === 'triangle' && <polygon points={`${half},8 ${size - 8},${size - 8} 8,${size - 8}`} fill={color} />}
      {shape === 'circle' && <circle cx={half} cy={half} r={half - 8} fill={color} />}
    </svg>
  );
}

export function ShapeShift({ onComplete, onRoundChange }: GameComponentProps) {
  const [round, setRound] = useState(0);
  const [startTime] = useState(Date.now());
  const [correct, setCorrect] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [data, setData] = useState(() => generateRound(0));
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [locked, setLocked] = useState(false);

  const handleAnswer = useCallback((idx: number) => {
    if (locked) return;
    setLocked(true);

    if (idx === data.correctIdx) {
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
      setData(generateRound(round));
    }
  }, [round]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 text-center">
        <p className="text-sm font-semibold text-ink-400 mb-1">Which shape matches the target's rotation?</p>
      </div>

      {/* Target */}
      <div className="mb-8">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-sq-50 border-2 border-sq-200 flex items-center justify-center">
          <ShapeRender shape={data.target.shape} rotation={data.target.rotation} color={data.target.color} size={64} />
        </div>
        <p className="text-center text-xs font-bold text-sq-600 mt-2 uppercase tracking-wider">Target</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {data.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            disabled={locked}
            className="p-6 rounded-2xl border-2 border-ink-200 hover:border-sq-400 hover:bg-sq-50 transition-all disabled:opacity-50 flex items-center justify-center"
          >
            <ShapeRender shape={opt.shape} rotation={opt.rotation} color={opt.color} size={56} />
          </button>
        ))}
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`mt-6 px-5 py-3 rounded-xl font-semibold text-sm animate-fade-in ${
          feedback === 'correct' ? 'bg-emerald-50 text-emerald-700' : 'bg-coral-50 text-coral-700'
        }`}>
          {feedback === 'correct' ? 'Spot on! You matched the rotation.' : 'Not quite. Look at the angle of the shape.'}
        </div>
      )}
    </div>
  );
}
