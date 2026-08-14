import { useState, useEffect, useCallback } from 'react';
import type { GameComponentProps } from './types';
import { calculateGameStats } from './types';

const TOTAL_ROUNDS = 6;

interface Puzzle {
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

const PUZZLES: Puzzle[] = [
  {
    question: 'If all Bloops are Razzles, and all Razzles are Lazzles, then all Bloops are definitely...',
    options: ['Lazzles', 'Razzles only', 'Not Lazzles', 'Cannot be determined'],
    correctIdx: 0,
    explanation: 'If A → B and B → C, then A → C. All Bloops are Lazzles.',
  },
  {
    question: 'Tom is taller than Jerry. Jerry is taller than Spike. Who is the shortest?',
    options: ['Tom', 'Jerry', 'Spike', 'Cannot be determined'],
    correctIdx: 2,
    explanation: 'Tom > Jerry > Spike in height. Spike is shortest.',
  },
  {
    question: 'In a race, you overtake the person in 2nd place. What position are you in now?',
    options: ['1st', '2nd', '3rd', 'Same as before'],
    correctIdx: 1,
    explanation: 'When you overtake 2nd place, you take their position — 2nd.',
  },
  {
    question: 'A farmer has 17 sheep. All but 9 run away. How many sheep remain?',
    options: ['8', '9', '17', '26'],
    correctIdx: 1,
    explanation: '"All but 9" means 9 remain.',
  },
  {
    question: 'If you rearrange the letters "CIFAIPC", you get the name of a what?',
    options: ['City', 'Country', 'Ocean', 'Animal'],
    correctIdx: 2,
    explanation: 'PACIFIC — an ocean.',
  },
  {
    question: 'What number comes next: 2, 6, 12, 20, 30, ?',
    options: ['40', '42', '44', '36'],
    correctIdx: 1,
    explanation: 'Differences: 4, 6, 8, 10, 12. 30 + 12 = 42.',
  },
  {
    question: 'A clock shows 3:15. What is the angle between the hour and minute hands?',
    options: ['0°', '7.5°', '15°', '22.5°'],
    correctIdx: 1,
    explanation: 'Minute hand at 90°. Hour hand at 97.5° (3.25 hours × 30°). Difference = 7.5°.',
  },
  {
    question: 'If 5 machines make 5 widgets in 5 minutes, how long for 100 machines to make 100 widgets?',
    options: ['5 minutes', '20 minutes', '100 minutes', '500 minutes'],
    correctIdx: 0,
    explanation: 'Each machine makes 1 widget in 5 min. 100 machines make 100 widgets in 5 min.',
  },
];

export function LogicLab({ onComplete, onRoundChange }: GameComponentProps) {
  const [round, setRound] = useState(0);
  const [startTime] = useState(Date.now());
  const [correct, setCorrect] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [puzzleIdx, setPuzzleIdx] = useState(() => Math.floor(Math.random() * PUZZLES.length));
  const [usedPuzzles, setUsedPuzzles] = useState<Set<number>>(new Set([puzzleIdx]));
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [locked, setLocked] = useState(false);

  const puzzle = PUZZLES[puzzleIdx];

  const handleAnswer = useCallback((idx: number) => {
    if (locked) return;
    setLocked(true);

    if (idx === puzzle.correctIdx) {
      setCorrect(c => c + 1);
      setFeedback('correct');
      setDifficulty(d => Math.min(8, d + 1));
    } else {
      setMistakes(m => m + 1);
      setFeedback('wrong');
    }
    setShowExplanation(true);

    setTimeout(() => {
      setFeedback(null);
      setShowExplanation(false);
      setLocked(false);
      setRound(r => r + 1);
    }, 2500);
  }, [puzzle, locked]);

  useEffect(() => {
    if (round >= TOTAL_ROUNDS) {
      const stats = calculateGameStats(TOTAL_ROUNDS, correct, mistakes, startTime, difficulty);
      onComplete(stats);
    } else {
      // Pick a puzzle we haven't used yet
      let next: number;
      do {
        next = Math.floor(Math.random() * PUZZLES.length);
      } while (usedPuzzles.has(next) && usedPuzzles.size < PUZZLES.length);
      setPuzzleIdx(next);
      setUsedPuzzles(prev => new Set([...prev, next]));
    }
  }, [round]);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <div className="mb-6 text-center">
        <p className="text-sm font-semibold text-ink-400 uppercase tracking-wider mb-2">Analytical Puzzle</p>
        <p className="text-lg font-bold text-ink-900 text-balance">{puzzle.question}</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {puzzle.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            disabled={locked}
            className={`p-4 rounded-2xl border-2 transition-all text-left font-semibold text-ink-700 disabled:opacity-50 ${
              locked && i === puzzle.correctIdx
                ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                : locked && feedback === 'wrong' && i === puzzle.correctIdx
                ? 'border-emerald-400 bg-emerald-50'
                : 'border-ink-200 hover:border-sq-400 hover:bg-sq-50'
            }`}
          >
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-ink-100 text-ink-600 text-sm font-bold mr-3">
              {String.fromCharCode(65 + i)}
            </span>
            {option}
          </button>
        ))}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className={`mt-6 p-4 rounded-xl animate-fade-in w-full ${
          feedback === 'correct' ? 'bg-emerald-50' : 'bg-coral-50'
        }`}>
          <p className={`font-semibold text-sm mb-1 ${feedback === 'correct' ? 'text-emerald-700' : 'text-coral-700'}`}>
            {feedback === 'correct' ? 'Correct!' : 'Not quite.'}
          </p>
          <p className="text-sm text-ink-600">{puzzle.explanation}</p>
        </div>
      )}
    </div>
  );
}
