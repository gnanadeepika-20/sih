import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { LoadingSpinner, ErrorState } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { fetchGames, fetchBestAttempts } from '@/lib/dataApi';
import { supabase } from '@/lib/supabase';
import type { Game, GameAttempt } from '@/lib/types';

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Medium: 'bg-amber2-50 text-amber2-700 border-amber2-200',
  Hard: 'bg-red-50 text-red-700 border-red-200',
};

const GAME_COLORS: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-emerald-50 text-emerald-600',
  orange: 'bg-orange-50 text-orange-600',
  red: 'bg-red-50 text-red-600',
  purple: 'bg-purple-50 text-purple-600',
  amber: 'bg-amber2-50 text-amber2-600',
};

export default function AssessmentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [bestAttempts, setBestAttempts] = useState<Record<string, GameAttempt>>({});
  const [attemptCounts, setAttemptCounts] = useState<Record<string, number>>({});

  async function loadData() {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [gamesData, best] = await Promise.all([
        fetchGames(),
        fetchBestAttempts(user.id),
      ]);
      setGames(gamesData);
      setBestAttempts(best);

      const counts: Record<string, number> = {};
      for (const game of gamesData) {
        const { count } = await supabase
          .from('game_attempts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('game_id', game.id);
        counts[game.id] = count ?? 0;
      }
      setAttemptCounts(counts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load challenges');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [user]);

  if (loading) return <LoadingSpinner size="lg" label="Loading challenges..." />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  const completedCount = Object.keys(bestAttempts).length;
  const totalCount = games.length;

  return (
    <div className="min-h-screen bg-ink-50 section-padding py-8 max-w-6xl mx-auto">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 text-balance">Let's See How You Think.</h1>
        <p className="mt-2 text-ink-500 max-w-2xl text-balance">
          These challenges aren't tests. They're clues about how your mind works.
        </p>
      </div>

      {/* Overall progress bar */}
      <div className="card p-5 mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-ink-900">Assessment Progress</span>
          <span className="text-sm font-semibold text-ink-500">{completedCount} / {totalCount} complete</span>
        </div>
        <div className="h-3 rounded-full bg-ink-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sq-400 to-sq-600 rounded-full transition-all duration-1000"
            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
          />
        </div>
        {completedCount === totalCount && (
          <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-sq-50 border border-sq-200">
            <Icon name="Check" className="w-5 h-5 text-sq-600 flex-shrink-0" />
            <span className="text-sm font-semibold text-sq-800">All challenges complete! Head to your results to reveal your skill profile.</span>
            <button onClick={() => navigate('/results')} className="btn-primary text-sm ml-auto flex-shrink-0">
              View Results
              <Icon name="ArrowRight" className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Challenge cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {games.map((game, i) => {
          const best = bestAttempts[game.id];
          const isCompleted = !!best;
          const attempts = attemptCounts[game.id] ?? 0;
          const colorClass = GAME_COLORS[game.color] ?? GAME_COLORS.blue;

          return (
            <div
              key={game.id}
              className="card-hover p-6 group cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${150 + i * 80}ms` }}
              onClick={() => navigate(`/game/${game.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorClass}`}>
                  <Icon name={game.icon} className="w-7 h-7" />
                </div>
                {isCompleted && (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    <Icon name="Check" className="w-3.5 h-3.5" />
                    Done
                  </div>
                )}
              </div>

              <h3 className="text-lg font-bold text-ink-900 mb-1.5">{game.name}</h3>
              <p className="text-sm text-ink-500 mb-4">{game.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="badge bg-ink-50 text-ink-600 text-xs">
                  <Icon name="Clock" className="w-3 h-3" />
                  {game.estimated_time}
                </span>
                <span className={`badge text-xs border ${DIFFICULTY_COLORS[game.difficulty] ?? DIFFICULTY_COLORS.Medium}`}>
                  {game.difficulty}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-ink-100">
                <div className="flex items-center gap-3 text-xs text-ink-400">
                  <span>{attempts} {attempts === 1 ? 'attempt' : 'attempts'}</span>
                  {isCompleted && <span className="font-bold text-sq-600">Best: {best.score}</span>}
                </div>
                <span className="flex items-center gap-1 text-sm font-semibold text-sq-600 group-hover:gap-2 transition-all">
                  {isCompleted ? 'Play Again' : 'Start'}
                  <Icon name="ArrowRight" className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
