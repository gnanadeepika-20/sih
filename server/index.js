import http from 'http';
import { readDB, writeDB, hashPassword, generateToken, verifyToken } from './db.js';

const PORT = 3001;

// Canonical Careers Database
const CAREERS = [
  {
    id: "backend-dev",
    name: "Backend Software Engineer",
    title: "Backend Software Engineer",
    category: "Software Engineering",
    description: "Architects scalable server logic, database structures, high-performance APIs, and reliable cloud microservices.",
    skillWeights: {
      logical_reasoning: 0.35,
      problem_solving: 0.30,
      attention: 0.15,
      decision_making: 0.10,
      spatial_reasoning: 0.10
    },
    requiredSkills: {
      logical_reasoning: 90,
      problem_solving: 88,
      attention: 80,
      decision_making: 75,
      spatial_reasoning: 70
    },
    tools: ["Node.js / Express", "PostgreSQL & Redis", "Docker & Kubernetes", "REST & gRPC APIs", "Git"],
    dailyTasks: [
      "Designing fault-tolerant database schemas and queries",
      "Optimizing response latency under high concurrency",
      "Building authenticated middleware & microservice pipelines"
    ],
    salaryRange: "$105,000 - $165,000"
  },
  {
    id: "ui-ux-designer",
    name: "UI/UX Product Designer",
    title: "UI/UX Product Designer",
    category: "Design & Product",
    description: "Crafts intuitive human-computer interfaces, design systems, interactive prototypes, and user journey maps.",
    skillWeights: {
      creativity: 0.35,
      visual_reasoning: 0.25,
      spatial_reasoning: 0.15,
      attention: 0.15,
      decision_making: 0.10
    },
    requiredSkills: {
      creativity: 92,
      visual_reasoning: 88,
      spatial_reasoning: 80,
      attention: 80,
      decision_making: 70
    },
    tools: ["Figma & Tokens", "User Research", "Wireframing", "Micro-animations", "WCAG Accessibility"],
    dailyTasks: [
      "Developing component libraries and token scales",
      "Conducting user interviews & usability test sessions",
      "Wireframing responsive desktop & mobile workflows"
    ],
    salaryRange: "$95,000 - $150,000"
  },
  {
    id: "qa-engineer",
    name: "QA Systems Automation Engineer",
    title: "QA Systems Automation Engineer",
    category: "Quality Engineering",
    description: "Identifies system edge cases, constructs automated test suites, and ensures software resilience.",
    skillWeights: {
      problem_solving: 0.35,
      attention: 0.30,
      logical_reasoning: 0.20,
      decision_making: 0.15
    },
    requiredSkills: {
      problem_solving: 92,
      attention: 90,
      logical_reasoning: 85,
      decision_making: 80
    },
    tools: ["Playwright / Cypress", "Postman API Fuzzing", "CI/CD Integration", "Jest & Selenium"],
    dailyTasks: [
      "Writing regression suites for critical user paths",
      "Simulating network drops and race conditions",
      "Auditing API contracts and edge case coverage"
    ],
    salaryRange: "$88,000 - $135,000"
  },
  {
    id: "data-scientist",
    name: "Data & ML Engineer",
    title: "Data & ML Engineer",
    category: "Data Intelligence",
    description: "Extracts predictive insights from massive datasets, builds machine learning models, and cleans data pipelines.",
    skillWeights: {
      logical_reasoning: 0.30,
      problem_solving: 0.30,
      attention: 0.20,
      spatial_reasoning: 0.10,
      decision_making: 0.10
    },
    requiredSkills: {
      logical_reasoning: 92,
      problem_solving: 90,
      attention: 85,
      spatial_reasoning: 75,
      decision_making: 75
    },
    tools: ["Python (Pandas/PyTorch)", "SQL & BigQuery", "Statistical Modeling", "Vector Databases"],
    dailyTasks: [
      "Feature engineering for recommendation systems",
      "Optimizing analytical query performance",
      "Deploying machine learning models to production endpoints"
    ],
    salaryRange: "$115,000 - $175,000"
  },
  {
    id: "systems-architect",
    name: "Cloud & Systems Architect",
    title: "Cloud & Systems Architect",
    category: "Infrastructure",
    description: "Designs enterprise-scale cloud infrastructure, disaster recovery plans, and distributed microservices.",
    skillWeights: {
      problem_solving: 0.30,
      logical_reasoning: 0.30,
      decision_making: 0.25,
      spatial_reasoning: 0.15
    },
    requiredSkills: {
      problem_solving: 94,
      logical_reasoning: 90,
      decision_making: 88,
      spatial_reasoning: 80
    },
    tools: ["AWS / GCP Cloud", "Terraform Infrastructure", "Kubernetes Clusters", "System Design Patterns"],
    dailyTasks: [
      "Drafting System Architecture RFCs for engineering teams",
      "Designing multi-region failover and disaster recovery",
      "Auditing infrastructure security compliance and cost efficiency"
    ],
    salaryRange: "$130,000 - $195,000"
  },
  {
    id: "technical-writer",
    name: "Developer Relations & Tech Writer",
    title: "Developer Relations & Tech Writer",
    category: "Communication",
    description: "Translates complex software architectures into crystal-clear documentation, developer guides, and SDK tutorials.",
    skillWeights: {
      attention: 0.35,
      decision_making: 0.25,
      creativity: 0.20,
      logical_reasoning: 0.20
    },
    requiredSkills: {
      attention: 92,
      decision_making: 85,
      creativity: 80,
      logical_reasoning: 75
    },
    tools: ["OpenAPI / Swagger", "Markdown & Docs Engines", "Code Example Sandboxes", "Developer Portals"],
    dailyTasks: [
      "Synthesizing complex engineering specs into interactive docs",
      "Writing step-by-step developer onboarding guides",
      "Auditing API documentation for precision and clarity"
    ],
    salaryRange: "$80,000 - $130,000"
  }
];

// Game-to-Skill Domain Mapping
const GAME_DOMAINS = {
  "pattern-quest": { primary: "logical_reasoning", secondary: "visual_reasoning", pWeight: 0.6, sWeight: 0.4 },
  "memory-matrix": { primary: "memory", secondary: "attention", pWeight: 0.6, sWeight: 0.4 },
  "shape-shift": { primary: "spatial_reasoning", secondary: "visual_reasoning", pWeight: 0.6, sWeight: 0.4 },
  "circuit-bridge": { primary: "problem_solving", secondary: "logical_reasoning", pWeight: 0.6, sWeight: 0.4 },
  "decision-dash": { primary: "decision_making", secondary: "problem_solving", pWeight: 0.6, sWeight: 0.4 },
  "backend-sim": { primary: "logical_reasoning", secondary: "problem_solving", pWeight: 0.5, sWeight: 0.5 },
  "merge-2048": { primary: "decision_making", secondary: "spatial_reasoning", pWeight: 0.5, sWeight: 0.5 },
  "sokoban": { primary: "spatial_reasoning", secondary: "problem_solving", pWeight: 0.6, sWeight: 0.4 },
  "signal-decoder": { primary: "attention", secondary: "creativity", pWeight: 0.6, sWeight: 0.4 },
  "powder-sandbox": { primary: "creativity", secondary: "visual_reasoning", pWeight: 0.7, sWeight: 0.3 }
};

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function parseJSONBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

function sendJSON(res, status, data) {
  setCorsHeaders(res);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function computeLevel(xp) {
  if (xp >= 3500) return 5;
  if (xp >= 2000) return 4;
  if (xp >= 1000) return 3;
  if (xp >= 500) return 2;
  return 1;
}

function evaluateBadges(userId, db) {
  const user = db.users.find(u => u.id === userId);
  const profile = db.skill_profiles[userId] || {};
  const attempts = (db.game_attempts || []).filter(a => a.userId === userId);
  const roadmap = db.roadmaps[userId];
  const userBadges = db.badges[userId] || [];

  const ALL_BADGES = [
    { id: "first-quest", title: "🚀 First Quest", description: "Completed your first cognitive challenge", icon: "Rocket" },
    { id: "logic-master", title: "🧠 Logic Master", description: "Achieved 85+ Logical Reasoning score", icon: "Brain" },
    { id: "creative-thinker", title: "🎨 Creative Thinker", description: "Achieved 85+ Creativity score", icon: "Sparkles" },
    { id: "problem-solver", title: "🔍 Problem Solver", description: "Achieved 85+ Problem Solving score", icon: "Target" },
    { id: "career-explorer", title: "🧭 Career Explorer", description: "Explored career matching recommendations", icon: "Compass" },
    { id: "roadmap-starter", title: "📍 Roadmap Starter", description: "Completed your first roadmap milestone task", icon: "CheckCircle" },
    { id: "career-ready", title: "🏆 Career Ready", description: "Reached Level 5 Mastery or completed major roadmap milestones", icon: "Trophy" }
  ];

  const unlockedIds = new Set(userBadges.map(b => b.id));

  if (attempts.length >= 1 && !unlockedIds.has("first-quest")) unlockedIds.add("first-quest");
  if ((profile.logical_reasoning || 0) >= 85 && !unlockedIds.has("logic-master")) unlockedIds.add("logic-master");
  if ((profile.creativity || 0) >= 85 && !unlockedIds.has("creative-thinker")) unlockedIds.add("creative-thinker");
  if ((profile.problem_solving || 0) >= 85 && !unlockedIds.has("problem-solver")) unlockedIds.add("problem-solver");
  if (db.onboarding[userId] && !unlockedIds.has("career-explorer")) unlockedIds.add("career-explorer");
  if (roadmap && roadmap.tasks && roadmap.tasks.some(t => t.status === "COMPLETED") && !unlockedIds.has("roadmap-starter")) unlockedIds.add("roadmap-starter");
  if (user && user.level >= 5 && !unlockedIds.has("career-ready")) unlockedIds.add("career-ready");

  const updatedBadges = ALL_BADGES.map(b => ({
    ...b,
    unlocked: unlockedIds.has(b.id),
    unlockedAt: unlockedIds.has(b.id) ? (userBadges.find(ub => ub.id === b.id)?.unlockedAt || new Date().toISOString()) : null
  }));

  db.badges[userId] = updatedBadges;
  return updatedBadges;
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // Extract auth user
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const currentUser = verifyToken(token);

  // 1. POST /api/auth/register
  if (req.method === 'POST' && pathname === '/api/auth/register') {
    const body = await parseJSONBody(req);
    const { name, email, password, educationLevel } = body;

    if (!name || !email || !password) {
      return sendJSON(res, 400, { error: 'Name, email, and password are required.' });
    }

    const db = readDB();
    if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return sendJSON(res, 400, { error: 'Email is already registered.' });
    }

    const newUser = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name,
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
      educationLevel: educationLevel || 'College Student',
      xp: 0,
      level: 1,
      streak: 1,
      onboardingComplete: false,
      selectedCareerId: null,
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);

    // Initial default unassessed baseline skill profile
    const initialSkills = {
      logical_reasoning: 60,
      problem_solving: 60,
      creativity: 60,
      visual_reasoning: 60,
      memory: 60,
      decision_making: 60,
      attention: 60,
      spatial_reasoning: 60,
      updatedAt: new Date().toISOString()
    };
    db.skill_profiles[newUser.id] = initialSkills;

    evaluateBadges(newUser.id, db);
    writeDB(db);

    const newToken = generateToken(newUser);
    return sendJSON(res, 201, { user: newUser, token: newToken, skills: initialSkills });
  }

  // 2. POST /api/auth/login
  if (req.method === 'POST' && pathname === '/api/auth/login') {
    const body = await parseJSONBody(req);
    const { email, password } = body;

    const db = readDB();
    const hash = hashPassword(password || '');
    const user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase() && u.passwordHash === hash);

    if (!user) {
      return sendJSON(res, 401, { error: 'Invalid email or password.' });
    }

    const newToken = generateToken(user);
    const skills = db.skill_profiles[user.id] || {};
    const badges = evaluateBadges(user.id, db);
    const roadmap = db.roadmaps[user.id] || null;

    return sendJSON(res, 200, { user, token: newToken, skills, badges, roadmap });
  }

  // 3. GET /api/auth/me
  if (req.method === 'GET' && pathname === '/api/auth/me') {
    if (!currentUser) return sendJSON(res, 401, { error: 'Unauthorized' });
    const db = readDB();
    const freshUser = db.users.find(u => u.id === currentUser.id) || currentUser;
    const skills = db.skill_profiles[currentUser.id] || {};
    const badges = evaluateBadges(currentUser.id, db);
    const roadmap = db.roadmaps[currentUser.id] || null;

    return sendJSON(res, 200, { user: freshUser, skills, badges, roadmap });
  }

  // 4. POST /api/onboarding
  if (req.method === 'POST' && pathname === '/api/onboarding') {
    const body = await parseJSONBody(req);
    const userId = currentUser ? currentUser.id : 'demo_user';
    const db = readDB();
    
    db.onboarding[userId] = {
      ...body,
      completedAt: new Date().toISOString()
    };

    if (currentUser) {
      const uIdx = db.users.findIndex(u => u.id === currentUser.id);
      if (uIdx !== -1) {
        db.users[uIdx].onboardingComplete = true;
      }
    }

    writeDB(db);
    return sendJSON(res, 200, { success: true, onboarding: db.onboarding[userId] });
  }

  // 5. POST /api/games/attempt
  if (req.method === 'POST' && pathname === '/api/games/attempt') {
    const body = await parseJSONBody(req);
    const { gameId, accuracy = 0.85, completionTimeMs = 120000, difficulty = 3, mistakes = 0 } = body;
    const userId = currentUser ? currentUser.id : 'demo_user';

    const db = readDB();
    
    // Deterministic game score formula (0 - 100)
    const accPart = Math.min(1, Math.max(0, accuracy)) * 40;
    const diffPart = (Math.min(5, Math.max(1, difficulty)) / 5) * 30;
    const speedRatio = Math.max(0.4, Math.min(1.2, 120000 / Math.max(1000, completionTimeMs)));
    const speedPart = Math.min(1, speedRatio) * 20;
    const mistakePenalty = Math.min(15, mistakes * 2.5);
    const calculatedScore = Math.max(40, Math.min(99, Math.round(accPart + diffPart + speedPart + 10 - mistakePenalty)));

    const attempt = {
      id: 'att_' + Math.random().toString(36).substr(2, 9),
      userId,
      gameId,
      score: calculatedScore,
      accuracy,
      completionTimeMs,
      difficulty,
      mistakes,
      createdAt: new Date().toISOString()
    };

    db.game_attempts.push(attempt);

    // Update Skill Profile using defined domain mapping
    const currentProfile = db.skill_profiles[userId] || {
      logical_reasoning: 60,
      problem_solving: 60,
      creativity: 60,
      visual_reasoning: 60,
      memory: 60,
      decision_making: 60,
      attention: 60,
      spatial_reasoning: 60
    };

    const domainInfo = GAME_DOMAINS[gameId] || { primary: "logical_reasoning", secondary: "problem_solving", pWeight: 0.6, sWeight: 0.4 };
    
    const pSkill = domainInfo.primary;
    const sSkill = domainInfo.secondary;

    const prevP = currentProfile[pSkill] || 60;
    const prevS = currentProfile[sSkill] || 60;

    currentProfile[pSkill] = Math.round(prevP * (1 - domainInfo.pWeight * 0.4) + calculatedScore * (domainInfo.pWeight * 0.4));
    currentProfile[sSkill] = Math.round(prevS * (1 - domainInfo.sWeight * 0.4) + calculatedScore * (domainInfo.sWeight * 0.4));
    currentProfile.updatedAt = new Date().toISOString();

    db.skill_profiles[userId] = currentProfile;

    // Gamification: Award XP and evaluate Level
    let updatedUser = null;
    if (currentUser) {
      const uIdx = db.users.findIndex(u => u.id === currentUser.id);
      if (uIdx !== -1) {
        db.users[uIdx].xp = (db.users[uIdx].xp || 0) + 120;
        db.users[uIdx].level = computeLevel(db.users[uIdx].xp);
        updatedUser = db.users[uIdx];
      }
    }

    const badges = evaluateBadges(userId, db);
    writeDB(db);

    return sendJSON(res, 200, { attempt, updatedSkills: currentProfile, user: updatedUser, badges });
  }

  // 6. GET /api/assessment/status
  if (req.method === 'GET' && pathname === '/api/assessment/status') {
    const userId = currentUser ? currentUser.id : 'demo_user';
    const db = readDB();
    const attempts = (db.game_attempts || []).filter(a => a.userId === userId);
    
    const uniqueGames = new Set(attempts.map(a => a.gameId));
    const isComplete = uniqueGames.size >= 3;

    return sendJSON(res, 200, {
      totalAttempts: attempts.length,
      completedGamesCount: uniqueGames.size,
      requiredGamesCount: 3,
      isComplete,
      attempts
    });
  }

  // 7. GET /api/careers & GET /api/recommendations
  if (req.method === 'GET' && (pathname === '/api/careers' || pathname === '/api/recommendations')) {
    const userId = currentUser ? currentUser.id : 'demo_user';
    const db = readDB();
    const skills = db.skill_profiles[userId] || {
      logical_reasoning: 75,
      problem_solving: 75,
      creativity: 75,
      visual_reasoning: 75,
      memory: 75,
      decision_making: 75,
      attention: 75,
      spatial_reasoning: 75
    };

    const ranked = CAREERS.map(career => {
      let weightedSum = 0;
      let totalWeight = 0;
      const matchingSkills = [];
      const skillGaps = [];

      Object.entries(career.skillWeights).forEach(([skillKey, weight]) => {
        const studentVal = skills[skillKey] || 60;
        weightedSum += studentVal * weight;
        totalWeight += weight;

        const reqVal = career.requiredSkills[skillKey] || 80;
        if (studentVal >= reqVal - 5) {
          matchingSkills.push({ skill: skillKey, userScore: studentVal, reqScore: reqVal });
        } else {
          skillGaps.push({ skill: skillKey, userScore: studentVal, reqScore: reqVal, gap: reqVal - studentVal });
        }
      });

      const matchScore = Math.max(55, Math.min(99, Math.round(weightedSum / (totalWeight || 1))));

      // Generate dynamic human-readable explanation
      const topMatchingStr = matchingSkills.length > 0
        ? matchingSkills.map(m => m.skill.replace("_", " ")).join(", ")
        : "problem solving and logical analysis";
      const topGapStr = skillGaps.length > 0
        ? skillGaps.map(g => g.skill.replace("_", " ")).join(" and ")
        : "specialized industry patterns";

      const explanation = `Your demonstrated abilities in ${topMatchingStr} strongly align with the core requirements of a ${career.title}. Strengthening ${topGapStr} will accelerate your career readiness.`;

      return {
        ...career,
        matchPercentage: matchScore,
        matchScore,
        matchingSkills,
        skillGaps,
        explanation
      };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);

    return sendJSON(res, 200, { careers: ranked });
  }

  // 8. GET /api/careers/:careerId
  if (req.method === 'GET' && pathname.startsWith('/api/careers/')) {
    const careerId = pathname.split('/api/careers/')[1];
    const userId = currentUser ? currentUser.id : 'demo_user';
    const db = readDB();
    const career = CAREERS.find(c => c.id === careerId);

    if (!career) return sendJSON(res, 404, { error: 'Career role not found' });

    const skills = db.skill_profiles[userId] || {};
    let weightedSum = 0;
    let totalWeight = 0;
    Object.entries(career.skillWeights).forEach(([sKey, weight]) => {
      weightedSum += (skills[sKey] || 60) * weight;
      totalWeight += weight;
    });

    const matchScore = Math.max(55, Math.min(99, Math.round(weightedSum / (totalWeight || 1))));

    return sendJSON(res, 200, { career: { ...career, matchPercentage: matchScore }, userSkills: skills });
  }

  // 9. POST /api/roadmaps (Generate personalized roadmap from skill gaps)
  if (req.method === 'POST' && pathname === '/api/roadmaps') {
    const body = await parseJSONBody(req);
    const { careerId } = body;
    const userId = currentUser ? currentUser.id : 'demo_user';
    const db = readDB();

    const career = CAREERS.find(c => c.id === (careerId || 'backend-dev')) || CAREERS[0];
    const userSkills = db.skill_profiles[userId] || {};

    // Identify skill gaps to prioritize in roadmap
    const gaps = [];
    Object.entries(career.requiredSkills).forEach(([sKey, reqScore]) => {
      const userVal = userSkills[sKey] || 60;
      if (userVal < reqScore) {
        gaps.push({ skill: sKey, gap: reqScore - userVal });
      }
    });
    gaps.sort((a, b) => b.gap - a.gap);

    const primaryGap = gaps[0]?.skill.replace("_", " ") || "Core Architecture";
    const secondaryGap = gaps[1]?.skill.replace("_", " ") || "Advanced System Design";

    const customRoadmap = {
      userId,
      careerId: career.id,
      roleTitle: career.title,
      overview: `Personalized ${career.title} path targeting your key skill gaps in ${primaryGap} and ${secondaryGap}.`,
      generatedAt: new Date().toISOString(),
      tasks: [
        {
          id: "task_1",
          phase: "Month 1",
          milestoneTitle: `Foundations & ${primaryGap} Mastery`,
          title: `Master Fundamental Patterns in ${primaryGap}`,
          description: `Focus on closing your primary skill gap through hands-on exercises in ${primaryGap}.`,
          skill: primaryGap,
          status: "IN_PROGRESS",
          xp: 50,
          project: `Build a custom prototype demonstrating ${primaryGap}`
        },
        {
          id: "task_2",
          phase: "Month 2",
          milestoneTitle: `Advanced ${secondaryGap} Implementation`,
          title: `Apply ${secondaryGap} to Real-World Scenarios`,
          description: `Deep dive into industry standards and production-ready implementations of ${secondaryGap}.`,
          skill: secondaryGap,
          status: "AVAILABLE",
          xp: 50,
          project: `Architect an end-to-end module integrating ${secondaryGap}`
        },
        {
          id: "task_3",
          phase: "Month 3",
          milestoneTitle: "Production Tooling & Best Practices",
          title: `Tooling Mastery (${career.tools.slice(0, 2).join(", ")})`,
          description: `Integrate industry tools into your daily workflow to reach benchmark efficiency.`,
          skill: "Tools & Systems",
          status: "LOCKED",
          xp: 50,
          project: `Build and deploy a benchmark project using ${career.tools[0]}`
        },
        {
          id: "task_4",
          phase: "Month 4",
          milestoneTitle: "Industry Capstone & Portfolio Readiness",
          title: "Complete End-to-End Capstone Portfolio",
          description: "Synthesize all learned domains into a production-grade portfolio project ready for technical review.",
          skill: "Portfolio",
          status: "LOCKED",
          xp: 100,
          project: `Publish comprehensive ${career.title} Capstone Repo & System Docs`
        }
      ]
    };

    db.roadmaps[userId] = customRoadmap;
    if (currentUser) {
      const uIdx = db.users.findIndex(u => u.id === currentUser.id);
      if (uIdx !== -1) db.users[uIdx].selectedCareerId = career.id;
    }

    writeDB(db);
    return sendJSON(res, 201, { roadmap: customRoadmap });
  }

  // 10. GET /api/roadmaps
  if (req.method === 'GET' && pathname === '/api/roadmaps') {
    const userId = currentUser ? currentUser.id : 'demo_user';
    const db = readDB();
    const roadmap = db.roadmaps[userId] || null;
    return sendJSON(res, 200, { roadmap });
  }

  // 11. POST /api/roadmaps/tasks/complete
  if (req.method === 'POST' && pathname === '/api/roadmaps/tasks/complete') {
    const body = await parseJSONBody(req);
    const { taskId } = body;
    const userId = currentUser ? currentUser.id : 'demo_user';
    const db = readDB();

    const roadmap = db.roadmaps[userId];
    if (!roadmap) return sendJSON(res, 404, { error: 'No active roadmap found' });

    const task = roadmap.tasks.find(t => t.id === taskId);
    if (!task) return sendJSON(res, 404, { error: 'Task not found' });

    task.status = 'COMPLETED';

    // Unlock next task if locked
    const tIdx = roadmap.tasks.findIndex(t => t.id === taskId);
    if (tIdx + 1 < roadmap.tasks.length && roadmap.tasks[tIdx + 1].status === 'LOCKED') {
      roadmap.tasks[tIdx + 1].status = 'AVAILABLE';
    }

    let updatedUser = null;
    if (currentUser) {
      const uIdx = db.users.findIndex(u => u.id === currentUser.id);
      if (uIdx !== -1) {
        db.users[uIdx].xp = (db.users[uIdx].xp || 0) + (task.xp || 50);
        db.users[uIdx].level = computeLevel(db.users[uIdx].xp);
        updatedUser = db.users[uIdx];
      }
    }

    const badges = evaluateBadges(userId, db);
    writeDB(db);

    return sendJSON(res, 200, { roadmap, user: updatedUser, badges });
  }

  // 12. GET /api/progress
  if (req.method === 'GET' && pathname === '/api/progress') {
    const userId = currentUser ? currentUser.id : 'demo_user';
    const db = readDB();
    const user = db.users.find(u => u.id === userId) || currentUser || { xp: 0, level: 1, streak: 1 };
    const skills = db.skill_profiles[userId] || {};
    const attempts = (db.game_attempts || []).filter(a => a.userId === userId);
    const badges = evaluateBadges(userId, db);
    const roadmap = db.roadmaps[userId] || null;

    return sendJSON(res, 200, {
      user,
      skills,
      attempts,
      badges,
      roadmap
    });
  }

  // Fallback 404
  return sendJSON(res, 404, { error: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`⚡ SkillQuest Unified REST Server listening on http://localhost:${PORT}`);
});

