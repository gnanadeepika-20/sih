import { useState, useEffect, useCallback } from 'react';
import type { GameComponentProps } from './types';
import { calculateGameStats } from './types';

const TOTAL_ROUNDS = 8;

function generateGrid(round: number): { gridSize: number; highlighted: number[] } {
  const gridSize = Math.min(3 + Math.floor(round / 2), 6);
  const totalCells = gridSize * gridSize;
  const highlightCount = Math.min(3 + Math.floor(round / 2), Math.floor(totalCells / 2));

  const highlighted: number[] = [];
  while (highlighted.length < highlightCount) {
    const cell = Math.floor(Math.random() * totalCells);
    if (!highlighted.includes(cell)) highlighted.push(cell);
  }

  return { gridSize, highlighted };
}

export function MemoryMatrix({ onComplete, onRoundChange }: GameComponentProps) {
  const [round, setRound] = useState(0);
  const [startTime] = useState(Date.now());
  const [correct, setCorrect] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [data, setData] = useState(() => generateGrid(0));
  const [phase, setPhase] = useState<'memorize' | 'reproduce' | 'feedback'>('memorize');
  const [userSelection, setUserSelection] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Memorize phase timer
  useEffect(() => {
    if (phase === 'memorize') {
      const memorizeTime = Math.max(1500, data.highlighted.length * 500);
      const timer = setTimeout(() => setPhase('reproduce'), memorizeTime);
      return () => clearTimeout(timer);
    }
  }, [phase, data]);

  const handleCellClick = useCallback((cellIdx: number) => {
    if (phase !== 'reproduce') return;
    setUserSelection(prev => {
      if (prev.includes(cellIdx)) return prev.filter(c => c !== cellIdx);
      return [...prev, cellIdx];
    });
  }, [phase]);

  const handleSubmit = useCallback(() => {
    if (phase !== 'reproduce') return;
    const correctCount = userSelection.filter(c => data.highlighted.includes(c)).length;
    const wrongCount = userSelection.filter(c => !data.highlighted.includes(c)).length;
    const missedCount = data.highlighted.filter(c => !userSelection.includes(c)).length;

    const isCorrect = correctCount === data.highlighted.length && wrongCount === 0;

    if (isCorrect) {
      setCorrect(c => c + 1);
      setFeedback('correct');
      setDifficulty(d => Math.min(8, d + 1));
    } else {
      setMistakes(m => m + wrongCount + missedCount);
      setFeedback('wrong');
    }

    setShowResults(true);
    setPhase('feedback');

    setTimeout(() => {
      setFeedback(null);
      setShowResults(false);
      setUserSelection([]);
      setPhase('memorize');
      setRound(r => r + 1);
    }, 2000);
  }, [userSelection, data, phase]);

  useEffect(() => {
    if (round >= TOTAL_ROUNDS) {
      const stats = calculateGameStats(TOTAL_ROUNDS, correct, mistakes, startTime, difficulty);
      onComplete(stats);
    } else {
      setData(generateGrid(round));
      setPhase('memorize');
      setUserSelection([]);
    }
  }, [round]);

  const cellSize = data.gridSize <= 4 ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-12 h-12 sm:w-14 sm:h-14';

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 text-center">
        {phase === 'memorize' && (
          <p className="text-sm font-semibold text-sq-600 animate-pulse">Memorize the highlighted cells...</p>
        )}
        {phase === 'reproduce' && (
          <p className="text-sm font-semibold text-ink-600">Click the cells that were highlighted</p>
        )}
        {phase === 'feedback' && (
          <p className="text-sm font-semibold text-ink-600">Round complete</p>
        )}
      </div>

      {/* Grid */}
      <div
        className="grid gap-2 mb-6"
        style={{ gridTemplateColumns: `repeat(${data.gridSize}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: data.gridSize * data.gridSize }).map((_, i) => {
          const isHighlighted = data.highlighted.includes(i);
          const isSelected = userSelection.includes(i);
          const showHighlight = phase === 'memorize' && isHighlighted;
          const showSelected = phase === 'reproduce' && isSelected;
          const showCorrect = showResults && isHighlighted;
          const showWrong = showResults && isSelected && !isHighlighted;

          return (
            <button
              key={i}
              onClick={() => handleCellClick(i)}
              disabled={phase !== 'reproduce'}
              className={`${cellSize} rounded-xl border-2 transition-all duration-200 ${
                showHighlight
                  ? 'bg-sq-500 border-sq-600 scale-105'
                  : showCorrect
                  ? 'bg-emerald-400 border-emerald-500'
                  : showWrong
                  ? 'bg-coral-400 border-coral-500'
                  : showSelected
                  ? 'bg-sq-300 border-sq-400'
                  : 'bg-ink-50 border-ink-200 hover:border-sq-300'
              } ${phase === 'reproduce' ? 'cursor-pointer' : 'cursor-default'}`}
            />
          );
        })}
      </div>

      {/* Submit button */}
      {phase === 'reproduce' && (
        <button
          onClick={handleSubmit}
          disabled={userSelection.length === 0}
          className="btn-primary"
        >
          Submit Answer
        </button>
      )}

      {/* Feedback */}
      {feedback && (
        <div className={`mt-6 px-5 py-3 rounded-xl font-semibold text-sm animate-fade-in ${
          feedback === 'correct' ? 'bg-emerald-50 text-emerald-700' : 'bg-coral-50 text-coral-700'
        }`}>
          {feedback === 'correct' ? 'Perfect memory! You got every cell.' : 'Some cells were missed. Memory gets sharper with practice.'}
        </div>
      )}
    </div>
  );
}
