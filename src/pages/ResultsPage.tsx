import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { LoadingSpinner, ErrorState } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { fetchGames, fetchBestAttempts, fetchSkillProfile, fetchCareers, generateRecommendations, awardAchievement, fetchAttempts } from '@/lib/dataApi';
import { getTopSkills, generateSkillExplanation, computeSkillProfile } from '@/lib/skillEngine';
import type { Game, GameAttempt, SkillProfile } from '@/lib/types';

const REVEAL_STEPS = [
  'Analyzing your challenges...',
  'Mapping your abilities...',
  'Finding your strongest patterns...',
  'Comparing career paths...',
  'Your Skill Profile is ready.',
];

export default function ResultsPage() {
  const { user, profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revealStep, setRevealStep] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [skillProfile, setSkillProfile] = useState<SkillProfile | null>(null);
  const [topSkills, setTopSkills] = useState<{ skill: string; score: number }[]>([]);
  const [explanation, setExplanation] = useState('');
  const [games, setGames] = useState<Game[]>([]);
  const [bestAttempts, setBestAttempts] = useState<Record<string, GameAttempt>>({});

  async function loadData() {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [gamesData, best, skills, careersData] = await Promise.all([
        fetchGames(),
        fetchBestAttempts(user.id),
        fetchSkillProfile(user.id),
        fetchCareers(),
      ]);
      setGames(gamesData);
      setBestAttempts(best);

      const completedCount = Object.keys(best).length;
      if (completedCount === 0) {
        setError('Complete at least one challenge to see your results.');
        setLoading(false);
        return;
      }

      // If no skill profile yet, compute from attempts
      let skillProf = skills;
      if (!skillProf) {
        // Get all attempts and compute
        const allAttempts = await fetchAttempts(user.id);
        const computedSkills = computeSkillProfile(allAttempts);
        skillProf = { id: '', user_id: user.id, skills: computedSkills, updated_at: '' };
      }

      setSkillProfile(skillProf);
      setTopSkills(getTopSkills(skillProf.skills, 5));
      setExplanation(generateSkillExplanation(skillProf.skills));

      // Generate recommendations
      await generateRecommendations(user.id, skillProf.skills, careersData);

      // Mark assessment as completed
      if (!profile?.assessment_completed) {
        await updateProfile({ assessment_completed: true });
      }

      // Award career explorer badge if we have recommendations
      await awardAchievement(user.id, 'career-explorer');

      setLoading(false);

      // Start reveal animation
      let step = 0;
      const interval = setInterval(() => {
        step++;
        if (step >= REVEAL_STEPS.length - 1) {
          clearInterval(interval);
          setRevealStep(REVEAL_STEPS.length - 1);
          setTimeout(() => setRevealed(true), 800);
        } else {
          setRevealStep(step);
        }
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load your results');
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [user]);

  if (loading) return <LoadingSpinner size="lg" label="Preparing your results..." />;
  if (error) return (
    <div className="min-h-screen flex items-center justify-center section-padding">
      <ErrorState message={error} onRetry={() => navigate('/assessment')} />
    </div>
  );

  // Reveal animation
  if (!revealed) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-sq-600/20 flex items-center justify-center mx-auto mb-8 animate-pulse-slow">
            <Icon name="Brain" className="w-10 h-10 text-sq-400" />
          </div>
          <div className="space-y-4">
            {REVEAL_STEPS.slice(0, REVEAL_STEPS.length - 1).map((step, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 transition-all duration-500 ${
                  revealStep === i ? 'opacity-100 scale-105' : revealStep > i ? 'opacity-50' : 'opacity-20'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  revealStep > i ? 'bg-sq-600' : revealStep === i ? 'bg-sq-500 animate-pulse' : 'bg-ink-700'
                }`}>
                  {revealStep > i && <Icon name="Check" className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className={`text-sm font-semibold transition-colors ${
                  revealStep === i ? 'text-white' : 'text-ink-400'
                }`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-8 w-full h-1 rounded-full bg-ink-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sq-400 to-sq-600 rounded-full transition-all duration-1000"
              style={{ width: `${(revealStep / (REVEAL_STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Results display
  const completedCount = Object.keys(bestAttempts).length;

  return (
    <div className="min-h-screen bg-ink-50 section-padding py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sq-50 border border-sq-200 text-sq-700 text-sm font-semibold mb-4">
          <Icon name="Sparkles" className="w-4 h-4" />
          Your Skill DNA
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-900 text-balance">Your Skill Profile is Ready</h1>
        <p className="mt-3 text-ink-500 max-w-2xl mx-auto text-balance">
          Based on your performance across {completedCount} challenge{completedCount === 1 ? '' : 's'}, here's what we discovered about how you think.
        </p>
      </div>

      {/* Top strengths */}
      <div className="card p-8 mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <h2 className="text-lg font-bold text-ink-900 mb-1">Your Top Strengths</h2>
        <p className="text-sm text-ink-500 mb-6">The abilities you demonstrated most strongly.</p>
        <div className="space-y-5">
          {topSkills.map((s, i) => (
            <div
              key={s.skill}
              className="flex items-center gap-4 animate-fade-in-up"
              style={{ animationDelay: `${200 + i * 150}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-sq-100 flex items-center justify-center flex-shrink-0">
                <span className="font-extrabold text-sq-700">#{i + 1}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-ink-900">{s.skill}</span>
                  <span className="text-xl font-extrabold text-sq-700 tabular-nums">{s.score}</span>
                </div>
                <div className="h-2.5 rounded-full bg-ink-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sq-400 to-sq-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${s.score}%`, transitionDelay: `${300 + i * 200}ms` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <div className="card p-6 mb-6 bg-gradient-to-br from-sq-50 to-white border-sq-200 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
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

      {/* Next steps CTA */}
      <div className="card p-8 bg-gradient-to-r from-sq-600 to-sq-700 border-sq-700 text-center animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <h2 className="text-xl font-bold text-white mb-2">Ready to see your career matches?</h2>
        <p className="text-sq-100 mb-6">Your skill profile is matched against real career requirements.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/skills')}
            className="btn bg-white text-sq-700 px-6 py-3 hover:bg-sq-50 shadow-soft-lg active:scale-[0.98]"
          >
            <Icon name="Brain" className="w-5 h-5" />
            Full Skill Profile
          </button>
          <button
            onClick={() => navigate('/careers')}
            className="btn bg-sq-500/20 text-white border-2 border-white/30 px-6 py-3 hover:bg-sq-500/30 active:scale-[0.98]"
          >
            <Icon name="Compass" className="w-5 h-5" />
            Explore Careers
            <Icon name="ArrowRight" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
