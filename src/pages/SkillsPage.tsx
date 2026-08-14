import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { SkillBar } from '@/components/SkillBar';
import { RadarChart } from '@/components/RadarChart';
import { LoadingSpinner, ErrorState, EmptyState, PageHeader } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { fetchSkillProfile, fetchAttempts } from '@/lib/dataApi';
import { getTopSkills, generateSkillExplanation } from '@/lib/skillEngine';
import type { SkillProfile, GameAttempt } from '@/lib/types';

export default function SkillsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skillProfile, setSkillProfile] = useState<SkillProfile | null>(null);
  const [attempts, setAttempts] = useState<GameAttempt[]>([]);

  async function loadData() {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [skills, atts] = await Promise.all([
        fetchSkillProfile(user.id),
        fetchAttempts(user.id),
      ]);
      setSkillProfile(skills);
      setAttempts(atts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load your skill profile');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [user]);

  if (loading) return <LoadingSpinner size="lg" label="Loading your skills..." />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  const skills = skillProfile?.skills ?? {};
  const topSkills = getTopSkills(skills, 3);
  const explanation = generateSkillExplanation(skills);

  // Radar chart data — top 8 skills
  const radarSkills = Object.entries(skills)
    .map(([skill, score]) => ({ skill, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  // All skills sorted by score
  const allSkillsSorted = Object.entries(skills)
    .map(([skill, score]) => ({ skill, score }))
    .sort((a, b) => b.score - a.score);

  if (allSkillsSorted.length === 0) {
    return (
      <div className="min-h-screen bg-ink-50 section-padding py-8 max-w-4xl mx-auto">
        <PageHeader title="Your Skill Profile" subtitle="Your demonstrated abilities, visualized." />
        <EmptyState
          icon="Brain"
          title="No skills yet"
          message="Complete challenges to reveal your skill profile."
          actionLabel="Start Quest"
          onAction={() => navigate('/assessment')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50 section-padding py-8 max-w-5xl mx-auto">
      <PageHeader title="Your Skill DNA" subtitle="Your demonstrated abilities, based on real game performance — not self-assessment." />

      {/* Top strengths */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="card p-6 animate-fade-in-up">
          <h2 className="text-lg font-bold text-ink-900 mb-1">Top Strengths</h2>
          <p className="text-sm text-ink-500 mb-6">Your highest-scoring abilities.</p>
          <div className="space-y-5">
            {topSkills.map((s, i) => (
              <div key={s.skill} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sq-100 flex items-center justify-center flex-shrink-0">
                  <Icon name="Brain" className="w-6 h-6 text-sq-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-ink-900">{s.skill}</span>
                    <span className="text-xl font-extrabold text-sq-700">{s.score}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-ink-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sq-400 to-sq-600 rounded-full transition-all duration-1000"
                      style={{ width: `${s.score}%`, transitionDelay: `${i * 200}ms` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Radar chart */}
        <div className="card p-6 flex flex-col items-center justify-center animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <h2 className="text-lg font-bold text-ink-900 mb-1">Skill Map</h2>
          <p className="text-sm text-ink-500 mb-4">Your ability distribution at a glance.</p>
          <RadarChart skills={radarSkills} size={300} />
        </div>
      </div>

      {/* Explanation */}
      <div className="card p-6 mb-6 bg-gradient-to-br from-sq-50 to-white border-sq-200 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-sq-100 flex items-center justify-center flex-shrink-0">
            <Icon name="Lightbulb" className="w-5 h-5 text-sq-600" />
          </div>
          <div>
            <h3 className="font-bold text-ink-900 mb-1">What this means</h3>
            <p className="text-ink-600">{explanation}</p>
          </div>
        </div>
      </div>

      {/* All skills */}
      <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <h2 className="text-lg font-bold text-ink-900 mb-1">All Skills</h2>
        <p className="text-sm text-ink-500 mb-6">Every ability measured across your challenges.</p>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
          {allSkillsSorted.map((s, i) => (
            <SkillBar
              key={s.skill}
              skill={s.skill}
              score={s.score}
              delay={i * 80}
              color={s.score >= 80 ? 'bg-sq-500' : s.score >= 60 ? 'bg-blue-500' : s.score >= 40 ? 'bg-amber2-500' : 'bg-coral-500'}
            />
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="card p-5 text-center">
          <div className="text-2xl font-extrabold text-ink-900">{attempts.length}</div>
          <div className="text-xs text-ink-500 font-semibold mt-1">Total Attempts</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-2xl font-extrabold text-ink-900">{allSkillsSorted.length}</div>
          <div className="text-xs text-ink-500 font-semibold mt-1">Skills Measured</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-2xl font-extrabold text-sq-600">{topSkills[0]?.score ?? 0}</div>
          <div className="text-xs text-ink-500 font-semibold mt-1">Top Score</div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Link to="/careers" className="btn-primary flex-1 justify-center">
          <Icon name="Compass" className="w-5 h-5" />
          See Career Matches
        </Link>
        <Link to="/assessment" className="btn-secondary flex-1 justify-center">
          <Icon name="Zap" className="w-5 h-5" />
          Play More Challenges
        </Link>
      </div>
    </div>
  );
}
