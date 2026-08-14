-- ========================================================
-- SkillQuest Supabase Database Schema
-- Run this in your Supabase SQL Editor to set up all tables,
-- RLS security policies, and initial reference seed data.
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Explorer',
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  streak INTEGER NOT NULL DEFAULT 0,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  assessment_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. REFERENCE GAMES TABLE
CREATE TABLE IF NOT EXISTS public.games (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  skill_primary TEXT NOT NULL,
  skill_secondary TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Grid',
  color_theme TEXT NOT NULL DEFAULT '#3525CD',
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- 3. REFERENCE CAREERS TABLE
CREATE TABLE IF NOT EXISTS public.careers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  match_score_formula TEXT DEFAULT '',
  icon_name TEXT NOT NULL DEFAULT 'Compass',
  color_theme TEXT NOT NULL DEFAULT '#3525CD',
  sort_order INTEGER NOT NULL DEFAULT 0,
  skill_weights JSONB NOT NULL DEFAULT '{}'::jsonb,
  roadmap_template JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- 4. GAME ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS public.game_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  accuracy NUMERIC NOT NULL DEFAULT 0,
  completion_time_ms INTEGER NOT NULL DEFAULT 0,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  mistakes INTEGER NOT NULL DEFAULT 0,
  difficulty_reached INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Award',
  xp_reward INTEGER NOT NULL DEFAULT 100
);

-- 6. SKILL PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.skill_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  skills JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ROADMAPS TABLE
CREATE TABLE IF NOT EXISTS public.roadmaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  career_id TEXT NOT NULL REFERENCES public.careers(id) ON DELETE CASCADE,
  career_name TEXT NOT NULL,
  skill_gaps JSONB NOT NULL DEFAULT '[]'::jsonb,
  progress NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ROADMAP TASKS TABLE
CREATE TABLE IF NOT EXISTS public.roadmap_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phase INTEGER NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  skill TEXT NOT NULL,
  xp INTEGER NOT NULL DEFAULT 100,
  status TEXT NOT NULL DEFAULT 'pending',
  sort_order INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ
);

-- ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_tasks ENABLE ROW LEVEL SECURITY;

-- Allow public read access to reference data
CREATE POLICY "Public read games" ON public.games FOR SELECT USING (true);
CREATE POLICY "Public read careers" ON public.careers FOR SELECT USING (true);
CREATE POLICY "Public read achievements" ON public.achievements FOR SELECT USING (true);

-- User-owned tables policies
CREATE POLICY "Users can manage own profile" ON public.profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own game attempts" ON public.game_attempts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own skill profile" ON public.skill_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own roadmaps" ON public.roadmaps FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own roadmap tasks" ON public.roadmap_tasks FOR ALL USING (auth.uid() = user_id);

-- SEED DATA INSERTIONS FOR REFERENCE GAMES & CAREERS

INSERT INTO public.games (id, name, category, description, skill_primary, skill_secondary, icon_name, color_theme, sort_order)
VALUES 
  ('pattern-quest', 'Pattern Quest', 'spatial', 'Deconstruct complex spatial sequences and predict structural transformations.', 'Spatial Reasoning', 'Working Memory', 'Grid', '#3525CD', 1),
  ('logic-lab', 'Logic Lab', 'logic', 'Solve Boolean truth gates and algorithmic flow networks.', 'Logical Deduction', 'Problem Solving', 'Cpu', '#3525CD', 2),
  ('memory-matrix', 'Memory Matrix', 'memory', 'Retain and manipulate multi-layered grid configurations under time pressure.', 'Working Memory', 'Attention', 'Brain', '#0284C7', 3),
  ('shape-shift', 'Shape Shift', 'spatial', 'Rotate and fit 3D geometry fragments into target blueprints.', 'Spatial Reasoning', 'Pattern Recognition', 'Box', '#E05638', 4),
  ('decision-dash', 'Decision Dash', 'analytical', 'Synthesize fast-moving numerical data and optimize real-time decisions.', 'Analytical Thinking', 'Speed & Focus', 'Zap', '#059669', 5),
  ('creative-lab', 'Creative Lab', 'creative', 'Divergent association and component recombining sandbox.', 'Creative Synthesis', 'Problem Solving', 'Sparkles', '#E05638', 6)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.careers (id, name, category, description, icon_name, color_theme, sort_order, skill_weights, roadmap_template)
VALUES 
  ('software-architect', 'Software System Architect', 'Engineering', 'Designs complex, high-scale digital infrastructure and algorithmic systems.', 'Code', '#3525CD', 1, 
   '{"Logical Deduction": 30, "Problem Solving": 25, "Spatial Reasoning": 20, "Working Memory": 15, "Analytical Thinking": 10}'::jsonb,
   '[{"phase": 1, "title": "Foundational Systems & Algorithms", "tasks": ["Master Data Structures & Complexity", "Design Distributed Microservices architecture", "Set up Automated CI/CD Pipelines"]}, {"phase": 2, "title": "Advanced Domain Architecture", "tasks": ["Optimize High-Throughput Databases", "Implement Event-Driven Architecture", "Conduct System Stress & Security Audits"]}]'::jsonb
  ),
  ('ui-ux-lead', 'UX & Product Design Lead', 'Design', 'Crafts human-centered interfaces, visual component systems, and intuitive user experiences.', 'Palette', '#E05638', 2,
   '{"Spatial Reasoning": 30, "Creative Synthesis": 30, "Working Memory": 20, "Attention": 20}'::jsonb,
   '[{"phase": 1, "title": "Design Systems & Heuristics", "tasks": ["Construct Material Design System tokens", "Conduct User Usability Testing", "Build High-Fidelity Interactive Prototypes"]}, {"phase": 2, "title": "Product Strategy & Innovation", "tasks": ["Perform Comparative Competitor Analysis", "Formulate Accessibility Standards (WCAG AAA)", "Launch Design System Documentation"]}]'::jsonb
  ),
  ('data-scientist', 'Data Science & AI Engineer', 'Analytics', 'Extracts deep insights from massive datasets and builds predictive Machine Learning models.', 'LineChart', '#0284C7', 3,
   '{"Analytical Thinking": 35, "Logical Deduction": 25, "Working Memory": 20, "Pattern Recognition": 20}'::jsonb,
   '[{"phase": 1, "title": "Statistical Modeling & Python", "tasks": ["Exploratory Data Analysis with Pandas", "Train Neural Network Classifiers", "Deploy Inference Endpoints via Docker"]}]'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.achievements (id, name, description, icon_name, xp_reward)
VALUES
  ('first-step', 'First Quest', 'Complete your first cognitive game.', 'Target', 100),
  ('logic-master', 'Logic Virtuoso', 'Score above 90% in Logic Lab.', 'Award', 250),
  ('streak-3', 'Consistent Explorer', 'Maintain a 3-day quest streak.', 'Flame', 150)
ON CONFLICT (id) DO NOTHING;
