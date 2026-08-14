import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { LoadingSpinner, ErrorState, EmptyState, PageHeader } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { fetchCareers, fetchRecommendations, fetchSkillProfile } from '@/lib/dataApi';
import { matchCareers } from '@/lib/skillEngine';
import type { Career, Recommendation, SkillProfile } from '@/lib/types';

const CATEGORIES = ['All', 'Technology', 'Design', 'Data', 'Business', 'Science', 'Marketing', 'Creative', 'Finance'];

const CATEGORY_ICONS: Record<string, string> = {
  Technology: 'Code',
  Design: 'Palette',
  Data: 'BarChart3',
  Business: 'Briefcase',
  Science: 'FlaskConical',
  Marketing: 'Megaphone',
  Creative: 'Brush',
  Finance: 'DollarSign',
};

export default function CareersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [careers, setCareers] = useState<Career[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [skillProfile, setSkillProfile] = useState<SkillProfile | null>(null);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  async function loadData() {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [careersData, recs, skills] = await Promise.all([
        fetchCareers(),
        fetchRecommendations(user.id),
        fetchSkillProfile(user.id),
      ]);
      setCareers(careersData);
      setRecommendations(recs);
      setSkillProfile(skills);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load careers');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [user]);

  // Build match score lookup
  const matchMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const rec of recommendations) {
      map[rec.career_id] = Math.round(rec.match_score);
    }
    // If no recommendations, compute from skill profile
    if (recommendations.length === 0 && skillProfile) {
      const matches = matchCareers(skillProfile.skills, careers);
      for (const m of matches) {
        map[m.career.id] = m.matchScore;
      }
    }
    return map;
  }, [recommendations, skillProfile, careers]);

  // Filter careers
  const filteredCareers = useMemo(() => {
    let result = careers;
    if (category !== 'All') {
      result = result.filter(c => c.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    // Sort by match score descending
    return result.sort((a, b) => (matchMap[b.id] ?? 0) - (matchMap[a.id] ?? 0));
  }, [careers, category, search, matchMap]);

  if (loading) return <LoadingSpinner size="lg" label="Loading careers..." />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  const hasSkills = skillProfile && Object.keys(skillProfile.skills).length > 0;

  return (
    <div className="min-h-screen bg-ink-50 section-padding py-8 max-w-6xl mx-auto">
      <PageHeader
        title="Careers That Fit Your Strengths"
        subtitle="These aren't predictions of your future. They're career paths that align with the abilities you've demonstrated."
      />

      {!hasSkills && (
        <div className="card p-5 mb-6 bg-amber2-50 border-amber2-200 animate-fade-in">
          <div className="flex items-center gap-3">
            <Icon name="Lightbulb" className="w-5 h-5 text-amber2-600 flex-shrink-0" />
            <p className="text-sm text-amber2-800 font-medium">
              Complete your assessment to get personalized career match scores.
            </p>
            <button onClick={() => navigate('/assessment')} className="btn-primary text-sm ml-auto flex-shrink-0">
              Start Assessment
            </button>
          </div>
        </div>
      )}

      {/* Search and filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Icon name="Search" className="w-5 h-5 text-ink-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search careers..."
            className="input pl-12"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                category === cat
                  ? 'bg-sq-600 text-white shadow-soft'
                  : 'bg-white text-ink-600 border border-ink-200 hover:border-sq-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Career cards */}
      {filteredCareers.length === 0 ? (
        <EmptyState
          icon="Compass"
          title="No careers found"
          message="Try a different search or category filter."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCareers.map((career, i) => {
            const matchScore = matchMap[career.id];
            const hasMatch = matchScore !== undefined;

            return (
              <Link
                key={career.id}
                to={`/careers/${career.id}`}
                className="card-hover p-6 group animate-fade-in-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-sq-50 flex items-center justify-center text-sq-600">
                    <Icon name={career.icon} className="w-6 h-6" />
                  </div>
                  {hasMatch && (
                    <div className={`px-3 py-1.5 rounded-full text-sm font-extrabold ${
                      matchScore >= 80 ? 'bg-emerald-50 text-emerald-700' :
                      matchScore >= 60 ? 'bg-sq-50 text-sq-700' :
                      'bg-ink-50 text-ink-500'
                    }`}>
                      {matchScore}% match
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold text-ink-900 mb-1.5 group-hover:text-sq-700 transition-colors">{career.name}</h3>
                <p className="text-sm text-ink-500 mb-4 line-clamp-2">{career.description}</p>

                <div className="flex items-center gap-2 mb-4">
                  <span className="badge bg-ink-50 text-ink-600 text-xs">
                    <Icon name={CATEGORY_ICONS[career.category] ?? 'Briefcase'} className="w-3 h-3" />
                    {career.category}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-sm font-semibold text-sq-600 group-hover:gap-2 transition-all">
                  Explore Career
                  <Icon name="ArrowRight" className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
