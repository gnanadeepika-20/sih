import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { useAuth } from '@/contexts/AuthContext';

const EDUCATION_OPTIONS = [
  { value: '12th Student', icon: 'BookOpen' },
  { value: 'College Student', icon: 'Layout' },
  { value: 'Graduate', icon: 'Briefcase' },
  { value: 'Working Professional', icon: 'Briefcase' },
  { value: 'Career Explorer', icon: 'Compass' },
];

const SITUATION_OPTIONS = [
  { value: '12th Student', icon: 'BookOpen' },
  { value: 'College Student', icon: 'Layout' },
  { value: 'Working Professional', icon: 'Briefcase' },
  { value: 'Exploring a Career Change', icon: 'Compass' },
];

export default function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [education, setEducation] = useState('');
  const [situation, setSituation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    if (step === 1 && name && email && password) {
      setStep(2);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!education || !situation) return;
    setError(null);
    setLoading(true);

    const { error } = await signUp(email, password, name);
    if (error) {
      setError(error);
      setLoading(false);
      setStep(1);
    } else {
      sessionStorage.setItem('sq_education', education);
      sessionStorage.setItem('sq_situation', situation);
      navigate('/onboarding');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-50 px-4 py-8 relative overflow-hidden">
      <div className="absolute top-20 right-10 w-72 h-72 bg-sq-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-coral-200/20 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sq-500 to-sq-700 flex items-center justify-center shadow-soft">
            <Icon name="Compass" className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-extrabold text-ink-900">SkillQuest</span>
        </Link>

        <div className="card p-8 animate-fade-in-up">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-sq-500 flex-1' : 'bg-ink-200 flex-1'}`} />
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-sq-500 flex-1' : 'bg-ink-200 flex-1'}`} />
          </div>

          {step === 1 ? (
            <>
              <h1 className="text-2xl font-extrabold text-ink-900 mb-2">Begin your adventure</h1>
              <p className="text-ink-500 mb-6">Create your account to start discovering.</p>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-coral-50 border border-coral-200 text-coral-700 text-sm font-medium animate-fade-in">
                  {error}
                </div>
              )}

              <form onSubmit={handleNext} className="space-y-4">
                <div>
                  <label className="label" htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                    placeholder="Alex Explorer"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label className="label" htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label className="label" htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                  />
                </div>
                <button type="submit" className="btn-primary w-full">
                  Continue
                  <Icon name="ArrowRight" className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-extrabold text-ink-900 mb-2">Tell us about you</h1>
              <p className="text-ink-500 mb-6">This helps us personalize your experience.</p>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-coral-50 border border-coral-200 text-coral-700 text-sm font-medium animate-fade-in">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label">Education level</label>
                  <div className="grid grid-cols-1 gap-2">
                    {EDUCATION_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setEducation(opt.value)}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                          education === opt.value
                            ? 'border-sq-500 bg-sq-50'
                            : 'border-ink-200 hover:border-sq-300'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          education === opt.value ? 'bg-sq-600 text-white' : 'bg-ink-100 text-ink-500'
                        }`}>
                          <Icon name={opt.icon} className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-sm text-ink-700">{opt.value}</span>
                        {education === opt.value && <Icon name="Check" className="w-5 h-5 text-sq-600 ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label">Current situation</label>
                  <div className="grid grid-cols-1 gap-2">
                    {SITUATION_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setSituation(opt.value)}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                          situation === opt.value
                            ? 'border-sq-500 bg-sq-50'
                            : 'border-ink-200 hover:border-sq-300'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          situation === opt.value ? 'bg-sq-600 text-white' : 'bg-ink-100 text-ink-500'
                        }`}>
                          <Icon name={opt.icon} className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-sm text-ink-700">{opt.value}</span>
                        {situation === opt.value && <Icon name="Check" className="w-5 h-5 text-sq-600 ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">
                    <Icon name="ArrowLeft" className="w-4 h-4" />
                    Back
                  </button>
                  <button type="submit" disabled={loading || !education || !situation} className="btn-primary flex-1">
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Create Account
                        <Icon name="ArrowRight" className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}

          <p className="mt-6 text-center text-sm text-ink-500">
            Already have an account?{' '}
            <Link to="/login" className="text-sq-600 font-semibold hover:text-sq-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
