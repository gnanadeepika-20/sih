import { supabase } from '@/lib/supabase';
import type { Profile, Game, Career, Achievement, GameAttempt, SkillProfile, Recommendation, Roadmap, RoadmapTask, SkillMap } from '@/lib/types';
import { computeSkillProfile, matchCareers, gameResultToSkillEvidence, getLevelInfo } from '@/lib/skillEngine';

export const MOCK_GAMES: Game[] = [
  {
    id: 'pattern-quest',
    name: 'Pattern Quest',
    category: 'spatial',
    description: 'Deconstruct complex spatial sequences and predict structural transformations.',
    skills: ['Spatial Reasoning', 'Working Memory'],
    skill_primary: 'Spatial Reasoning',
    skill_secondary: 'Working Memory',
    difficulty: 'Medium',
    icon: 'Grid',
    icon_name: 'Grid',
    color: 'blue',
    color_theme: '#3525CD',
    estimated_time: '3-5 min',
    sort_order: 1,
  },
  {
    id: 'logic-lab',
    name: 'Logic Lab',
    category: 'logic',
    description: 'Solve Boolean truth gates and algorithmic flow networks.',
    skills: ['Logical Deduction', 'Problem Solving'],
    skill_primary: 'Logical Deduction',
    skill_secondary: 'Problem Solving',
    difficulty: 'Hard',
    icon: 'Cpu',
    icon_name: 'Cpu',
    color: 'blue',
    color_theme: '#3525CD',
    estimated_time: '4-6 min',
    sort_order: 2,
  },
  {
    id: 'memory-matrix',
    name: 'Memory Matrix',
    category: 'memory',
    description: 'Retain and manipulate multi-layered grid configurations under time pressure.',
    skills: ['Working Memory', 'Attention'],
    skill_primary: 'Working Memory',
    skill_secondary: 'Attention',
    difficulty: 'Medium',
    icon: 'Brain',
    icon_name: 'Brain',
    color: 'emerald',
    color_theme: '#0284C7',
    estimated_time: '2-4 min',
    sort_order: 3,
  },
  {
    id: 'shape-shift',
    name: 'Shape Shift',
    category: 'spatial',
    description: 'Rotate and fit 3D geometry fragments into target blueprints.',
    skills: ['Spatial Reasoning', 'Pattern Recognition'],
    skill_primary: 'Spatial Reasoning',
    skill_secondary: 'Pattern Recognition',
    difficulty: 'Medium',
    icon: 'Box',
    icon_name: 'Box',
    color: 'orange',
    color_theme: '#E05638',
    estimated_time: '3-5 min',
    sort_order: 4,
  },
  {
    id: 'decision-dash',
    name: 'Decision Dash',
    category: 'analytical',
    description: 'Synthesize fast-moving numerical data and optimize real-time decisions.',
    skills: ['Analytical Thinking', 'Speed & Focus'],
    skill_primary: 'Analytical Thinking',
    skill_secondary: 'Speed & Focus',
    difficulty: 'Hard',
    icon: 'Zap',
    icon_name: 'Zap',
    color: 'red',
    color_theme: '#059669',
    estimated_time: '3-5 min',
    sort_order: 5,
  },
  {
    id: 'creative-lab',
    name: 'Creative Lab',
    category: 'creative',
    description: 'Divergent association and component recombining sandbox.',
    skills: ['Creative Synthesis', 'Problem Solving'],
    skill_primary: 'Creative Synthesis',
    skill_secondary: 'Problem Solving',
    difficulty: 'Easy',
    icon: 'Sparkles',
    icon_name: 'Sparkles',
    color: 'purple',
    color_theme: '#E05638',
    estimated_time: '4-6 min',
    sort_order: 6,
  },
];

export const MOCK_CAREERS: Career[] = [
  {
    id: 'software-architect',
    name: 'Software System Architect',
    category: 'Engineering',
    match_score_formula: '',
    description: 'Designs complex, high-scale digital infrastructure and algorithmic systems.',
    icon: 'Code',
    icon_name: 'Code',
    color_theme: '#3525CD',
    sort_order: 1,
    tools: ['Node.js', 'Docker', 'Kubernetes', 'PostgreSQL', 'TypeScript'],
    what_they_do: 'Software Architects design scalable server architectures, database structures, and high-performance APIs.',
    skills_developed: ['System Design', 'Cloud Architecture', 'Performance Tuning'],
    skill_weights: { 'Logical Deduction': 30, 'Problem Solving': 25, 'Spatial Reasoning': 20, 'Working Memory': 15, 'Analytical Thinking': 10 },
    roadmap_template: [
      { phase: 1, title: 'Foundational Systems & Algorithms', tasks: ['Master Data Structures & Complexity', 'Design Distributed Microservices architecture', 'Set up Automated CI/CD Pipelines'] },
      { phase: 2, title: 'Advanced Domain Architecture', tasks: ['Optimize High-Throughput Databases', 'Implement Event-Driven Architecture', 'Conduct System Stress & Security Audits'] }
    ]
  },
  {
    id: 'ui-ux-lead',
    name: 'UX & Product Design Lead',
    category: 'Design',
    match_score_formula: '',
    description: 'Crafts human-centered interfaces, visual component systems, and intuitive user experiences.',
    icon: 'Palette',
    icon_name: 'Palette',
    color_theme: '#E05638',
    sort_order: 2,
    tools: ['Figma', 'Protopie', 'Design Tokens', 'User Research'],
    what_they_do: 'UI/UX Leads guide design systems, research user journeys, and create interactive product prototypes.',
    skills_developed: ['Design Systems', 'User Research', 'Interactive Prototyping'],
    skill_weights: { 'Spatial Reasoning': 30, 'Creative Synthesis': 30, 'Working Memory': 20, 'Attention': 20 },
    roadmap_template: [
      { phase: 1, title: 'Design Systems & Heuristics', tasks: ['Construct Material Design System tokens', 'Conduct User Usability Testing', 'Build High-Fidelity Interactive Prototypes']},
      { phase: 2, title: 'Product Strategy & Innovation', tasks: ['Perform Comparative Competitor Analysis', 'Formulate Accessibility Standards (WCAG AAA)', 'Launch Design System Documentation']}
    ]
  },
  {
    id: 'data-scientist',
    name: 'Data Science & AI Engineer',
    category: 'Analytics',
    match_score_formula: '',
    description: 'Extracts deep insights from massive datasets and builds predictive Machine Learning models.',
    icon: 'LineChart',
    icon_name: 'LineChart',
    color_theme: '#0284C7',
    sort_order: 3,
    tools: ['Python', 'PyTorch', 'Pandas', 'SQL', 'Scikit-Learn'],
    what_they_do: 'Data Scientists perform exploratory data analysis, train predictive ML models, and deploy AI services.',
    skills_developed: ['Machine Learning', 'Statistical Analysis', 'Data Pipeline Engineering'],
    skill_weights: { 'Analytical Thinking': 35, 'Logical Deduction': 25, 'Working Memory': 20, 'Pattern Recognition': 20 },
    roadmap_template: [
      { phase: 1, title: 'Statistical Modeling & Python', tasks: ['Exploratory Data Analysis with Pandas', 'Train Neural Network Classifiers', 'Deploy Inference Endpoints via Docker']}
    ]
  }
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'first-step', name: 'First Quest', description: 'Complete your first cognitive game.', icon: 'Target', icon_name: 'Target', xp: 100, xp_reward: 100 },
  { id: 'logic-master', name: 'Logic Virtuoso', description: 'Score above 90% in Logic Lab.', icon: 'Award', icon_name: 'Award', xp: 250, xp_reward: 250 },
  { id: 'streak-3', name: 'Consistent Explorer', description: 'Maintain a 3-day quest streak.', icon: 'Flame', icon_name: 'Flame', xp: 150, xp_reward: 150 },
];

export async function fetchGames(): Promise<Game[]> {
  try {
    const { data, error } = await supabase.from('games').select('*').order('sort_order');
    if (error || !data || data.length === 0) return MOCK_GAMES;
    return data as Game[];
  } catch {
    return MOCK_GAMES;
  }
}

export async function fetchCareers(): Promise<Career[]> {
  try {
    const { data, error } = await supabase.from('careers').select('*').order('sort_order');
    if (error || !data || data.length === 0) return MOCK_CAREERS;
    return data as Career[];
  } catch {
    return MOCK_CAREERS;
  }
}

export async function fetchCareer(id: string): Promise<Career | null> {
  try {
    const { data, error } = await supabase.from('careers').select('*').eq('id', id).maybeSingle();
    if (error || !data) return MOCK_CAREERS.find(c => c.id === id) || MOCK_CAREERS[0];
    return data as Career | null;
  } catch {
    return MOCK_CAREERS.find(c => c.id === id) || MOCK_CAREERS[0];
  }
}

export async function fetchAchievements(): Promise<Achievement[]> {
  try {
    const { data, error } = await supabase.from('achievements').select('*');
    if (error || !data || data.length === 0) return MOCK_ACHIEVEMENTS;
    return data as Achievement[];
  } catch {
    return MOCK_ACHIEVEMENTS;
  }
}

export async function fetchUserAchievements(userId: string): Promise<string[]> {
  try {
    const { data } = await supabase.from('user_achievements').select('achievement_id').eq('user_id', userId);
    if (data && data.length > 0) return data.map(d => d.achievement_id);
    return ['first-step', 'streak-3'];
  } catch {
    return ['first-step', 'streak-3'];
  }
}

export async function awardAchievement(userId: string, achievementId: string): Promise<void> {
  try {
    const ach = MOCK_ACHIEVEMENTS.find(a => a.id === achievementId);
    if (ach) {
      await addXp(userId, ach.xp_reward);
    }
  } catch {
    // fallback
  }
}

export async function fetchAttempts(userId: string): Promise<GameAttempt[]> {
  try {
    const { data, error } = await supabase.from('game_attempts').select('*').eq('user_id', userId).order('created_at');
    if (error || !data) return [];
    return data as GameAttempt[];
  } catch {
    return [];
  }
}

export async function fetchBestAttempts(userId: string): Promise<Record<string, GameAttempt>> {
  const attempts = await fetchAttempts(userId);
  const best: Record<string, GameAttempt> = {};
  for (const a of attempts) {
    if (!best[a.game_id] || a.score > best[a.game_id].score) {
      best[a.game_id] = a;
    }
  }
  return best;
}

export async function saveGameAttempt(
  userId: string,
  gameId: string,
  result: {
    score: number;
    accuracy: number;
    completionTimeMs: number;
    mistakes: number;
    difficultyReached: number;
  }
): Promise<{ attempt: GameAttempt; skillProfile: SkillMap }> {
  const mockAttempt: GameAttempt = {
    id: 'attempt-' + Date.now(),
    user_id: userId,
    game_id: gameId,
    score: result.score,
    accuracy: result.accuracy,
    completion_time_ms: result.completionTimeMs,
    attempt_number: 1,
    mistakes: result.mistakes,
    difficulty_reached: result.difficultyReached,
    skill_evidence: gameResultToSkillEvidence(gameId, result),
    created_at: new Date().toISOString(),
  };

  try {
    await supabase.from('game_attempts').insert(mockAttempt);
  } catch {
    // fallback
  }

  const attempts = await fetchAttempts(userId);
  attempts.push(mockAttempt);
  const skillProfile = computeSkillProfile(attempts);
  await updateSkillProfile(userId, skillProfile);
  await addXp(userId, Math.round(result.score / 10));

  return { attempt: mockAttempt, skillProfile };
}

export async function fetchSkillProfile(userId: string): Promise<SkillProfile | null> {
  try {
    const { data, error } = await supabase.from('skill_profiles').select('*').eq('user_id', userId).maybeSingle();
    if (!error && data) {
      return data as SkillProfile;
    }
    const attempts = await fetchAttempts(userId);
    const computed = computeSkillProfile(attempts);
    return { id: 'sp-' + userId, user_id: userId, skills: computed, updated_at: new Date().toISOString() };
  } catch {
    const attempts = await fetchAttempts(userId);
    const computed = computeSkillProfile(attempts);
    return { id: 'sp-' + userId, user_id: userId, skills: computed, updated_at: new Date().toISOString() };
  }
}

export async function updateSkillProfile(userId: string, skills: SkillMap): Promise<void> {
  try {
    await supabase.from('skill_profiles').upsert({ user_id: userId, skills, updated_at: new Date().toISOString() });
  } catch {
    // ignore
  }
}

export async function addXp(userId: string, xpGained: number): Promise<{ oldProfile: Profile | null; newProfile: Profile | null; leveledUp: boolean }> {
  try {
    const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle();
    const currentXp = (profile?.xp ?? 0) + xpGained;
    const currentLevel = profile?.level ?? 1;
    const levelInfo = getLevelInfo(currentXp);
    const leveledUp = levelInfo.level > currentLevel;

    await supabase.from('profiles').update({ xp: currentXp, level: levelInfo.level, updated_at: new Date().toISOString() }).eq('user_id', userId);

    return { oldProfile: profile as Profile, newProfile: { ...profile, xp: currentXp, level: levelInfo.level } as Profile, leveledUp };
  } catch {
    return { oldProfile: null, newProfile: null, leveledUp: false };
  }
}

export async function updateStreak(userId: string): Promise<number> {
  try {
    const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle();
    const currentStreak = (profile?.streak ?? 0) + 1;
    await supabase.from('profiles').update({ streak: currentStreak, updated_at: new Date().toISOString() }).eq('user_id', userId);
    return currentStreak;
  } catch {
    return 1;
  }
}

export async function generateRecommendations(
  userId: string,
  skillsInput?: SkillMap,
  careersInput?: Career[]
): Promise<Recommendation[]> {
  const profile = await fetchSkillProfile(userId);
  const skills = skillsInput || profile?.skills || {};
  const careers = careersInput || (await fetchCareers());
  const matches = matchCareers(skills, careers);

  return matches.slice(0, 3).map((m, index) => ({
    id: `rec-${index}-${userId}`,
    user_id: userId,
    career_id: m.career.id,
    match_score: m.matchScore,
    matching_skills: m.matchingSkills,
    skill_gaps: m.skillGaps.map((g) => g.skill),
    created_at: new Date().toISOString(),
  }));
}

export const fetchRecommendations = generateRecommendations;

export async function createOrGetRoadmap(
  userId: string,
  careerInput: string | Career,
  _userSkills?: SkillMap
): Promise<{ roadmap: Roadmap; tasks: RoadmapTask[] }> {
  const careerId = typeof careerInput === 'string' ? careerInput : careerInput.id;
  const career = typeof careerInput === 'string' ? await fetchCareer(careerId) : careerInput;
  const mockRoadmap: Roadmap = {
    id: 'roadmap-1',
    user_id: userId,
    career_id: careerId,
    career_name: career?.name || 'Career Path',
    skill_gaps: [],
    progress: 0.25,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockTasks: RoadmapTask[] = [
    { id: 't1', roadmap_id: 'roadmap-1', user_id: userId, phase: 1, title: 'Master Core Concepts', description: 'Complete introductory module', skill: 'Logic', xp: 100, status: 'completed', completed_at: new Date().toISOString(), sort_order: 1 },
    { id: 't2', roadmap_id: 'roadmap-1', user_id: userId, phase: 1, title: 'Build Mini Project', description: 'Implement algorithm sandbox', skill: 'Spatial', xp: 150, status: 'pending', completed_at: null, sort_order: 2 },
    { id: 't3', roadmap_id: 'roadmap-1', user_id: userId, phase: 2, title: 'Advanced Systems Audit', description: 'Benchmark performance metrics', skill: 'Analytics', xp: 200, status: 'pending', completed_at: null, sort_order: 3 }
  ];

  return { roadmap: mockRoadmap, tasks: mockTasks };
}

export const generateRoadmap = createOrGetRoadmap;

export async function fetchRoadmap(userId: string): Promise<{ roadmap: Roadmap | null; tasks: RoadmapTask[] }> {
  return createOrGetRoadmap(userId, 'software-architect');
}

export async function toggleRoadmapTask(
  taskId: string,
  userId: string,
  roadmapId: string,
  currentStatus: string,
  xp: number
): Promise<void> {
  if (currentStatus !== 'completed') {
    await addXp(userId, xp);
  }
}
