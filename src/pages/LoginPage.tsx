import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-50 px-4 relative overflow-hidden">
      <div className="absolute top-20 right-10 w-72 h-72 bg-sq-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-coral-200/20 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sq-500 to-sq-700 flex items-center justify-center shadow-soft">
            <Icon name="Compass" className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-extrabold text-ink-900">SkillQuest</span>
        </Link>

        <div className="card p-8 animate-fade-in-up">
          <h1 className="text-2xl font-extrabold text-ink-900 mb-2">Welcome back, Explorer</h1>
          <p className="text-ink-500 mb-6">Sign in to continue your quest.</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-coral-50 border border-coral-200 text-coral-700 text-sm font-medium animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <Icon name="ArrowRight" className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-sq-600 font-semibold hover:text-sq-700">
              Start your quest
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
