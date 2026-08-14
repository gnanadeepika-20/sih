import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { LoadingSpinner, ErrorState } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { fetchGames, saveGameAttempt, awardAchievement } from '@/lib/dataApi';
import type { Game } from '@/lib/types';
import type { GameComponentProps } from '@/games/types';

const PatternQuest = lazy(() => import('@/games/PatternQuest').then(m => ({ default: m.PatternQuest })));
const MemoryMatrix = lazy(() => import('@/games/MemoryMatrix').then(m => ({ default: m.MemoryMatrix })));
const ShapeShift = lazy(() => import('@/games/ShapeShift').then(m => ({ default: m.ShapeShift })));
const LogicLab = lazy(() => import('@/games/LogicLab').then(m => ({ default: m.LogicLab })));
const CreativeLab = lazy(() => import('@/games/CreativeLab').then(m => ({ default: m.CreativeLab })));
const DecisionDash = lazy(() => import('@/games/DecisionDash').then(m => ({ default: m.DecisionDash })));

const GAME_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType<GameComponentProps>>> = {
  'pattern-quest': PatternQuest,
  'memory-matrix': MemoryMatrix,
  'shape-shift': ShapeShift,
  'logic-lab': LogicLab,
  'creative-lab': CreativeLab,
  'decision-dash': DecisionDash,
};

const TOTAL_ROUNDS_MAP: Record<string, number> = {
  'pattern-quest': 8,
  'memory-matrix': 8,
  'shape-shift': 8,
  'logic-lab': 6,
  'creative-lab': 6,
  'decision-dash': 10,
};

interface GameResultState {
  score: number;
  accuracy: number;
  completionTimeMs: number;
  mistakes: number;
  difficultyReached: number;
  skillEvidence: Record<string, number>;
}

export default function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GameResultState | null>(null);
  const [saving, setSaving] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const games = await fetchGames();
        const g = games.find(g => g.id === gameId);
        if (!g) {
          setError('Challenge not found');
          setLoading(false);
          return;
        }
        setGame(g);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load challenge');
        setLoading(false);
      }
    }
    load();
  }, [gameId]);

  async function handleComplete(gameResult: {
    score: number;
    accuracy: number;
    completionTimeMs: number;
    mistakes: number;
    difficultyReached: number;
  }) {
    if (!user || !game) return;
    setSaving(true);
    try {
      const { attempt } = await saveGameAttempt(user.id, game.id, gameResult);
      setResult({
        ...gameResult,
        skillEvidence: attempt.skill_evidence as Record<string, number>,
      });

      // Award achievements
      if (attempt.attempt_number === 1) {
        await awardAchievement(user.id, 'first-quest');
      }
      if (gameResult.score >= 80) {
        if (game.id === 'logic-lab') await awardAchievement(user.id, 'logic-master');
        if (game.id === 'creative-lab') await awardAchievement(user.id, 'creative-thinker');
        if (game.id === 'shape-shift') await awardAchievement(user.id, 'visual-thinker');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save your results');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingSpinner size="lg" label="Loading challenge..." />;
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <ErrorState message={error} onRetry={() => navigate('/assessment')} />
    </div>
  );
  if (!game) return null;

  // Results screen
  if (result && game) {
    const accuracyPct = Math.round(result.accuracy * 100);
    const speedScore = Math.max(0, Math.min(100, 100 - (result.completionTimeMs / 1000 - 60) * 1.5));
    const speedPct = Math.round(speedScore);
    const difficultyLabel = result.difficultyReached >= 6 ? 'Hard' : result.difficultyReached >= 3 ? 'Medium' : 'Easy';

    const bestSkill = Object.entries(result.skillEvidence).sort(([, a], [, b]) => b - a)[0];

    return (
      <div className="min-h-screen bg-ink-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full">
          <div className="card p-8 text-center animate-bounce-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <Icon name="Trophy" className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-extrabold text-ink-900 mb-1">Challenge Complete</h1>
            <p className="text-ink-500 mb-6">{game.name}</p>

            {/* Score */}
            <div className="mb-6">
              <div className="text-5xl font-extrabold text-sq-600 tabular-nums animate-scale-in">{result.score}</div>
              <p className="text-sm font-semibold text-ink-400 mt-1">Score</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-ink-50">
                <div className="text-xl font-extrabold text-ink-900 tabular-nums">{accuracyPct}%</div>
                <p className="text-xs text-ink-400 font-semibold mt-0.5">Accuracy</p>
              </div>
              <div className="p-3 rounded-xl bg-ink-50">
                <div className="text-xl font-extrabold text-ink-900 tabular-nums">{speedPct}%</div>
                <p className="text-xs text-ink-400 font-semibold mt-0.5">Speed</p>
              </div>
              <div className="p-3 rounded-xl bg-ink-50">
                <div className="text-xl font-extrabold text-ink-900">{difficultyLabel}</div>
                <p className="text-xs text-ink-400 font-semibold mt-0.5">Difficulty</p>
              </div>
            </div>

            {/* Best skill */}
            {bestSkill && (
              <div className="p-4 rounded-xl bg-sq-50 border border-sq-200 mb-6">
                <p className="text-xs font-bold text-sq-600 uppercase tracking-wider mb-1">Best Skill Evidence</p>
                <p className="font-bold text-sq-800">{bestSkill[0]}</p>
              </div>
            )}

            {/* XP */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="px-4 py-2 rounded-xl bg-amber2-50 border border-amber2-200 flex items-center gap-2">
                <Icon name="Zap" className="w-5 h-5 text-amber2-600" />
                <span className="font-extrabold text-amber2-700">+{Math.round(result.score)} XP</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => navigate('/assessment')} className="btn-secondary flex-1">
                <Icon name="ArrowLeft" className="w-4 h-4" />
                Back to Quests
              </button>
              <button
                onClick={() => { setResult(null); setCurrentRound(0); }}
                className="btn-secondary flex-1"
              >
                <Icon name="Play" className="w-4 h-4" />
                Play Again
              </button>
              <button onClick={() => navigate('/dashboard')} className="btn-primary flex-1">
                Continue
                <Icon name="ArrowRight" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (saving) return <LoadingSpinner size="lg" label="Saving your results..." />;

  // Game screen
  const GameComponent = GAME_COMPONENTS[game.id];
  const totalRounds = TOTAL_ROUNDS_MAP[game.id] ?? 8;

  return (
    <div className="min-h-screen bg-ink-50 flex flex-col">
      {/* Minimal game header */}
      <div className="bg-white border-b border-ink-100 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/assessment')}
            className="flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-ink-900 transition-colors"
          >
            <Icon name="ArrowLeft" className="w-4 h-4" />
            <span className="hidden sm:inline">Exit</span>
          </button>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center`}>
              <Icon name={game.icon} className="w-5 h-5 text-sq-600" />
            </div>
            <span className="font-bold text-ink-900 text-sm">{game.name}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-ink-500">
            <span className="text-sq-600">{currentRound}</span>
            <span className="text-ink-300">/</span>
            <span>{totalRounds}</span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="max-w-4xl mx-auto mt-2">
          <div className="h-1.5 rounded-full bg-ink-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sq-400 to-sq-600 rounded-full transition-all duration-300"
              style={{ width: `${(currentRound / totalRounds) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Game content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full">
          <Suspense fallback={<LoadingSpinner size="md" label="Loading challenge..." />}>
            {GameComponent ? (
              <GameComponent onComplete={handleComplete} onRoundChange={(r) => setCurrentRound(r)} />
            ) : (
              <ErrorState message="This challenge is not yet available" onRetry={() => navigate('/assessment')} />
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
