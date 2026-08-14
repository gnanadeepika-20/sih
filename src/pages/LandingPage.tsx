import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { SkillBar } from '@/components/SkillBar';
import { useAuth } from '@/contexts/AuthContext';

const STEPS = [
  { icon: 'User', title: 'Tell us about yourself', desc: 'Share your background and what you\'re curious about.' },
  { icon: 'Zap', title: 'Play the challenges', desc: 'Interactive games that reveal how you think, not what you know.' },
  { icon: 'Brain', title: 'Discover your strengths', desc: 'See your unique skill DNA from real game performance.' },
  { icon: 'Compass', title: 'Explore career matches', desc: 'Find careers that align with your demonstrated abilities.' },
  { icon: 'Map', title: 'Build your roadmap', desc: 'Get a personalized learning path to reach your chosen career.' },
];

const PREVIEW_SKILLS = [
  { skill: 'Visual Reasoning', score: 92, color: 'bg-sq-500' },
  { skill: 'Logical Thinking', score: 89, color: 'bg-blue-500' },
  { skill: 'Problem Solving', score: 84, color: 'bg-emerald-500' },
  { skill: 'Creativity', score: 81, color: 'bg-coral-500' },
];

const PREVIEW_MATCHES = [
  { name: 'UI/UX Designer', match: 91, icon: 'Palette', color: 'bg-purple-50 text-purple-700' },
  { name: 'Software Developer', match: 87, icon: 'Code', color: 'bg-blue-50 text-blue-700' },
  { name: 'Data Analyst', match: 84, icon: 'BarChart3', color: 'bg-emerald-50 text-emerald-700' },
];

const FLOW_STEPS = [
  { label: 'Student', icon: 'User' },
  { label: 'Challenges', icon: 'Zap' },
  { label: 'Skill Discovery', icon: 'Brain' },
  { label: 'Career Matches', icon: 'Compass' },
  { label: 'Roadmap', icon: 'Map' },
];

const ACHIEVEMENTS = [
  { icon: 'Trophy', name: 'First Quest', color: 'text-amber2-600', bg: 'bg-amber2-50' },
  { icon: 'Brain', name: 'Logic Master', color: 'text-sq-600', bg: 'bg-sq-50' },
  { icon: 'Eye', name: 'Visual Thinker', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: 'Rocket', name: 'Career Ready', color: 'text-coral-600', bg: 'bg-coral-50' },
];

const LEVELS = [
  { level: 1, name: 'Explorer', xp: '0 XP' },
  { level: 2, name: 'Pathfinder', xp: '500 XP' },
  { level: 3, name: 'Skill Builder', xp: '1,200 XP' },
  { level: 4, name: 'Specialist', xp: '2,500 XP' },
  { level: 5, name: 'Career Ready', xp: '5,000 XP' },
];

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % FLOW_STEPS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-ink-50 overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sq-500 to-sq-700 flex items-center justify-center shadow-soft">
              <Icon name="Compass" className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-extrabold text-ink-900">SkillQuest</span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <button onClick={() => navigate('/dashboard')} className="btn-primary text-sm">
                Go to Dashboard
                <Icon name="ArrowRight" className="w-4 h-4" />
              </button>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm hidden sm:flex">Sign in</Link>
                <Link to="/register" className="btn-primary text-sm">
                  Start Your Quest
                  <Icon name="ArrowRight" className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-sq-200/30 rounded-full blur-3xl float-animation" style={{ animation: 'float 6s ease-in-out infinite' }} />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-coral-200/20 rounded-full blur-3xl" style={{ animation: 'float 8s ease-in-out infinite reverse' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sq-50 border border-sq-200 text-sq-700 text-sm font-semibold mb-6">
                <Icon name="Sparkles" className="w-4 h-4" />
                Discover what you're built for
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ink-900 leading-[1.1] text-balance">
                Discover What<br />You're <span className="text-sq-600">Built For.</span>
              </h1>
              <p className="mt-6 text-lg text-ink-500 max-w-xl text-balance">
                Play interactive challenges. Discover your strengths. Explore careers that fit you. Build a personalized path toward your future.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link to="/register" className="btn-primary text-base px-8 py-4">
                  <Icon name="Zap" className="w-5 h-5" />
                  Start Your Quest
                </Link>
                <Link to="/careers" className="btn-secondary text-base px-8 py-4" onClick={() => !user && navigate('/register')}>
                  <Icon name="Compass" className="w-5 h-5" />
                  Explore Careers
                </Link>
              </div>
            </div>

            {/* Interactive flow visual */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="card p-6 sm:p-8 bg-white/90 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-bold text-ink-400 uppercase tracking-wider">Your Journey</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-sq-500 animate-pulse" />
                    <span className="text-xs text-sq-600 font-semibold">Live</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {FLOW_STEPS.map((step, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-500 ${
                        activeStep === i
                          ? 'bg-sq-50 scale-[1.02] shadow-soft'
                          : 'bg-ink-50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-500 ${
                        activeStep === i ? 'bg-sq-600 text-white' : 'bg-white text-ink-400 border border-ink-200'
                      }`}>
                        <Icon name={step.icon} className="w-5 h-5" />
                      </div>
                      <span className={`font-semibold transition-colors duration-500 ${
                        activeStep === i ? 'text-sq-800' : 'text-ink-400'
                      }`}>
                        {step.label}
                      </span>
                      {activeStep === i && (
                        <Icon name="ChevronRight" className="w-5 h-5 text-sq-600 ml-auto animate-slide-in-right" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-ink-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-500 font-medium">Quest Progress</span>
                    <span className="font-bold text-sq-700">Step {activeStep + 1} / {FLOW_STEPS.length}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-ink-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sq-400 to-sq-600 rounded-full transition-all duration-700"
                      style={{ width: `${((activeStep + 1) / FLOW_STEPS.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-bold text-sq-600 uppercase tracking-wider">How SkillQuest Works</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-ink-900 text-balance">Five steps to your future</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="card-hover p-6 group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-xs font-extrabold text-sq-400 mb-3">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="w-12 h-12 rounded-xl bg-sq-50 flex items-center justify-center mb-4 group-hover:bg-sq-100 transition-colors">
                  <Icon name={step.icon} className="w-6 h-6 text-sq-600" />
                </div>
                <h3 className="font-bold text-ink-900 mb-1.5">{step.title}</h3>
                <p className="text-sm text-ink-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Challenge Preview */}
      <section className="py-20 bg-ink-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-bold text-coral-600 uppercase tracking-wider">Interactive Challenges</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-ink-900 text-balance">Play to discover, not to pass</h2>
            <p className="mt-3 text-ink-500 max-w-2xl mx-auto">These challenges aren't tests. They're clues about how your mind works.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Pattern Quest', icon: 'Grid3x3', color: 'blue', skills: 'Pattern Recognition · Logic', desc: 'Spot the next shape in a sequence.' },
              { name: 'Memory Matrix', icon: 'LayoutGrid', color: 'green', skills: 'Memory · Attention', desc: 'Remember and reproduce the grid.' },
              { name: 'Shape Shift', icon: 'Shapes', color: 'orange', skills: 'Visual · Spatial', desc: 'Mentally rotate shapes to match.' },
              { name: 'Logic Lab', icon: 'FlaskConical', color: 'red', skills: 'Analysis · Problem Solving', desc: 'Solve analytical puzzles by deduction.' },
              { name: 'Creative Lab', icon: 'Palette', color: 'purple', skills: 'Creativity · Visual Thinking', desc: 'Generate novel associations.' },
              { name: 'Decision Dash', icon: 'Zap', color: 'amber', skills: 'Decision · Strategy', desc: 'Make fast decisions under pressure.' },
            ].map((game, i) => {
              const colorMap: Record<string, string> = {
                blue: 'bg-blue-50 text-blue-600 border-blue-200',
                green: 'bg-emerald-50 text-emerald-600 border-emerald-200',
                orange: 'bg-orange-50 text-orange-600 border-orange-200',
                red: 'bg-red-50 text-red-600 border-red-200',
                purple: 'bg-purple-50 text-purple-600 border-purple-200',
                amber: 'bg-amber2-50 text-amber2-600 border-amber2-200',
              };
              return (
                <div key={i} className="card-hover p-6 cursor-pointer group" onClick={() => navigate('/register')}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border ${colorMap[game.color]}`}>
                    <Icon name={game.icon} className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-ink-900 mb-1">{game.name}</h3>
                  <p className="text-sm text-ink-500 mb-3">{game.desc}</p>
                  <div className="flex items-center gap-2 text-xs text-ink-400">
                    <Icon name="Clock" className="w-3.5 h-3.5" />
                    <span>{game.skills}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-sq-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon name="Play" className="w-4 h-4" />
                    Try it
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Skill Discovery Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-bold text-sq-600 uppercase tracking-wider">Skill Discovery</span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-ink-900 text-balance">Your Skill DNA, revealed</h2>
              <p className="mt-4 text-ink-500 text-balance">
                Every challenge you play generates real performance data. We turn that into a detailed skill profile — no self-assessment, no guessing. Just your actual abilities, visualized.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  '13 cognitive skills measured across 6 challenges',
                  'Scores based on accuracy, speed, and difficulty',
                  'Visualized as an interactive skill profile',
                  'Deterministic — your scores reflect your play',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-sq-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name="Check" className="w-3 h-3 text-sq-700" />
                    </div>
                    <span className="text-ink-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-8 bg-gradient-to-br from-white to-sq-50/50">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-sq-100 flex items-center justify-center">
                  <Icon name="Brain" className="w-5 h-5 text-sq-600" />
                </div>
                <span className="font-bold text-ink-900">Your Skill Snapshot</span>
              </div>
              <div className="space-y-4">
                {PREVIEW_SKILLS.map((s, i) => (
                  <SkillBar key={i} skill={s.skill} score={s.score} color={s.color} delay={i * 200} />
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-ink-100">
                <p className="text-sm text-ink-500 italic">
                  "You perform especially well when problems involve visual patterns and structured reasoning."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Matching Preview */}
      <section className="py-20 bg-ink-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-72 h-72 bg-sq-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-coral-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="card p-6 bg-ink-800 border-ink-700">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-bold text-white">Your Top Matches</span>
                  <span className="badge bg-sq-500/20 text-sq-300">Ranked by fit</span>
                </div>
                <div className="space-y-3">
                  {PREVIEW_MATCHES.map((m, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-ink-700/50 hover:bg-ink-700 transition-colors group cursor-pointer">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${m.color}`}>
                        <Icon name={m.icon} className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white">{m.name}</h3>
                        <div className="mt-1.5 h-1.5 rounded-full bg-ink-600 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-sq-400 to-sq-300 rounded-full transition-all duration-1000"
                            style={{ width: `${m.match}%`, transitionDelay: `${i * 200}ms` }}
                          />
                        </div>
                      </div>
                      <span className="text-xl font-extrabold text-sq-300">{m.match}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 text-white">
              <span className="text-sm font-bold text-sq-400 uppercase tracking-wider">Career Matching</span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-balance">Careers that fit how you think</h2>
              <p className="mt-4 text-ink-300 text-balance">
                Your skill profile is matched against real career requirements. We show you why each career fits, where your strengths align, and what skills you'd need to build.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  '12 career profiles across 8 categories',
                  'Weighted skill matching — not random',
                  'See your skill gaps for each career',
                  'Explore before you commit',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-sq-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name="Check" className="w-3 h-3 text-sq-400" />
                    </div>
                    <span className="text-ink-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-bold text-coral-600 uppercase tracking-wider">Personalized Roadmap</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-ink-900 text-balance">A clear path from here to your career</h2>
            <p className="mt-3 text-ink-500 max-w-2xl mx-auto">
              Choose a career and we generate a step-by-step learning path that fills your specific skill gaps — not a generic curriculum.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-ink-100" />
              {[
                { icon: 'Compass', title: 'Foundations', desc: 'Start with the basics', color: 'bg-sq-100 text-sq-700' },
                { icon: 'Palette', title: 'Design Fundamentals', desc: 'Build core skills', color: 'bg-blue-100 text-blue-700' },
                { icon: 'PenTool', title: 'Figma Mastery', desc: 'Learn the tools', color: 'bg-purple-100 text-purple-700' },
                { icon: 'Search', title: 'UX Research', desc: 'Fill your skill gaps', color: 'bg-amber2-100 text-amber2-700' },
                { icon: 'FileKanban', title: 'Real Project', desc: 'Apply what you learned', color: 'bg-coral-100 text-coral-700' },
                { icon: 'Briefcase', title: 'Career Ready', desc: 'You made it', color: 'bg-emerald-100 text-emerald-700' },
              ].map((node, i) => (
                <div
                  key={i}
                  className="relative flex items-center gap-6 mb-6 last:mb-0 group"
                  style={{ animation: `fadeInUp 0.5s ease-out ${i * 100}ms both` }}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 z-10 border-4 border-white shadow-soft ${node.color} group-hover:scale-110 transition-transform`}>
                    <Icon name={node.icon} className="w-6 h-6" />
                  </div>
                  <div className="card-hover flex-1 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-ink-900">{node.title}</h3>
                        <p className="text-sm text-ink-500">{node.desc}</p>
                      </div>
                      <span className="badge bg-ink-50 text-ink-500 text-xs">Phase {i + 1}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gamification */}
      <section className="py-20 bg-ink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-bold text-amber2-600 uppercase tracking-wider">Gamification</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-ink-900 text-balance">Stay motivated, level up</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* XP & Levels */}
            <div className="card p-8">
              <div className="flex items-center gap-2 mb-6">
                <Icon name="Zap" className="w-6 h-6 text-amber2-600" />
                <h3 className="text-xl font-bold text-ink-900">XP & Levels</h3>
              </div>
              <div className="space-y-3">
                {LEVELS.map((l) => (
                  <div key={l.level} className="flex items-center gap-4 p-3 rounded-xl bg-ink-50">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber2-400 to-amber2-600 flex items-center justify-center text-white font-extrabold">
                      {l.level}
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-ink-900">{l.name}</span>
                      <span className="text-sm text-ink-400 ml-2">{l.xp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges & Streaks */}
            <div className="space-y-8">
              <div className="card p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Icon name="Award" className="w-6 h-6 text-sq-600" />
                  <h3 className="text-xl font-bold text-ink-900">Achievements</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {ACHIEVEMENTS.map((a, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-ink-50">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.bg}`}>
                        <Icon name={a.icon} className={`w-5 h-5 ${a.color}`} />
                      </div>
                      <span className="font-semibold text-sm text-ink-700">{a.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-8 bg-gradient-to-br from-coral-50 to-amber2-50 border-coral-200">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-coral-400 to-coral-600 flex items-center justify-center">
                    <Icon name="Flame" className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-ink-900">Daily Streaks</h3>
                    <p className="text-sm text-ink-600">Keep your streak alive by playing every day</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-sq-600 to-sq-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white text-balance">
            Ready to discover what you're built for?
          </h2>
          <p className="mt-4 text-lg text-sq-100 text-balance">
            Join SkillQuest and turn your curiosity into a clear career path.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="btn bg-white text-sq-700 px-8 py-4 text-base hover:bg-sq-50 shadow-soft-lg active:scale-[0.98]">
              <Icon name="Zap" className="w-5 h-5" />
              Start Your Quest
            </Link>
            {user && (
              <Link to="/dashboard" className="btn bg-sq-500/20 text-white border-2 border-white/30 px-8 py-4 text-base hover:bg-sq-500/30 active:scale-[0.98]">
                Go to Dashboard
                <Icon name="ArrowRight" className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-ink-900 text-ink-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sq-500 to-sq-700 flex items-center justify-center">
              <Icon name="Compass" className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">SkillQuest</span>
          </div>
          <p className="text-sm">A gamified career discovery platform. Play. Discover. Build your future.</p>
        </div>
      </footer>
    </div>
  );
}
