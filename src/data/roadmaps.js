export const ROADMAPS = {
  "Backend Development": {
    "3_months": [
      {
        phase: "Month 1",
        title: "DSA Foundations & Language Mastery",
        topics: ["Arrays, Linked Lists, Hash Maps", "OOP Concepts & Memory Management", "Node.js / Python Basics"],
        resources: [
          { name: "DSA in 30 Days (YouTube - freeCodeCamp)", url: "https://www.youtube.com/watch?v=8hly31xKLI0" },
          { name: "LeetCode 50 Easy Data Structures", url: "https://leetcode.com/problemset/all/" }
        ],
        project: "Build a CLI Student Task Manager in Node/Python",
        interviewPrep: "Practice time/space complexity analysis (Big-O)"
      },
      {
        phase: "Month 2",
        title: "Database Architecture & REST APIs",
        topics: ["PostgreSQL / MongoDB Design", "RESTful API Conventions & Express/FastAPI", "Authentication (JWT & OAuth)"],
        resources: [
          { name: "PostgreSQL Tutorial for Beginners", url: "https://www.postgresqltutorial.com/" },
          { name: "REST API Best Practices (FreeCodeCamp)", url: "https://www.freecodecamp.org/news/rest-api-design-best-practices/" }
        ],
        project: "Build a Secure E-Commerce API with JWT auth and SQL database",
        interviewPrep: "Solve SQL query puzzles & indexing questions"
      },
      {
        phase: "Month 3",
        title: "System Design Basics & Deployment",
        topics: ["Caching (Redis), Rate Limiting", "Docker Containers & Cloud Basics", "System Design Primer"],
        resources: [
          { name: "System Design Primer (GitHub)", url: "https://github.com/donnemartin/system-design-primer" },
          { name: "Docker for Beginners (Docker Docs)", url: "https://docs.docker.com/get-started/" }
        ],
        project: "Deploy microservice API to Render/AWS with Redis caching",
        interviewPrep: "Mock system design interview for URL Shortener / Chat App"
      }
    ],
    "6_months": [
      { phase: "Month 1-2", title: "Advanced DSA & Algorithm Design", topics: ["Trees, Graphs, DP", "Concurrency"], resources: [{ name: "NeetCode 150", url: "https://neetcode.io/" }], project: "Custom Cache Engine", interviewPrep: "Medium/Hard LeetCode" },
      { phase: "Month 3-4", title: "Microservices & Message Queues", topics: ["Kafka/RabbitMQ", "gRPC"], resources: [{ name: "Kafka Crash Course", url: "https://youtube.com" }], project: "Distributed Event Pipeline", interviewPrep: "Message Driven Architecture" },
      { phase: "Month 5-6", title: "High Scalability & Cloud Ops", topics: ["Kubernetes", "CI/CD Pipelines"], resources: [{ name: "DevOps Roadmap", url: "https://roadmap.sh/devops" }], project: "Auto-scaling Production Service", interviewPrep: "Live Coding & System Scaling" }
    ],
    "12_months": [
      { phase: "Month 1-4", title: "Core Software Engineering & CS Theory", topics: ["Operating Systems", "Networking", "Database Internals"], resources: [{ name: "CS50 & MIT OpenCourseWare", url: "https://ocw.mit.edu" }], project: "Custom Storage Engine / Database", interviewPrep: "Deep CS Fundamentals" },
      { phase: "Month 5-8", title: "Enterprise Scalability & Distributed Systems", topics: ["Distributed Locks", "Sharding & Replication"], resources: [{ name: "Designing Data-Intensive Applications", url: "https://dataintensive.net" }], project: "Distributed Key-Value Store", interviewPrep: "Staff-level System Design" },
      { phase: "Month 9-12", title: "Production Engineering & Open Source", topics: ["Performance Profiling", "Security Auditing"], resources: [{ name: "Open Source Contributor Guide", url: "https://opensource.guide" }], project: "Contribute to Node/PostgreSQL ecosystem", interviewPrep: "Architecture Portfolio Review" }
    ]
  },

  "Frontend / UI-UX Engineering": {
    "3_months": [
      {
        phase: "Month 1",
        title: "Modern HTML, CSS & UI Design Rules",
        topics: ["Flexbox, Grid, Responsive Design", "Visual Hierarchy, Spacing, Typography", "Figma Design Fundamentals"],
        resources: [
          { name: "Refactoring UI Principles", url: "https://refactoringui.com/" },
          { name: "Figma Beginner Tutorial", url: "https://www.figma.com/resources/learn-design/" }
        ],
        project: "Design & build a Responsive Landing Page in HTML/CSS",
        interviewPrep: "CSS Layout & Specificity interview questions"
      },
      {
        phase: "Month 2",
        title: "JavaScript ES6+ & React Fundamentals",
        topics: ["DOM Manipulation, Async/Await", "React Components, Props, Hooks", "Tailwind CSS / CSS Modules"],
        resources: [
          { name: "React Official Docs (React.dev)", url: "https://react.dev/" },
          { name: "JavaScript.info - Modern JS", url: "https://javascript.info/" }
        ],
        project: "Build a Dynamic Dashboard App with Live API Integration",
        interviewPrep: "React re-render optimization & state closure questions"
      },
      {
        phase: "Month 3",
        title: "State Management & Production UI",
        topics: ["Zustand / Redux Toolkit", "Framer Motion Animations", "Web Performance & Accessibility (a11y)"],
        resources: [
          { name: "Web.dev Accessibility Guide", url: "https://web.dev/learn/accessibility/" },
          { name: "Framer Motion Masterclass", url: "https://www.framer.com/motion/" }
        ],
        project: "Build a Full Interactive Design System & Component Library",
        interviewPrep: "UI Machine Coding Interview (Autocomplete / Modal / Carousel)"
      }
    ],
    "6_months": [
      { phase: "Month 1-2", title: "Next.js & Server Components", topics: ["SSR, SSG, ISR", "App Router"], resources: [{ name: "Next.js Learn", url: "https://nextjs.org/learn" }], project: "SaaS Application with Next.js", interviewPrep: "SSR vs Client Rendering" },
      { phase: "Month 3-4", title: "Advanced Design Systems", topics: ["Design Tokens", "Radix UI / Storybook"], resources: [{ name: "Storybook Docs", url: "https://storybook.js.org" }], project: "Enterprise Design System", interviewPrep: "Component Architecture" },
      { phase: "Month 5-6", title: "Frontend Performance & Testing", topics: ["Lighthouse Optimization", "Cypress / Vitest"], resources: [{ name: "Web Vitals Guide", url: "https://web.dev/vitals" }], project: "High Performance Web App", interviewPrep: "Performance Audit Case Study" }
    ],
    "12_months": [
      { phase: "Month 1-4", title: "UI Engine Internals & WebGL", topics: ["Canvas API, Three.js", "Virtual DOM Internals"], resources: [{ name: "Three.js Journey", url: "https://threejs-journey.com" }], project: "3D Product Customizer", interviewPrep: "Complex Web Application Design" },
      { phase: "Month 5-8", title: "Micro-Frontends & Architecture", topics: ["Module Federation", "PWA Architecture"], resources: [{ name: "Micro Frontends Guide", url: "https://micro-frontends.org" }], project: "Multi-app Micro-frontend Architecture", interviewPrep: "Staff Frontend System Design" },
      { phase: "Month 9-12", title: "Design System Engineering & Open Source", topics: ["Accessibility Audits", "Package Publishing"], resources: [{ name: "NPM Package Guide", url: "https://docs.npmjs.com" }], project: "Publish Open Source UI Library", interviewPrep: "Portfolio Showcase Presentation" }
    ]
  },

  "Data Analyst": {
    "3_months": [
      {
        phase: "Month 1",
        title: "Advanced Excel & SQL Fundamentals",
        topics: ["Pivot Tables, VLOOKUP, INDEX-MATCH", "SQL Queries, JOINs, Group By, Aggregation", "Subqueries & Window Functions"],
        resources: [
          { name: "Mode Analytics SQL Tutorial (Free)", url: "https://mode.com/sql-tutorial/" },
          { name: "Chandoo Advanced Excel", url: "https://youtube.com/@chandoo" }
        ],
        project: "Analyze E-commerce Sales Dataset in SQL & Excel",
        interviewPrep: "SQL JOIN & Aggregation live coding questions"
      },
      {
        phase: "Month 2",
        title: "Python for Data & EDA",
        topics: ["Pandas DataFrames & Data Cleaning", "NumPy & Data Manipulation", "Seaborn / Matplotlib Visualization"],
        resources: [
          { name: "Kaggle Python & Pandas Micro-Courses", url: "https://www.kaggle.com/learn" },
          { name: "Data School Pandas Tutorials", url: "https://youtube.com/@dataschool" }
        ],
        project: "Perform Exploratory Data Analysis (EDA) on Customer Churn dataset",
        interviewPrep: "Explain data imputation & outlier detection methods"
      },
      {
        phase: "Month 3",
        title: "Business Intelligence & Dashboards",
        topics: ["PowerBI / Tableau Dashboard Creation", "Data Storytelling & Executive Reports", "A/B Testing Basics"],
        resources: [
          { name: "Tableau Public Gallery & Tutorials", url: "https://public.tableau.com/" },
          { name: "Google Data Analytics Certificate Guide", url: "https://coursera.org" }
        ],
        project: "Create an Executive Sales Performance Dashboard in PowerBI/Tableau",
        interviewPrep: "Present a business data case study to interviewers"
      }
    ],
    "6_months": [
      { phase: "Month 1-2", title: "Statistical Inference & Hypothesis Testing", topics: ["P-values, Confidence Intervals", "ANOVA"], resources: [{ name: "Khan Academy Statistics", url: "https://khanacademy.org" }], project: "A/B Test Experiment Analysis", interviewPrep: "Statistics Case Studies" },
      { phase: "Month 3-4", title: "Big Data & Data Warehousing", topics: ["Snowflake / BigQuery", "dbt"], resources: [{ name: "dbt Fundamentals", url: "https://getdbt.com" }], project: "Data Warehouse Pipeline", interviewPrep: "SQL Optimization & ETL" },
      { phase: "Month 5-6", title: "Automated Data Pipelines", topics: ["Airflow Basics", "Python ETL"], resources: [{ name: "Airflow Docs", url: "https://airflow.apache.org" }], project: "Automated Financial Report Generator", interviewPrep: "Analytics Engineering Case Study" }
    ],
    "12_months": [
      { phase: "Month 1-4", title: "Applied Econometrics & Causal Inference", topics: ["Regression Analysis", "Diff-in-Diff"], resources: [{ name: "Causal Inference Book", url: "https://mixtape.scutta.com" }], project: "Market Price Sensitivity Model", interviewPrep: "Senior Analytics Case Interviews" },
      { phase: "Month 5-8", title: "Data Architecture & Analytics Engineering", topics: ["Data Modeling (Kimball)", "Data Quality Frameworks"], resources: [{ name: "The Data Warehouse Toolkit", url: "https://kimballgroup.com" }], project: "Enterprise Analytics Architecture", interviewPrep: "Data Governance & Strategy" },
      { phase: "Month 9-12", title: "Machine Learning for Analysts", topics: ["Predictive Churn Models", "Clustering (K-Means)"], resources: [{ name: "Scikit-Learn Docs", url: "https://scikit-learn.org" }], project: "Customer Segmentation Engine", interviewPrep: "End-to-end Data Product Case Study" }
    ]
  },

  "Content Strategy & Copywriting": {
    "3_months": [
      {
        phase: "Month 1",
        title: "Writing Principles & Structure",
        topics: ["Headline Writing Frameworks", "Readability & Scannability", "Audience Empathy Mapping"],
        resources: [
          { name: "On Writing Well (William Zinsser)", url: "https://www.goodreads.com" },
          { name: "HubSpot Content Marketing Course", url: "https://academy.hubspot.com/" }
        ],
        project: "Write 3 Long-form Blog Posts & 10 Social Hooks",
        interviewPrep: "Review copywriting portfolio & headline frameworks"
      },
      {
        phase: "Month 2",
        title: "SEO & Product Copywriting",
        topics: ["Keyword Research (Ahrefs/Semrush)", "On-Page SEO Optimization", "Landing Page Copywriting"],
        resources: [
          { name: "Backlinko SEO Starter Guide", url: "https://backlinko.com/seo-technique" },
          { name: "Copyhackers Free Guide", url: "https://copyhackers.com/" }
        ],
        project: "Write high-converting landing page copy for a SaaS product",
        interviewPrep: "Explain SEO keyword mapping & conversion copy metrics"
      },
      {
        phase: "Month 3",
        title: "Portfolio & Brand Voice",
        topics: ["Brand Tone of Voice Guides", "Newsletter Strategy", "Medium / Substack Publishing"],
        resources: [
          { name: "Mailchimp Brand Style Guide", url: "https://styleguide.mailchimp.com/" }
        ],
        project: "Launch a personal newsletter and publish 5 portfolio articles",
        interviewPrep: "Present writing portfolio with engagement metrics"
      }
    ],
    "6_months": [
      { phase: "Month 1-2", title: "Technical Writing & Developer Docs", topics: ["API Documentation", "Markdown"], resources: [{ name: "Write the Docs", url: "https://writethedocs.org" }], project: "Developer Documentation Portal", interviewPrep: "Technical Simplification Test" },
      { phase: "Month 3-4", title: "Email Marketing Sequences", topics: ["Drip Campaigns", "Conversion Email"], resources: [{ name: "ConvertKit Academy", url: "https://convertkit.com" }], project: "7-Day Onboarding Email Series", interviewPrep: "Email Metrics & Open Rate Strategy" },
      { phase: "Month 5-6", title: "Content Distribution & Repurposing", topics: ["LinkedIn Growth", "Twitter Threads"], resources: [{ name: "Ship 30 for 30", url: "https://ship30for30.com" }], project: "Multi-channel Content Campaign", interviewPrep: "Content Funnel Strategy Presentation" }
    ],
    "12_months": [
      { phase: "Month 1-4", title: "Brand Journalism & Thought Leadership", topics: ["Executive Ghostwriting", "Whitepapers"], resources: [{ name: "HBR Writing Guide", url: "https://hbr.org" }], project: "Industry Research Whitepaper", interviewPrep: "Senior Content Strategist Portfolio" },
      { phase: "Month 5-8", title: "Content Operations & Management", topics: ["Editorial Calendars", "Managing Writers"], resources: [{ name: "Asana Content Workflow", url: "https://asana.com" }], project: "Full Media Hub Content Strategy", interviewPrep: "Content ROI & Metrics Defense" },
      { phase: "Month 9-12", title: "Book / Longform Publishing", topics: ["E-book Authoring", "Publication Strategy"], resources: [{ name: "Gumroad Creator Guide", url: "https://gumroad.com" }], project: "Publish 50-page Technical Guide", interviewPrep: "Full Portfolio Showcase" }
    ]
  },

  "Digital & Growth Marketing": {
    "3_months": [
      {
        phase: "Month 1",
        title: "Marketing Fundamentals & Funnels",
        topics: ["AIDA Funnel Concept", "Target Audience & Persona Mapping", "Customer Acquisition Cost (CAC) & LTV"],
        resources: [
          { name: "Google Digital Garage (Free Cert)", url: "https://learndigital.withgoogle.com/" },
          { name: "HubSpot Inbound Marketing", url: "https://academy.hubspot.com/" }
        ],
        project: "Create a Customer Persona & Funnel Breakdown for a local startup",
        interviewPrep: "Explain CAC, LTV, ROAS, and conversion metrics"
      },
      {
        phase: "Month 2",
        title: "Paid Media (Google Ads & Meta Ads)",
        topics: ["Search & Display Campaigns", "Facebook/IG Ad Manager", "Ad Creative Testing & Retargeting"],
        resources: [
          { name: "Meta Blueprint Cert Prep", url: "https://www.facebook.com/business/learn" },
          { name: "Google Skillshop Ads Certification", url: "https://skillshop.withgoogle.com/" }
        ],
        project: "Design a $500 mock PPC & Meta Ads Campaign Strategy",
        interviewPrep: "Calculate ROAS & CTR optimization scenario"
      },
      {
        phase: "Month 3",
        title: "Analytics, CRO & Growth Hacking",
        topics: ["Google Analytics 4 (GA4)", "A/B Testing with VWO/Optimizely", "Email Marketing Automation"],
        resources: [
          { name: "GA4 Certification Course", url: "https://skillshop.withgoogle.com/" },
          { name: "Reforge Growth Loops Essay", url: "https://reforge.com" }
        ],
        project: "Build a GA4 Tracking & CRO Audit Case Study for an app",
        interviewPrep: "Present a growth marketing experiment framework"
      }
    ]
  },

  "Business Analyst": {
    "3_months": [
      {
        phase: "Month 1",
        title: "Business Process & Requirements",
        topics: ["BRD & FRD Document Creation", "Process Flowcharting (BPMN / Visio)", "Agile User Stories & Acceptance Criteria"],
        resources: [
          { name: "IIBA Business Analysis Guide", url: "https://www.iiba.org/" },
          { name: "Lucidchart Process Mapping", url: "https://www.lucidchart.com/" }
        ],
        project: "Write a Business Requirements Document (BRD) for an Uber for X app",
        interviewPrep: "Explain difference between functional and non-functional requirements"
      },
      {
        phase: "Month 2",
        title: "SQL & Financial Excel Modeling",
        topics: ["SQL Data Extraction & Aggregation", "Excel Financial Models & Forecasting", "Root Cause Analysis (5 Whys, Fishbone)"],
        resources: [
          { name: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial/" },
          { name: "Corporate Finance Institute Excel", url: "https://corporatefinanceinstitute.com/" }
        ],
        project: "Build a Revenue Forecast & Profitability Model in Excel",
        interviewPrep: "Solve a business case study live during interview"
      },
      {
        phase: "Month 3",
        title: "Wireframing & Stakeholder Management",
        topics: ["Balsamiq / Figma Wireframing", "Stakeholder Interview Techniques", "Jira Product Backlog Management"],
        resources: [
          { name: "Atlassian Jira Agile Guide", url: "https://www.atlassian.com/agile" }
        ],
        project: "Deliver an end-to-end Product Case Study with wireframe & user stories",
        interviewPrep: "Mock stakeholder prioritization interview"
      }
    ]
  }
};

// Generic fallback generator for missing roles
export function getRoadmap(roleName, durationKey = "3_months") {
  if (ROADMAPS[roleName] && ROADMAPS[roleName][durationKey]) {
    return ROADMAPS[roleName][durationKey];
  }

  // Generic customized fallback roadmap
  return [
    {
      phase: durationKey === "3_months" ? "Month 1" : "Phase 1",
      title: `Foundation & Core Fundamentals of ${roleName}`,
      topics: ["Industry Standards & Terminologies", "Core Tools & Methodology", "Basic Frameworks"],
      resources: [
        { name: "Coursera / edX Intro Course", url: "https://www.coursera.org" },
        { name: "YouTube Masterclass Playlist", url: "https://youtube.com" }
      ],
      project: `Build a starter project demonstrating core principles of ${roleName}`,
      interviewPrep: "Master basic terminology and standard industry concepts"
    },
    {
      phase: durationKey === "3_months" ? "Month 2" : "Phase 2",
      title: "Intermediate Hands-on Practice",
      topics: ["Applied Problem Solving", "Toolchain Integration", "Best Practices"],
      resources: [
        { name: "Official Documentation & Guides", url: "https://google.com" },
        { name: "FreeCodeCamp / Medium Articles", url: "https://freecodecamp.org" }
      ],
      project: `Complete a real-world case study project tailored for ${roleName}`,
      interviewPrep: "Practice behavioral & scenario-based technical questions"
    },
    {
      phase: durationKey === "3_months" ? "Month 3" : "Phase 3",
      title: "Portfolio Building & Placement Readiness",
      topics: ["Resume Optimization", "Portfolio Showcase", "Mock Interviews"],
      resources: [
        { name: "Pramp Peer Mock Interviews", url: "https://www.pramp.com" },
        { name: "GitHub / Portfolio Hosting", url: "https://github.com" }
      ],
      project: "Deploy & present your master portfolio project to peers",
      interviewPrep: "Conduct 3 live peer mock interviews and refine elevator pitch"
    }
  ];
}
