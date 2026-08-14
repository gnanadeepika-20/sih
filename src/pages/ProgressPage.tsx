import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { LoadingSpinner, ErrorState, PageHeader } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAttempts, fetchSkillProfile, fetchRoadmap, fetchUserAchievements, fetchAchievements } from '@/lib/dataApi';
import { getLevelInfo, computeSkillGrowth, getTopSkills } from '@/lib/skillEngine';
import type { GameAttempt, SkillProfile, Roadmap, RoadmapTask, Achievement } from '@/lib/types';

export default function ProgressPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<GameAttempt[]>([]);
  const [skillProfile, setSkillProfile] = useState<SkillProfile | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [roadmapTasks, setRoadmapTasks] = useState<RoadmapTask[]>([]);
  const [earnedAchievementIds, setEarnedAchievementIds] = useState<string[]>([]);
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);

  async function loadData() {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [atts, skills, rd, earned, achievements] = await Promise.all([
        fetchAttempts(user.id),
        fetchSkillProfile(user.id),
        fetchRoadmap(user.id),
        fetchUserAchievements(user.id),
        fetchAchievements(),
      ]);
      setAttempts(atts);
      setSkillProfile(skills);
      setRoadmap(rd.roadmap);
      setRoadmapTasks(rd.tasks);
      setEarnedAchievementIds(earned);
      setAllAchievements(achievements);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load your progress');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [user]);

  if (loading) return <LoadingSpinner size="lg" label="Loading your progress..." />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  const levelInfo = profile ? getLevelInfo(profile.xp) : null;
  const skills = skillProfile?.skills ?? {};
  const topSkills = getTopSkills(skills, 3);
  const skillGrowth = computeSkillGrowth(attempts);
  const roadmapProgress = roadmap ? Math.round(roadmap.progress * 100) : 0;
  const completedTasks = roadmapTasks.filter(t => t.status === 'completed').length;

  return (
    <div className="min-h-screen bg-ink-50 section-padding py-8 max-w-5xl mx-auto">
      <PageHeader title="Your Progress" subtitle="Track your growth, achievements, and journey over time." />

      {/* Stats overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-5 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber2-50 flex items-center justify-center">
              <Icon name="Zap" className="w-5 h-5 text-amber2-600" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-ink-900 tabular-nums">{profile?.xp.toLocaleString() ?? 0}</div>
              <div className="text-xs text-ink-500 font-semibold">Total XP</div>
            </div>
          </div>
          {levelInfo && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-sq-700">Lv.{levelInfo.level} — {levelInfo.name}</span>
                {levelInfo.nextXp && <span className="text-ink-400">{levelInfo.nextXp - profile!.xp} XP to next</span>}
              </div>
              <div className="h-1.5 rounded-full bg-ink-100 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber2-400 to-amber2-600 rounded-full transition-all duration-1000" style={{ width: `${levelInfo.progress * 100}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-coral-50 flex items-center justify-center">
              <Icon name="Flame" className="w-5 h-5 text-coral-600" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-ink-900">{profile?.streak ?? 0}</div>
              <div className="text-xs text-ink-500 font-semibold">Day Streak</div>
            </div>
          </div>
        </div>

        <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Icon name="Check" className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-ink-900">{attempts.length}</div>
              <div className="text-xs text-ink-500 font-semibold">Challenges Played</div>
            </div>
          </div>
        </div>

        <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sq-50 flex items-center justify-center">
              <Icon name="Map" className="w-5 h-5 text-sq-600" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-ink-900">{roadmapProgress}%</div>
              <div className="text-xs text-ink-500 font-semibold">Roadmap Done</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skill Growth */}
        <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-lg font-bold text-ink-900 mb-1">Skill Growth</h2>
          <p className="text-sm text-ink-500 mb-5">How your skills improved over time.</p>
          {skillGrowth.length > 0 ? (
            <div className="space-y-4">
              {skillGrowth.filter(g => g.delta !== 0).slice(0, 5).map((g) => (
                <div key={g.skill} className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-ink-700 flex-1 truncate">{g.skill}</span>
                  <span className="text-sm font-bold text-ink-400 tabular-nums">{g.from}</span>
                  <Icon name="ArrowRight" className="w-4 h-4 text-ink-300" />
                  <span className="text-sm font-extrabold text-sq-700 tabular-nums">{g.to}</span>
                  <span className={`text-sm font-bold tabular-nums ${g.delta > 0 ? 'text-emerald-600' : 'text-coral-600'}`}>
                    {g.delta > 0 ? '+' : ''}{g.delta}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-400">Play more challenges to see your growth over time.</p>
          )}
        </div>

        {/* Top Skills */}
        <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
          <h2 className="text-lg font-bold text-ink-900 mb-1">Current Top Skills</h2>
          <p className="text-sm text-ink-500 mb-5">Your strongest demonstrated abilities.</p>
          {topSkills.length > 0 ? (
            <div className="space-y-4">
              {topSkills.map((s, i) => (
                <div key={s.skill} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sq-100 flex items-center justify-center text-sq-700 font-extrabold text-sm flex-shrink-0">
                    #{i + 1}
                  </div>
                  <span className="text-sm font-semibold text-ink-700 flex-1 truncate">{s.skill}</span>
                  <span className="text-lg font-extrabold text-sq-700 tabular-nums">{s.score}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-400">Complete challenges to see your top skills.</p>
          )}
        </div>
      </div>

      {/* Achievements */}
      <div className="card p-6 mt-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <h2 className="text-lg font-bold text-ink-900 mb-1">Achievements</h2>
        <p className="text-sm text-ink-500 mb-5">{earnedAchievementIds.length} of {allAchievements.length} unlocked</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {allAchievements.map((a) => {
            const earned = earnedAchievementIds.includes(a.id);
            return (
              <div
                key={a.id}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl text-center transition-all ${
                  earned ? 'bg-amber2-50 border-2 border-amber2-200' : 'bg-ink-50 border-2 border-ink-100 opacity-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  earned ? 'bg-gradient-to-br from-amber2-400 to-amber2-600 text-white' : 'bg-ink-200 text-ink-400'
                }`}>
                  <Icon name={a.icon} className="w-6 h-6" />
                </div>
                <span className={`text-xs font-bold ${earned ? 'text-amber2-800' : 'text-ink-400'}`}>{a.name}</span>
                <span className="text-[10px] text-ink-400 leading-tight">{a.description}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assessment + Roadmap summary */}
      <div className="grid sm:grid-cols-2 gap-6 mt-6">
        <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '350ms' }}>
          <h2 className="text-lg font-bold text-ink-900 mb-4">Assessment</h2>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Icon name="Check" className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-ink-900">{attempts.length > 0 ? 'Complete' : 'Not Started'}</div>
              <div className="text-sm text-ink-500">{attempts.length} challenges played</div>
            </div>
          </div>
          <Link to="/assessment" className="text-sm font-semibold text-sq-600 hover:text-sq-700">
            Go to Assessment →
          </Link>
        </div>

        <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <h2 className="text-lg font-bold text-ink-900 mb-4">Roadmap</h2>
          {roadmap ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-sq-50 flex items-center justify-center">
                  <Icon name="Map" className="w-6 h-6 text-sq-600" />
                </div>
                <div>
                  <div className="text-lg font-bold text-ink-900">{roadmap.career_name}</div>
                  <div className="text-sm text-ink-500">{completedTasks} / {roadmapTasks.length} checkpoints</div>
                </div>
              </div>
              <div className="h-2 rounded-full bg-ink-100 overflow-hidden mb-3">
                <div className="h-full bg-gradient-to-r from-sq-400 to-sq-600 rounded-full transition-all duration-1000" style={{ width: `${roadmapProgress}%` }} />
              </div>
              <Link to="/roadmap" className="text-sm font-semibold text-sq-600 hover:text-sq-700">
                View Roadmap →
              </Link>
            </>
          ) : (
            <>
              <p className="text-sm text-ink-400 mb-3">No roadmap yet. Choose a career to build one.</p>
              <Link to="/careers" className="text-sm font-semibold text-sq-600 hover:text-sq-700">
                Explore Careers →
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
