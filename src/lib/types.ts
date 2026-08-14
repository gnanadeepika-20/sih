export interface Profile {
  id: string;
  user_id: string;
  name: string;
  education_level: string | null;
  current_situation: string | null;
  interests: string[];
  discovery_goal: string | null;
  xp: number;
  level: number;
  streak: number;
  last_activity: string | null;
  onboarding_completed: boolean;
  assessment_completed: boolean;
  selected_career_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Game {
  id: string;
  name: string;
  description: string;
  category?: string;
  skills: string[];
  skill_primary?: string;
  skill_secondary?: string;
  difficulty: string;
  icon: string;
  icon_name?: string;
  color: string;
  color_theme?: string;
  estimated_time: string;
  sort_order: number;
}

export interface GameAttempt {
  id: string;
  user_id: string;
  game_id: string;
  score: number;
  accuracy: number;
  completion_time_ms: number;
  attempt_number: number;
  mistakes: number;
  difficulty_reached: number;
  skill_evidence: Record<string, number>;
  created_at: string;
}

export interface SkillProfile {
  id: string;
  user_id: string;
  skills: Record<string, number>;
  updated_at: string;
}

export interface Career {
  id: string;
  name: string;
  category: string;
  description: string;
  skill_weights: Record<string, number>;
  tools: string[];
  what_they_do: string;
  skills_developed: string[];
  roadmap_template: RoadmapPhase[];
  icon: string;
  icon_name?: string;
  color_theme?: string;
  match_score_formula?: string;
  sort_order: number;
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  icon?: string;
  tasks: string[];
}

export interface Recommendation {
  id: string;
  user_id: string;
  career_id: string;
  match_score: number;
  matching_skills: string[];
  skill_gaps: string[];
  created_at: string;
}

export interface Roadmap {
  id: string;
  user_id: string;
  career_id: string;
  career_name: string;
  skill_gaps: string[];
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface RoadmapTask {
  id: string;
  roadmap_id: string;
  user_id: string;
  phase: number;
  title: string;
  description: string;
  skill: string;
  status: 'pending' | 'completed';
  xp: number;
  completed_at: string | null;
  sort_order: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  icon_name?: string;
  xp: number;
  xp_reward?: number;
  condition?: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
}

export type SkillMap = Record<string, number>;

export interface GameResult {
  score: number;
  accuracy: number;
  completionTimeMs: number;
  mistakes: number;
  difficultyReached: number;
  skillEvidence?: Record<string, number>;
}
