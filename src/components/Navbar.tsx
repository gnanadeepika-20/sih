import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Icon } from '@/components/Icon';
import { getLevelInfo } from '@/lib/skillEngine';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: 'Home' },
  { to: '/assessment', label: 'Quests', icon: 'Zap' },
  { to: '/skills', label: 'Skills', icon: 'Brain' },
  { to: '/careers', label: 'Careers', icon: 'Compass' },
  { to: '/roadmap', label: 'Journey', icon: 'Map' },
  { to: '/progress', label: 'Progress', icon: 'TrendingUp' },
];

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (!user) return null;

  const levelInfo = profile ? getLevelInfo(profile.xp) : null;

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-md shadow-soft' : 'bg-white/70 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <NavLink to="/dashboard" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sq-500 to-sq-700 flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
                <Icon name="Compass" className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-extrabold text-ink-900 hidden sm:block">SkillQuest</span>
            </NavLink>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-sq-50 text-sq-700'
                        : 'text-ink-500 hover:text-ink-900 hover:bg-ink-50'
                    }`
                  }
                >
                  <Icon name={link.icon} className="w-4 h-4" />
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* User area */}
            <div className="flex items-center gap-3">
              {levelInfo && (
                <NavLink
                  to="/dashboard"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                  title="Your Cognitive Companion"
                >
                  <span className="text-sm">
                    {localStorage.getItem('sq_pet_type') === 'kitten'
                      ? '🐱'
                      : localStorage.getItem('sq_pet_type') === 'fox'
                      ? '🦊'
                      : localStorage.getItem('sq_pet_type') === 'puppy'
                      ? '🐶'
                      : '🐰'}
                  </span>
                  <span className="text-xs font-bold text-emerald-700">Companion</span>
                </NavLink>
              )}
              {levelInfo && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber2-50 border border-amber2-200">
                  <Icon name="Flame" className="w-4 h-4 text-amber2-600" />
                  <span className="text-xs font-bold text-amber2-700">{profile?.streak ?? 0} day streak</span>
                </div>
              )}
              {levelInfo && (
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sq-50 border border-sq-200">
                  <span className="text-xs font-bold text-sq-700">Lv.{levelInfo.level}</span>
                  <span className="text-xs text-sq-600">{levelInfo.name}</span>
                </div>
              )}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-ink-100 transition-colors"
                aria-label="Toggle menu"
              >
                <Icon name={mobileOpen ? 'X' : 'Menu'} className="w-5 h-5 text-ink-700" />
              </button>
              <button
                onClick={handleSignOut}
                className="hidden md:flex btn-ghost text-sm"
                aria-label="Sign out"
              >
                <Icon name="LogOut" className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-ink-100 bg-white animate-fade-in">
            <nav className="px-4 py-3 space-y-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      isActive ? 'bg-sq-50 text-sq-700' : 'text-ink-600 hover:bg-ink-50'
                    }`
                  }
                >
                  <Icon name={link.icon} className="w-4 h-4" />
                  {link.label}
                </NavLink>
              ))}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-coral-600 hover:bg-coral-50 transition-colors"
              >
                <Icon name="LogOut" className="w-4 h-4" />
                Sign out
              </button>
            </nav>
          </div>
        )}
      </header>
      <div className="h-16" />
    </>
  );
}
