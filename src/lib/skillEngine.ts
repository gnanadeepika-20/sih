import type { GameAttempt, SkillMap, Career, Recommendation } from './types';

// All skills tracked by SkillQuest
export const ALL_SKILLS = [
  'Pattern Recognition',
  'Logical Reasoning',
  'Processing Speed',
  'Working Memory',
  'Attention',
  'Spatial Reasoning',
  'Visual Reasoning',
  'Analytical Reasoning',
  'Problem Solving',
  'Creativity',
  'Visual Thinking',
  'Decision Making',
  'Strategic Thinking',
] as const;

// Maps each game's measured skills to the contribution weight for skill evidence
const GAME_SKILL_MAP: Record<string, Record<string, number>> = {
  'pattern-quest': {
    'Pattern Recognition': 0.4,
    'Logical Reasoning': 0.35,
    'Processing Speed': 0.25,
  },
  'memory-matrix': {
    'Working Memory': 0.4,
    'Attention': 0.35,
    'Spatial Reasoning': 0.25,
  },
  'shape-shift': {
    'Visual Reasoning': 0.55,
    'Spatial Reasoning': 0.45,
  },
  'logic-lab': {
    'Analytical Reasoning': 0.5,
    'Problem Solving': 0.5,
  },
  'creative-lab': {
    'Creativity': 0.55,
    'Visual Thinking': 0.45,
  },
  'decision-dash': {
    'Decision Making': 0.55,
    'Strategic Thinking': 0.45,
  },
};

/**
 * Compute a normalized skill profile from all game attempts.
 * Each game contributes skill evidence weighted by the game's skill map.
 * Scores are normalized to 0-100 using accuracy, speed, and difficulty.
 * No randomness — purely deterministic from performance data.
 */
export function computeSkillProfile(attempts: GameAttempt[]): SkillMap {
  const skillAccumulators: Record<string, { sum: number; weight: number }> = {};

  for (const skill of ALL_SKILLS) {
    skillAccumulators[skill] = { sum: 0, weight: 0 };
  }

  for (const attempt of attempts) {
    const skillMap = GAME_SKILL_MAP[attempt.game_id];
    if (!skillMap) continue;

    // Normalize performance into a 0-100 raw score per attempt
    const accuracyScore = attempt.accuracy * 100;
    const speedScore = Math.max(0, Math.min(100, 100 - (attempt.completion_time_ms / 1000 - 60) * 1.5));
    const difficultyScore = (attempt.difficulty_reached / 8) * 100;
    const mistakePenalty = Math.max(0, 100 - attempt.mistakes * 8);

    const rawScore =
      accuracyScore * 0.45 +
      speedScore * 0.2 +
      difficultyScore * 0.2 +
      mistakePenalty * 0.15;

    // Weight by attempt number (later attempts count more — improvement signal)
    const attemptWeight = 1 + (attempt.attempt_number - 1) * 0.15;

    for (const [skill, contribution] of Object.entries(skillMap)) {
      const w = contribution * attemptWeight;
      skillAccumulators[skill].sum += rawScore * w;
      skillAccumulators[skill].weight += w;
    }
  }

  const result: SkillMap = {};
  for (const skill of ALL_SKILLS) {
    const acc = skillAccumulators[skill];
    if (acc.weight > 0) {
      result[skill] = Math.round(Math.min(100, Math.max(0, acc.sum / acc.weight)));
    }
  }

  return result;
}

/**
 * Get top N strengths from a skill profile
 */
export function getTopSkills(skills: SkillMap, n: number = 3): { skill: string; score: number }[] {
  return Object.entries(skills)
    .map(([skill, score]) => ({ skill, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}

/**
 * Generate a plain-language explanation of a skill profile from actual scores
 */
export function generateSkillExplanation(skills: SkillMap): string {
  const top = getTopSkills(skills, 2);
  if (top.length === 0) return 'Complete challenges to reveal your skill profile.';

  const skillDescriptions: Record<string, string> = {
    'Pattern Recognition': 'recognizing patterns',
    'Logical Reasoning': 'structured logical thinking',
    'Processing Speed': 'fast and accurate processing',
    'Working Memory': 'holding and using information in mind',
    'Attention': 'focused attention to detail',
    'Spatial Reasoning': 'thinking about space and positions',
    'Visual Reasoning': 'understanding visual information',
    'Analytical Reasoning': 'breaking down complex problems',
    'Problem Solving': 'finding solutions to challenges',
    'Creativity': 'generating novel ideas',
    'Visual Thinking': 'thinking in images and visuals',
    'Decision Making': 'making good choices under pressure',
    'Strategic Thinking': 'planning and strategic thinking',
  };

  if (top.length >= 2) {
    return `You perform especially well when problems involve ${skillDescriptions[top[0].skill] || top[0].skill.toLowerCase()} and ${skillDescriptions[top[1].skill] || top[1].skill.toLowerCase()}. These strengths show up consistently across your challenges.`;
  }
  return `Your strongest area is ${skillDescriptions[top[0].skill] || top[0].skill.toLowerCase()}.`;
}

/**
 * Compute career match scores by comparing skill profile to career requirements.
 * Returns sorted matches with matching skills and skill gaps.
 */
export function matchCareers(
  skills: SkillMap,
  careers: Career[]
): { career: Career; matchScore: number; matchingSkills: string[]; skillGaps: { skill: string; have: number; need: number }[] }[] {
  const results = careers.map((career) => {
    const weights = career.skill_weights;
    let weightedSum = 0;
    let totalWeight = 0;
    const matchingSkills: string[] = [];
    const skillGaps: { skill: string; have: number; need: number }[] = [];

    for (const [skill, weight] of Object.entries(weights)) {
      const userScore = skills[skill] ?? 0;
      // Each career skill has an implied "need" threshold of 70 for a good match
      const needThreshold = 70;
      weightedSum += (userScore / 100) * weight;
      totalWeight += weight;

      if (userScore >= needThreshold) {
        matchingSkills.push(skill);
      } else {
        skillGaps.push({ skill, have: userScore, need: needThreshold });
      }
    }

    const matchScore = totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 100) : 0;

    return {
      career,
      matchScore,
      matchingSkills,
      skillGaps: skillGaps.sort((a, b) => a.have - b.have),
    };
  });

  return results.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Compute skill growth between earliest and latest attempts
 */
export function computeSkillGrowth(attempts: GameAttempt[]): { skill: string; from: number; to: number; delta: number }[] {
  if (attempts.length === 0) return [];

  const sorted = [...attempts].sort((a, b) =>
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const firstHalf = sorted.slice(0, Math.ceil(sorted.length / 2));
  const secondHalf = sorted.slice(Math.ceil(sorted.length / 2));

  const earlyProfile = computeSkillProfile(firstHalf);
  const lateProfile = computeSkillProfile(secondHalf);

  const growth: { skill: string; from: number; to: number; delta: number }[] = [];

  for (const skill of ALL_SKILLS) {
    if (earlyProfile[skill] !== undefined && lateProfile[skill] !== undefined) {
      const from = earlyProfile[skill];
      const to = lateProfile[skill];
      growth.push({ skill, from, to, delta: to - from });
    }
  }

  return growth.sort((a, b) => b.delta - a.delta);
}

// XP and Level system
export const LEVELS = [
  { level: 1, name: 'Explorer', minXp: 0 },
  { level: 2, name: 'Pathfinder', minXp: 500 },
  { level: 3, name: 'Skill Builder', minXp: 1200 },
  { level: 4, name: 'Specialist', minXp: 2500 },
  { level: 5, name: 'Career Ready', minXp: 5000 },
];

export function getLevelInfo(xp: number): { level: number; name: string; minXp: number; nextXp: number | null; progress: number } {
  let current = LEVELS[0];
  let next: typeof LEVELS[number] | null = null;

  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].minXp) {
      current = LEVELS[i];
      next = LEVELS[i + 1] ?? null;
    }
  }

  const progress = next
    ? ((xp - current.minXp) / (next.minXp - current.minXp))
    : 1;

  return {
    level: current.level,
    name: current.name,
    minXp: current.minXp,
    nextXp: next?.minXp ?? null,
    progress: Math.min(1, Math.max(0, progress)),
  };
}

/**
 * Convert a game result into skill evidence for persistence
 */
export function gameResultToSkillEvidence(
  gameId: string,
  result: { accuracy: number; completionTimeMs: number; mistakes: number; difficultyReached: number }
): Record<string, number> {
  const skillMap = GAME_SKILL_MAP[gameId];
  if (!skillMap) return {};

  const accuracyScore = result.accuracy * 100;
  const speedScore = Math.max(0, Math.min(100, 100 - (result.completionTimeMs / 1000 - 60) * 1.5));
  const difficultyScore = (result.difficultyReached / 8) * 100;
  const mistakePenalty = Math.max(0, 100 - result.mistakes * 8);

  const rawScore =
    accuracyScore * 0.45 +
    speedScore * 0.2 +
    difficultyScore * 0.2 +
    mistakePenalty * 0.15;

  const evidence: Record<string, number> = {};
  for (const [skill, contribution] of Object.entries(skillMap)) {
    evidence[skill] = Math.round(rawScore * contribution);
  }

  return evidence;
}
