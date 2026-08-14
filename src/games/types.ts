import type { GameResult } from '@/lib/types';

export interface GameComponentProps {
  onComplete: (result: {
    score: number;
    accuracy: number;
    completionTimeMs: number;
    mistakes: number;
    difficultyReached: number;
  }) => void;
  onRoundChange?: (round: number) => void;
}

export interface RoundResult {
  correct: boolean;
  userAnswer: string | number;
  correctAnswer: string | number;
}

export function calculateGameStats(
  totalRounds: number,
  correctRounds: number,
  mistakes: number,
  startTime: number,
  difficultyReached: number,
  maxDifficulty: number = 8
): GameResult {
  const accuracy = correctRounds / totalRounds;
  const completionTimeMs = Date.now() - startTime;
  const speedScore = Math.max(0, Math.min(100, 100 - (completionTimeMs / 1000 - 60) * 1.5));
  const difficultyScore = (difficultyReached / maxDifficulty) * 100;
  const mistakePenalty = Math.max(0, 100 - mistakes * 8);

  const score = Math.round(
    accuracy * 100 * 0.45 +
    speedScore * 0.2 +
    difficultyScore * 0.2 +
    mistakePenalty * 0.15
  );

  return {
    score: Math.min(100, Math.max(0, score)),
    accuracy,
    completionTimeMs,
    mistakes,
    difficultyReached,
  };
}
