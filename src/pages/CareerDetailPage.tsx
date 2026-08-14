import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { LoadingSpinner, ErrorState } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import {
  fetchCareer, fetchSkillProfile,
  generateRoadmap, awardAchievement, fetchRoadmap
} from '@/lib/dataApi';
import { matchCareers } from '@/lib/skillEngine';
import type { Career, SkillProfile, Roadmap } from '@/lib/types';

const CATEGORY_ICONS: Record<string, string> = {
  Technology: 'Code', Design: 'Palette', Data: 'BarChart3',
  Business: 'Briefcase', Science: 'FlaskConical', Marketing: 'Megaphone',
  Creative: 'Brush', Finance: 'DollarSign',
};

export default function CareerDetailPage() {
  const { careerId } = useParams<{ careerId: string }>();
  const navigate = useNavigate();
  const { user, profile, updateProfile: updateAuthProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [career, setCareer] = useState<Career | null>(null);
  const [skillProfile, setSkillProfile] = useState<SkillProfile | null>(null);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [matchingSkills, setMatchingSkills] = useState<string[]>([]);
  const [skillGaps, setSkillGaps] = useState<{ skill: string; have: number; need: number }[]>([]);
  const [buildingRoadmap, setBuildingRoadmap] = useState(false);
  const [existingRoadmap, setExistingRoadmap] = useState<Roadmap | null>(null);

  async function loadData() {
    if (!user || !careerId) return;
    setLoading(true);
    setError(null);
    try {
      const [careerData, skills, rd] = await Promise.all([
        fetchCareer(careerId),
        fetchSkillProfile(user.id),
        fetchRoadmap(user.id),
      ]);

      if (!careerData) {
        setError('Career not found');
        setLoading(false);
        return;
      }

      setCareer(careerData);
      setSkillProfile(skills);
      setExistingRoadmap(rd.roadmap);

      // Compute match
      if (skills && Object.keys(skills.skills).length > 0) {
        const matches = matchCareers(skills.skills, [careerData]);
        if (matches.length > 0) {
          setMatchScore(matches[0].matchScore);
          setMatchingSkills(matches[0].matchingSkills);
          setSkillGaps(matches[0].skillGaps);
        }
      }

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load career');
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [user, careerId]);

  async function handleBuildRoadmap() {
    if (!user || !career || !skillProfile) return;
    setBuildingRoadmap(true);
    try {
      await generateRoadmap(user.id, career, skillProfile.skills);
      await awardAchievement(user.id, 'roadmap-starter');
      if (profile?.selected_career_id !== career.id) {
        await updateAuthProfile({ selected_career_id: career.id });
      }
      navigate('/roadmap');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to build roadmap');
      setBuildingRoadmap(false);
    }
  }

  if (loading) return <LoadingSpinner size="lg" label="Loading career..." />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;
  if (!career) return null;

  const skills = skillProfile?.skills ?? {};
  const hasSkills = Object.keys(skills).length > 0;

  // Skill comparison table
  const skillComparison = Object.entries(career.skill_weights).map(([skill, weight]) => ({
    skill,
    weight,
    userScore: skills[skill] ?? 0,
    needThreshold: 70,
  })).sort((a, b) => b.weight - a.weight);

  return (
    <div className="min-h-screen bg-ink-50 section-padding py-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <Link to="/careers" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-ink-900 transition-colors mb-6">
        <Icon name="ArrowLeft" className="w-4 h-4" />
        All Careers
      </Link>

      {/* Header */}
      <div className="card p-8 mb-6 animate-fade-in-up">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-sq-50 flex items-center justify-center text-sq-600 flex-shrink-0">
            <Icon name={career.icon} className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="badge bg-ink-50 text-ink-600 text-xs">
                <Icon name={CATEGORY_ICONS[career.category] ?? 'Briefcase'} className="w-3 h-3" />
                {career.category}
              </span>
              {matchScore !== null && (
                <span className={`badge text-xs font-extrabold ${
                  matchScore >= 80 ? 'bg-emerald-50 text-emerald-700' :
                  matchScore >= 60 ? 'bg-sq-50 text-sq-700' :
                  'bg-ink-50 text-ink-500'
                }`}>
                  {matchScore}% Match
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900">{career.name}</h1>
            <p className="mt-2 text-ink-500 text-balance">{career.description}</p>
          </div>
        </div>

        {/* CTA */}
        {existingRoadmap ? (
          <div className="mt-4 p-4 rounded-xl bg-sq-50 border border-sq-200 flex items-center gap-3">
            <Icon name="Check" className="w-5 h-5 text-sq-600 flex-shrink-0" />
            <span className="text-sm font-semibold text-sq-800">You have a roadmap for this career.</span>
            <button onClick={() => navigate('/roadmap')} className="btn-primary text-sm ml-auto">
              View Roadmap
              <Icon name="ArrowRight" className="w-4 h-4" />
            </button>
          </div>
        ) : hasSkills ? (
          <button onClick={handleBuildRoadmap} disabled={buildingRoadmap} className="btn-primary mt-4 w-full sm:w-auto">
            {buildingRoadmap ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Building...</>
            ) : (
              <>Build My Roadmap <Icon name="Map" className="w-5 h-5" /></>
            )}
          </button>
        ) : (
          <div className="mt-4 p-4 rounded-xl bg-amber2-50 border border-amber2-200">
            <p className="text-sm text-amber2-800 font-medium">
              Complete your assessment to see your match score and build a personalized roadmap.
            </p>
            <button onClick={() => navigate('/assessment')} className="btn-primary text-sm mt-3">
              Start Assessment
            </button>
          </div>
        )}
      </div>

      {/* Why this fits */}
      {hasSkills && matchingSkills.length > 0 && (
        <div className="card p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <h2 className="text-lg font-bold text-ink-900 mb-4">Why this fits you</h2>
          <div className="space-y-2">
            {matchingSkills.map((skill) => (
              <div key={skill} className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50">
                <Icon name="Check" className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="font-semibold text-emerald-800 text-sm">
                  Strong {skill.toLowerCase()} — {skills[skill]}/100
                </span>
              </div>
            ))}
          </div>
          {skillGaps.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-bold text-ink-700 mb-2">Skills to build</h3>
              <div className="space-y-2">
                {skillGaps.slice(0, 4).map((gap) => (
                  <div key={gap.skill} className="flex items-center gap-3 p-3 rounded-xl bg-amber2-50">
                    <Icon name="TrendingUp" className="w-5 h-5 text-amber2-600 flex-shrink-0" />
                    <span className="font-semibold text-amber2-800 text-sm">
                      {gap.skill} — you're at {gap.have}, aim for {gap.need}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Skill comparison */}
      {hasSkills && (
        <div className="card p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <h2 className="text-lg font-bold text-ink-900 mb-4">Your Skills vs. Career Needs</h2>
          <div className="space-y-4">
            {skillComparison.map((row) => {
              const meets = row.userScore >= row.needThreshold;
              return (
                <div key={row.skill} className="grid grid-cols-12 gap-2 items-center">
                  <span className="col-span-5 sm:col-span-4 text-sm font-semibold text-ink-700 truncate">{row.skill}</span>
                  <div className="col-span-3 sm:col-span-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-ink-100 overflow-hidden">
                        <div className={`h-full rounded-full ${meets ? 'bg-emerald-500' : 'bg-amber2-500'}`} style={{ width: `${row.userScore}%` }} />
                      </div>
                      <span className="text-xs font-bold text-ink-600 tabular-nums w-8">{row.userScore}</span>
                    </div>
                  </div>
                  <div className="col-span-3 sm:col-span-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-ink-100 overflow-hidden">
                        <div className="h-full rounded-full bg-ink-400" style={{ width: `${row.needThreshold}%` }} />
                      </div>
                      <span className="text-xs font-bold text-ink-400 tabular-nums w-8">{row.needThreshold}</span>
                    </div>
                  </div>
                  <span className="col-span-1 text-xs font-bold text-ink-400 hidden sm:block">Need</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* What they do */}
      <div className="card p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <h2 className="text-lg font-bold text-ink-900 mb-3">What does a {career.name.toLowerCase()} do?</h2>
        <p className="text-ink-600 leading-relaxed">{career.what_they_do}</p>
      </div>

      {/* Tools and skills */}
      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
          <h2 className="text-lg font-bold text-ink-900 mb-4">Tools you'll learn</h2>
          <div className="flex flex-wrap gap-2">
            {career.tools.map((tool) => (
              <span key={tool} className="badge bg-blue-50 text-blue-700 text-xs border border-blue-200">
                {tool}
              </span>
            ))}
          </div>
        </div>
        <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <h2 className="text-lg font-bold text-ink-900 mb-4">Skills you'll develop</h2>
          <div className="flex flex-wrap gap-2">
            {career.skills_developed.map((skill) => (
              <span key={skill} className="badge bg-purple-50 text-purple-700 text-xs border border-purple-200">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      {hasSkills && !existingRoadmap && (
        <div className="card p-8 bg-gradient-to-r from-sq-600 to-sq-700 border-sq-700 text-center animate-fade-in-up" style={{ animationDelay: '350ms' }}>
          <h2 className="text-xl font-bold text-white mb-2">Ready to pursue this path?</h2>
          <p className="text-sq-100 mb-6">Get a personalized roadmap that fills your specific skill gaps.</p>
          <button onClick={handleBuildRoadmap} disabled={buildingRoadmap} className="btn bg-white text-sq-700 px-8 py-3 hover:bg-sq-50 shadow-soft-lg active:scale-[0.98]">
            {buildingRoadmap ? 'Building...' : 'Build My Roadmap'}
            {!buildingRoadmap && <Icon name="ArrowRight" className="w-5 h-5" />}
          </button>
        </div>
      )}
    </div>
  );
}
