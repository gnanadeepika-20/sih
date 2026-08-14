import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { useAuth } from '@/contexts/AuthContext';

const SITUATIONS = [
  { value: '12th Student', icon: 'BookOpen', desc: 'Finishing school' },
  { value: 'College Student', icon: 'Layout', desc: 'In college now' },
  { value: 'Working Professional', icon: 'Briefcase', desc: 'Currently employed' },
  { value: 'Exploring a Career Change', icon: 'Compass', desc: 'Considering a switch' },
];

const DOMAINS = [
  { value: 'Technology', icon: 'Code', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { value: 'Design', icon: 'Palette', color: 'bg-purple-50 text-purple-600 border-purple-200' },
  { value: 'Data', icon: 'BarChart3', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  { value: 'Business', icon: 'Briefcase', color: 'bg-amber2-50 text-amber2-600 border-amber2-200' },
  { value: 'Science', icon: 'FlaskConical', color: 'bg-red-50 text-red-600 border-red-200' },
  { value: 'Marketing', icon: 'Megaphone', color: 'bg-coral-50 text-coral-600 border-coral-200' },
  { value: 'Finance', icon: 'DollarSign', color: 'bg-teal-50 text-teal-600 border-teal-200' },
  { value: 'Creative', icon: 'Brush', color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
];

const GOALS = [
  { value: 'My strengths', icon: 'Brain' },
  { value: 'A career direction', icon: 'Compass' },
  { value: 'A new career', icon: 'Rocket' },
  { value: 'Whether my current career fits', icon: 'Check' },
  { value: 'A personalized learning path', icon: 'Map' },
];

export default function OnboardingPage() {
  const { user, profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [situation, setSituation] = useState('');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [goal, setGoal] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill from registration
  useState(() => {
    const edu = sessionStorage.getItem('sq_education');
    const sit = sessionStorage.getItem('sq_situation');
    if (sit) setSituation(sit);
  });

  function toggleDomain(domain: string) {
    setSelectedDomains((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    );
  }

  const TOTAL_STEPS = 3;

  async function handleFinish() {
    if (!user) {
      setError('User not authenticated. Please log in again.');
      return;
    }
    setSaving(true);
    setError(null);

    try {
      const { error } = await updateProfile({
        education_level: sessionStorage.getItem('sq_education') || situation,
        current_situation: situation,
        interests: selectedDomains,
        discovery_goal: goal,
        onboarding_completed: true,
      });

      sessionStorage.removeItem('sq_education');
      sessionStorage.removeItem('sq_situation');

      if (error) {
        setError(error);
        setSaving(false);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete onboarding');
      setSaving(false);
    }
  }

  function canProceed() {
    if (step === 0) return !!situation;
    if (step === 1) return selectedDomains.length > 0;
    if (step === 2) return !!goal;
    return false;
  }

  function handleNext() {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-50 px-4 py-8 relative overflow-hidden">
      <div className="absolute top-20 right-10 w-72 h-72 bg-sq-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-coral-200/20 rounded-full blur-3xl" />

      <div className="relative w-full max-w-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sq-500 to-sq-700 flex items-center justify-center shadow-soft">
            <Icon name="Compass" className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-extrabold text-ink-900">SkillQuest</span>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-500 ${
                i === step ? 'bg-sq-600 w-8' : i < step ? 'bg-sq-400 w-2' : 'bg-ink-200 w-2'
              }`}
            />
          ))}
        </div>

        <div className="card p-8 sm:p-10 animate-fade-in-up" key={step}>
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-coral-50 border border-coral-200 text-coral-700 text-sm font-medium animate-fade-in">
              {error}
            </div>
          )}

          {step === 0 && (
            <div className="animate-fade-in">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 mb-3 text-balance">
                Where are you right now?
              </h1>
              <p className="text-ink-500 mb-8">This helps us tailor your quest.</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {SITUATIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSituation(opt.value)}
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${
                      situation === opt.value
                        ? 'border-sq-500 bg-sq-50 scale-[1.02] shadow-soft'
                        : 'border-ink-200 hover:border-sq-300 hover:bg-ink-50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      situation === opt.value ? 'bg-sq-600 text-white' : 'bg-ink-100 text-ink-500'
                    }`}>
                      <Icon name={opt.icon} className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-ink-900">{opt.value}</div>
                      <div className="text-sm text-ink-500">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="animate-fade-in">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 mb-3 text-balance">
                What are you curious about?
              </h1>
              <p className="text-ink-500 mb-8">Pick all that spark your interest. You can change these later.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {DOMAINS.map((domain) => {
                  const selected = selectedDomains.includes(domain.value);
                  return (
                    <button
                      key={domain.value}
                      onClick={() => toggleDomain(domain.value)}
                      className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${
                        selected
                          ? 'border-sq-500 bg-sq-50 scale-[1.02] shadow-soft'
                          : 'border-ink-200 hover:border-sq-300 hover:bg-ink-50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${domain.color} ${
                        selected ? 'scale-110' : ''
                      } transition-transform`}>
                        <Icon name={domain.icon} className="w-6 h-6" />
                      </div>
                      <span className={`font-semibold text-sm ${selected ? 'text-sq-800' : 'text-ink-700'}`}>
                        {domain.value}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 mb-3 text-balance">
                What do you want SkillQuest to help you discover?
              </h1>
              <p className="text-ink-500 mb-8">We'll focus your quest around this goal.</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {GOALS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setGoal(opt.value)}
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${
                      goal === opt.value
                        ? 'border-sq-500 bg-sq-50 scale-[1.02] shadow-soft'
                        : 'border-ink-200 hover:border-sq-300 hover:bg-ink-50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      goal === opt.value ? 'bg-sq-600 text-white' : 'bg-ink-100 text-ink-500'
                    }`}>
                      <Icon name={opt.icon} className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-ink-900">{opt.value}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            {step > 0 ? (
              <button onClick={() => setStep(step - 1)} className="btn-ghost">
                <Icon name="ArrowLeft" className="w-4 h-4" />
                Back
              </button>
            ) : <div />}

            <button
              onClick={handleNext}
              disabled={!canProceed() || saving}
              className="btn-primary"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : step === TOTAL_STEPS - 1 ? (
                <>
                  Start Quest
                  <Icon name="Zap" className="w-4 h-4" />
                </>
              ) : (
                <>
                  Continue
                  <Icon name="ArrowRight" className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
