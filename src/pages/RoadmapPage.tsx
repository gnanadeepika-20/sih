import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { LoadingSpinner, ErrorState, EmptyState, PageHeader } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { fetchRoadmap, toggleRoadmapTask } from '@/lib/dataApi';
import type { Roadmap, RoadmapTask } from '@/lib/types';

export default function RoadmapPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [tasks, setTasks] = useState<RoadmapTask[]>([]);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  async function loadData() {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { roadmap, tasks } = await fetchRoadmap(user.id);
      setRoadmap(roadmap);
      setTasks(tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load your roadmap');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [user]);

  async function handleToggle(task: RoadmapTask) {
    if (!user || !roadmap) return;
    setToggling(task.id);
    try {
      await toggleRoadmapTask(task.id, user.id, roadmap.id, task.status, task.xp);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    } finally {
      setToggling(null);
    }
  }

  if (loading) return <LoadingSpinner size="lg" label="Loading your journey..." />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-ink-50 section-padding py-8 max-w-4xl mx-auto">
        <PageHeader title="Your Career Journey" subtitle="A personalized learning path to reach your chosen career." />
        <EmptyState
          icon="Map"
          title="No journey yet"
          message="Choose a career to build your personalized roadmap. It adapts to your current skills and fills your specific gaps."
          actionLabel="Explore Careers"
          onAction={() => navigate('/careers')}
        />
      </div>
    );
  }

  // Group tasks by phase
  const phases: Record<number, RoadmapTask[]> = {};
  for (const task of tasks) {
    if (!phases[task.phase]) phases[task.phase] = [];
    phases[task.phase].push(task);
  }

  const phaseNumbers = Object.keys(phases).map(Number).sort((a, b) => a - b);
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const progressPct = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // Roadmap template icons per phase
  const phaseIcons: Record<number, string> = {};
  const defaultIcons = ['Compass', 'Palette', 'PenTool', 'Search', 'FileKanban', 'Briefcase'];
  for (const pn of phaseNumbers) {
    phaseIcons[pn] = defaultIcons[(pn - 1) % defaultIcons.length];
  }

  return (
    <div className="min-h-screen bg-ink-50 section-padding py-8 max-w-4xl mx-auto">
      <PageHeader title="Your Career Journey" subtitle={`A personalized path to becoming a ${roadmap.career_name}.`}>
        {/* Progress overview */}
        <div className="card p-5 mt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Icon name="Map" className="w-5 h-5 text-sq-600" />
              <span className="font-bold text-ink-900">{roadmap.career_name}</span>
            </div>
            <span className="text-sm font-semibold text-ink-500">{completedTasks} / {tasks.length} checkpoints</span>
          </div>
          <div className="h-3 rounded-full bg-ink-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sq-400 to-sq-600 rounded-full transition-all duration-1000"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-bold text-sq-700">{progressPct}% complete</span>
            {progressPct === 100 && (
              <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Icon name="Check" className="w-3 h-3" />
                Career Ready!
              </span>
            )}
          </div>
        </div>
      </PageHeader>

      {/* Roadmap path */}
      <div className="relative mt-8">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-ink-100" />

        {phaseNumbers.map((phaseNum, phaseIdx) => {
          const phaseTasks = phases[phaseNum];
          const phaseComplete = phaseTasks.every(t => t.status === 'completed');
          const phaseInProgress = phaseTasks.some(t => t.status === 'completed') && !phaseComplete;

          return (
            <div key={phaseNum} className="relative mb-8 animate-fade-in-up" style={{ animationDelay: `${phaseIdx * 100}ms` }}>
              {/* Phase node */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 z-10 border-4 border-white shadow-soft ${
                  phaseComplete ? 'bg-emerald-500 text-white' :
                  phaseInProgress ? 'bg-sq-500 text-white' :
                  'bg-white text-ink-400 border-ink-200'
                }`}>
                  {phaseComplete ? (
                    <Icon name="Check" className="w-6 h-6" />
                  ) : (
                    <Icon name={phaseIcons[phaseNum] ?? 'Circle'} className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink-400 uppercase tracking-wider">Phase {phaseNum}</span>
                    {phaseComplete && <span className="badge bg-emerald-50 text-emerald-700 text-xs">Complete</span>}
                    {phaseInProgress && <span className="badge bg-sq-50 text-sq-700 text-xs">In Progress</span>}
                  </div>
                  <h3 className="text-lg font-bold text-ink-900">{phaseTasks[0]?.title?.split(':')[0] || `Phase ${phaseNum}`}</h3>
                </div>
              </div>

              {/* Tasks */}
              <div className="ml-16 space-y-2">
                {phaseTasks.map((task) => {
                  const isExpanded = expandedTask === task.id;
                  const isCompleted = task.status === 'completed';

                  return (
                    <div
                      key={task.id}
                      className={`card p-4 transition-all cursor-pointer ${isCompleted ? 'opacity-75' : ''} ${isExpanded ? 'ring-2 ring-sq-300' : ''}`}
                      onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleToggle(task); }}
                          disabled={toggling === task.id}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                            isCompleted
                              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                              : 'bg-ink-100 text-ink-400 hover:bg-sq-100 hover:text-sq-600'
                          }`}
                        >
                          {toggling === task.id ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Icon name="Check" className="w-4 h-4" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-sm ${isCompleted ? 'text-ink-500 line-through' : 'text-ink-900'}`}>
                            {task.title}
                          </p>
                          {isExpanded && (
                            <div className="mt-3 space-y-3 animate-fade-in">
                              <p className="text-sm text-ink-600">{task.description}</p>
                              {task.skill && (
                                <div className="flex items-center gap-2">
                                  <Icon name="Brain" className="w-4 h-4 text-sq-500" />
                                  <span className="text-xs font-semibold text-sq-600">Skill: {task.skill}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <div className="px-2.5 py-1 rounded-lg bg-amber2-50 text-amber2-700 text-xs font-bold flex items-center gap-1">
                                  <Icon name="Zap" className="w-3 h-3" />
                                  +{task.xp} XP
                                </div>
                                {isCompleted && task.completed_at && (
                                  <span className="text-xs text-ink-400">
                                    Completed {new Date(task.completed_at).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <Icon
                          name={isExpanded ? 'ChevronLeft' : 'ChevronRight'}
                          className="w-4 h-4 text-ink-300 flex-shrink-0"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Finish node */}
        <div className="relative flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: `${phaseNumbers.length * 100}ms` }}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 z-10 border-4 border-white shadow-soft ${
            progressPct === 100 ? 'bg-gradient-to-br from-sq-500 to-sq-700 text-white' : 'bg-ink-100 text-ink-300'
          }`}>
            <Icon name="Rocket" className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-ink-400 uppercase tracking-wider">Finish</span>
            <h3 className={`text-lg font-bold ${progressPct === 100 ? 'text-sq-700' : 'text-ink-400'}`}>
              Career Ready
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
