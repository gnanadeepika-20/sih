export const ROLES = [
  // --- TECHNICAL ROLES ---
  {
    id: "backend",
    name: "Backend Development",
    track: "tech",
    category: "Software Engineering",
    icon: "Server",
    description: "Design robust APIs, manage relational/NoSQL databases, and architect scalable server systems.",
    weights: { logic: 0.40, problem: 0.40, ui: 0.10, comm: 0.10, qa: 0.00 },
    threshold: 65,
    avgSalary: "₹6 - ₹18 LPA",
    topSkills: ["Data Structures", "System Design", "Node.js / Python / Java", "SQL & Databases"],
  },
  {
    id: "frontend",
    name: "Frontend / UI-UX Engineering",
    track: "tech",
    category: "Software Engineering",
    icon: "Layout",
    description: "Craft responsive, pixel-perfect web experiences, sleek interfaces, and intuitive interactive flows.",
    weights: { ui: 0.45, logic: 0.25, problem: 0.15, comm: 0.15, qa: 0.00 },
    threshold: 60,
    avgSalary: "₹5.5 - ₹16 LPA",
    topSkills: ["React / Next.js", "Figma Design Systems", "CSS Architecture", "State Management"],
  },
  {
    id: "data_analyst",
    name: "Data Analyst",
    track: "tech",
    category: "Data & AI",
    icon: "BarChart3",
    description: "Transform complex raw data into actionable business intelligence, dashboards, and growth insights.",
    weights: { logic: 0.45, problem: 0.25, qa: 0.20, comm: 0.10, ui: 0.00 },
    threshold: 65,
    avgSalary: "₹5 - ₹15 LPA",
    topSkills: ["SQL & BigQuery", "Python / Pandas", "PowerBI & Tableau", "Statistical Analysis"],
  },
  {
    id: "ml_engineer",
    name: "ML & AI Engineer",
    track: "tech",
    category: "Data & AI",
    icon: "Cpu",
    description: "Train predictive algorithms, deploy neural networks, and integrate machine learning pipelines into products.",
    weights: { logic: 0.35, problem: 0.35, qa: 0.20, comm: 0.10, ui: 0.00 },
    threshold: 70,
    avgSalary: "₹8 - ₹24 LPA",
    topSkills: ["PyTorch / TensorFlow", "Vector Math & Probability", "Model Optimization", "Python Pipeline Design"],
  },
  {
    id: "qa_testing",
    name: "QA & Automation Engineering",
    track: "tech",
    category: "Quality Assurance",
    icon: "ShieldCheck",
    description: "Ensure software reliability through automated test suites, edge-case analysis, and bug hunting.",
    weights: { problem: 0.35, qa: 0.35, logic: 0.20, comm: 0.10, ui: 0.00 },
    threshold: 60,
    avgSalary: "₹4.5 - ₹12 LPA",
    topSkills: ["Selenium / Cypress", "API Testing (Postman)", "Bug Tracking (Jira)", "Automation Scripting"],
  },
  {
    id: "prompt_engineering",
    name: "Prompt & Generative AI Engineering",
    track: "tech",
    category: "Emerging Tech",
    icon: "Sparkles",
    description: "Guide Large Language Models, build RAG pipelines, and design autonomous AI agent workflows.",
    weights: { comm: 0.35, ui: 0.30, problem: 0.25, logic: 0.10, qa: 0.00 },
    threshold: 65,
    avgSalary: "₹7 - ₹20 LPA",
    topSkills: ["LLM Prompt Architecture", "LangChain / LlamaIndex", "Vector DBs (Chroma/Pinecone)", "System Prompting"],
  },

  // --- NON-TECHNICAL ROLES ---
  {
    id: "content_writing",
    name: "Content Strategy & Copywriting",
    track: "nontech",
    category: "Marketing & Media",
    icon: "PenTool",
    description: "Write compelling brand narratives, technical articles, high-converting copy, and viral social content.",
    weights: { comm: 0.50, ui: 0.30, logic: 0.10, problem: 0.10, qa: 0.00 },
    threshold: 60,
    avgSalary: "₹4 - ₹12 LPA",
    topSkills: ["SEO Content Writing", "Storytelling & Messaging", "Copywriting Frameworks", "Editorial Planning"],
  },
  {
    id: "digital_marketing",
    name: "Digital & Growth Marketing",
    track: "nontech",
    category: "Marketing & Growth",
    icon: "Megaphone",
    description: "Run performance ad campaigns, optimize conversion funnels, and scale customer acquisition channels.",
    weights: { ui: 0.35, comm: 0.35, logic: 0.20, problem: 0.10, qa: 0.00 },
    threshold: 60,
    avgSalary: "₹4.5 - ₹14 LPA",
    topSkills: ["Google Ads & Meta Ads", "Conversion Rate Optimization", "Growth Hacking", "Google Analytics 4"],
  },
  {
    id: "hr_ops",
    name: "HR & People Operations",
    track: "nontech",
    category: "Management & Ops",
    icon: "Users",
    description: "Recruit top talent, drive company culture, manage employee experience, and streamline HR processes.",
    weights: { comm: 0.45, qa: 0.30, logic: 0.15, problem: 0.10, ui: 0.00 },
    threshold: 60,
    avgSalary: "₹4 - ₹11 LPA",
    topSkills: ["Talent Acquisition", "Employee Engagement", "Labor Law Basics", "HRMS Platforms"],
  },
  {
    id: "business_analyst",
    name: "Business Analyst",
    track: "nontech",
    category: "Strategy & Ops",
    icon: "Briefcase",
    description: "Bridge business requirements with engineering teams through process mapping and requirements analysis.",
    weights: { logic: 0.40, comm: 0.35, problem: 0.15, qa: 0.10, ui: 0.00 },
    threshold: 65,
    avgSalary: "₹6 - ₹16 LPA",
    topSkills: ["Requirements Gathering (BRD/FRD)", "Flowcharts & Wireframing", "Excel Modeling", "Agile / Scrum"],
  },
  {
    id: "sales_bd",
    name: "Sales & Business Development",
    track: "nontech",
    category: "Revenue & Growth",
    icon: "TrendingUp",
    description: "Drive revenue growth, pitch enterprise clients, build key strategic partnerships, and close deals.",
    weights: { comm: 0.50, problem: 0.25, ui: 0.15, logic: 0.10, qa: 0.00 },
    threshold: 60,
    avgSalary: "₹5 - ₹18 LPA (Inc. Bonus)",
    topSkills: ["B2B Pitching & Closing", "CRM (HubSpot/Salesforce)", "Lead Generation", "Client Relationship Management"],
  },
  {
    id: "product_management",
    name: "Product & Project Management",
    track: "nontech",
    category: "Product & Strategy",
    icon: "Compass",
    description: "Define product vision, prioritize feature roadmaps, manage cross-functional teams, and launch products.",
    weights: { comm: 0.35, logic: 0.30, problem: 0.25, ui: 0.10, qa: 0.00 },
    threshold: 68,
    avgSalary: "₹7 - ₹22 LPA",
    topSkills: ["Product Strategy & PRDs", "Agile Product Backlogs", "User Research", "Metrics & KPIs"],
  },
];

export function calculateRecommendations(scores) {
  // scores = { logic: 0-100, problem: 0-100, ui: 0-100, comm: 0-100, qa: 0-100 }
  return ROLES.map((role) => {
    let matchScore = 0;
    let totalWeight = 0;
    Object.entries(role.weights).forEach(([skill, weight]) => {
      if (weight > 0) {
        matchScore += (scores[skill] || 0) * weight;
        totalWeight += weight;
      }
    });

    const matchPercent = Math.min(98, Math.max(35, Math.round(matchScore)));

    return {
      ...role,
      matchPercent,
      isStrongFit: matchPercent >= role.threshold,
    };
  }).sort((a, b) => b.matchPercent - a.matchPercent);
}
