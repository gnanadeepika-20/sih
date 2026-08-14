import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { SkillBar } from '@/components/SkillBar';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { getLevelInfo, getTopSkills } from '@/lib/skillEngine';
import { fetchGames, fetchCareers, fetchBestAttempts, fetchSkillProfile, fetchRecommendations, fetchRoadmap } from '@/lib/dataApi';
import { PetCompanion } from '@/components/PetCompanion';
import type { Game, Career, GameAttempt, SkillProfile, Recommendation, Roadmap, RoadmapTask } from '@/lib/types';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [petType, setPetType] = useState(() => localStorage.getItem('sq_pet_type') || 'bunny');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [bestAttempts, setBestAttempts] = useState<Record<string, GameAttempt>>({});
  const [skillProfile, setSkillProfile] = useState<SkillProfile | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [roadmapTasks, setRoadmapTasks] = useState<RoadmapTask[]>([]);
  const [careerMap, setCareerMap] = useState<Record<string, Career>>({});

  async function loadData() {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [gamesData, careersData, best, skills, recs, rd] = await Promise.all([
        fetchGames(),
        fetchCareers(),
        fetchBestAttempts(user.id),
        fetchSkillProfile(user.id),
        fetchRecommendations(user.id),
        fetchRoadmap(user.id),
      ]);
      const cMap: Record<string, Career> = {};
      for (const c of careersData) cMap[c.id] = c;
      setGames(gamesData);
      setCareerMap(cMap);
      setBestAttempts(best);
      setSkillProfile(skills);
      setRecommendations(recs);
      setRoadmap(rd.roadmap);
      setRoadmapTasks(rd.tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load your dashboard');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [user]);

  if (loading) return <LoadingSpinner size="lg" label="Loading your quest hub..." />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  const levelInfo = profile ? getLevelInfo(profile.xp) : null;
  const completedGames = Object.keys(bestAttempts).length;
  const totalGames = games.length;
  const assessmentProgress = totalGames > 0 ? Math.round((completedGames / totalGames) * 100) : 0;

  const skills = skillProfile?.skills ?? {};
  const topSkills = getTopSkills(skills, 4);
  const topRecs = recommendations.slice(0, 3);

  const roadmapProgress = roadmap ? Math.round(roadmap.progress * 100) : 0;
  const completedTasks = roadmapTasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="min-h-screen bg-ink-50 section-padding py-8 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="mb-8 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900">
            Hey, {profile?.name?.split(' ')[0] || 'Explorer'}
          </h1>
          <span className="text-2xl">👋</span>
        </div>
        <p className="text-ink-500 text-lg">Ready for your next challenge?</p>
      </div>

      {/* Continue Quest CTA */}
      {assessmentProgress < 100 && (
        <div className="mb-8 card p-6 bg-gradient-to-r from-sq-600 to-sq-700 border-sq-700 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-white">
                {completedGames === 0 ? 'Start your first quest' : 'Continue your quest'}
              </h2>
              <p className="text-sq-100 mt-1">
                {completedGames === 0
                  ? 'Play challenges to discover your strengths'
                  : `${completedGames} of ${totalGames} challenges complete`}
              </p>
            </div>
            <button
              onClick={() => navigate('/assessment')}
              className="btn bg-white text-sq-700 px-6 py-3 hover:bg-sq-50 shadow-soft-lg active:scale-[0.98]"
            >
              <Icon name="Zap" className="w-5 h-5" />
              {completedGames === 0 ? 'Start Quest' : 'Continue Quest'}
              <Icon name="ArrowRight" className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Stats row */}
      {levelInfo && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber2-50 flex items-center justify-center">
                <Icon name="Zap" className="w-5 h-5 text-amber2-600" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-ink-900 tabular-nums">{profile?.xp.toLocaleString()}</div>
                <div className="text-xs text-ink-500 font-semibold">Total XP</div>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sq-50 flex items-center justify-center">
                <Icon name="Trophy" className="w-5 h-5 text-sq-600" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-ink-900">Lv.{levelInfo.level}</div>
                <div className="text-xs text-ink-500 font-semibold">{levelInfo.name}</div>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-coral-50 flex items-center justify-center">
                <Icon name="Flame" className="w-5 h-5 text-coral-600" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-ink-900">{profile?.streak}</div>
                <div className="text-xs text-ink-500 font-semibold">Day Streak</div>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Icon name="Check" className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-ink-900">{completedGames}/{totalGames}</div>
                <div className="text-xs text-ink-500 font-semibold">Quests Done</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column - Quest Progress + Skill Snapshot */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quest Progress */}
          <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-ink-900">Your Quest Progress</h2>
              <Link to="/assessment" className="text-sm font-semibold text-sq-600 hover:text-sq-700">
                View all →
              </Link>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <div className="h-3 rounded-full bg-ink-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sq-400 to-sq-600 rounded-full transition-all duration-1000"
                    style={{ width: `${assessmentProgress}%` }}
                  />
                </div>
              </div>
              <span className="text-lg font-extrabold text-ink-900 tabular-nums">{assessmentProgress}%</span>
            </div>
            <p className="text-sm text-ink-500">
              {completedGames} / {totalGames} challenges complete
              {assessmentProgress === 100 && ' — Assessment complete!'}
            </p>
            {assessmentProgress === 100 && !profile?.assessment_completed && (
              <Link to="/results" className="mt-3 inline-flex btn-primary text-sm">
                <Icon name="Sparkles" className="w-4 h-4" />
                Reveal Your Skills
              </Link>
            )}
          </div>

          {/* Skill Snapshot */}
          <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-ink-900">Your Skill Snapshot</h2>
              <Link to="/skills" className="text-sm font-semibold text-sq-600 hover:text-sq-700">
                Full profile →
              </Link>
            </div>
            {topSkills.length > 0 ? (
              <div className="space-y-4">
                {topSkills.map((s, i) => (
                  <SkillBar key={i} skill={s.skill} score={s.score} delay={i * 150} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon="Brain"
                title="No skills yet"
                message="Complete challenges to reveal your skill profile."
                actionLabel="Start Quest"
                onAction={() => navigate('/assessment')}
              />
            )}
          </div>
        </div>

        {/* Right column - Pet Companion + Career Matches + Journey */}
        <div className="space-y-6">
          {/* Pet Companion Widget */}
          <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-ink-900">Your Cognitive Companion</h2>
              <span className="badge bg-amber2-50 text-amber2-700 border border-amber2-200">
                Level {levelInfo?.level ?? 1}
              </span>
            </div>
            <p className="text-xs text-ink-500 mb-2 text-center">
              Click your companion to show love & earn bonus XP!
            </p>
            <PetCompanion
              stage={Math.min(4, levelInfo?.level ?? 1)}
              petType={petType}
              onPetChange={(id) => {
                setPetType(id);
                localStorage.setItem('sq_pet_type', id);
              }}
            />
          </div>

          {/* Career Matches */}
          <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-ink-900">Your Career Matches</h2>
              <Link to="/careers" className="text-sm font-semibold text-sq-600 hover:text-sq-700">
                Explore →
              </Link>
            </div>
            {topRecs.length > 0 ? (
              <div className="space-y-3">
                {topRecs.map((rec, i) => (
                  <Link
                    key={rec.career_id}
                    to={`/careers/${rec.career_id}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-ink-50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-sq-50 flex items-center justify-center text-sq-600 font-bold text-sm flex-shrink-0">
                      #{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-ink-900 text-sm truncate group-hover:text-sq-700 transition-colors">
                        {careerMap[rec.career_id]?.name ?? 'Career'}
                      </div>
                      <div className="h-1.5 mt-1 rounded-full bg-ink-100 overflow-hidden">
                        <div className="h-full bg-sq-500 rounded-full" style={{ width: `${rec.match_score}%` }} />
                      </div>
                    </div>
                    <span className="text-sm font-extrabold text-sq-700">{Math.round(rec.match_score)}%</span>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="Compass"
                title="No matches yet"
                message="Complete your assessment to discover careers."
                actionLabel="Start Quest"
                onAction={() => navigate('/assessment')}
              />
            )}
          </div>

          {/* Current Journey */}
          <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '350ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-ink-900">Your Current Journey</h2>
              <Link to="/roadmap" className="text-sm font-semibold text-sq-600 hover:text-sq-700">
                View →
              </Link>
            </div>
            {roadmap ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="Map" className="w-5 h-5 text-sq-600" />
                  <span className="font-bold text-ink-900">{roadmap.career_name}</span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1">
                    <div className="h-2.5 rounded-full bg-ink-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sq-400 to-sq-600 rounded-full transition-all duration-1000"
                        style={{ width: `${roadmapProgress}%` }}
                      />
                    </div>
                  </div>
                  <span className="font-extrabold text-sq-700">{roadmapProgress}%</span>
                </div>
                <p className="text-sm text-ink-500">
                  {completedTasks} / {roadmapTasks.length} checkpoints complete
                </p>
              </div>
            ) : (
              <EmptyState
                icon="Map"
                title="No journey yet"
                message="Choose a career to build your personalized roadmap."
                actionLabel="Explore Careers"
                onAction={() => navigate('/careers')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
