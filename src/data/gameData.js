export const DEBUG_ROUNDS = [
  {
    title: "Array Sum Boundary Bug",
    difficulty: "Easy",
    lines: [
      "function sumArray(arr) {",
      "  let sum = 0;",
      "  for (let i = 1; i <= arr.length; i++) {",
      "    sum += arr[i];",
      "  }",
      "  return sum;",
      "}"
    ],
    bugLine: 2,
    explanation: "Loop starts at index 1 instead of 0, skipping the first element and throwing an undefined error at arr.length!",
    fixedLine: "  for (let i = 0; i < arr.length; i++) {"
  },
  {
    title: "Max Value Initialization Bug",
    difficulty: "Easy",
    lines: [
      "function findMax(arr) {",
      "  let max = 0;",
      "  for (let i = 0; i < arr.length; i++) {",
      "    if (arr[i] > max) max = arr[i];",
      "  }",
      "  return max;",
      "}"
    ],
    bugLine: 1,
    explanation: "Initializing max to 0 fails if all numbers in array are negative (e.g. [-5, -10, -3] will incorrectly return 0).",
    fixedLine: "  let max = arr[0];"
  },
  {
    title: "Infinite Loop Condition",
    difficulty: "Medium",
    lines: [
      "function countdown(start) {",
      "  let current = start;",
      "  while (current > 0) {",
      "    console.log(current);",
      "    current + 1;",
      "  }",
      "  return 'Done';",
      "}"
    ],
    bugLine: 4,
    explanation: "'current + 1' doesn't update the variable! It should be 'current -= 1' or 'current--', causing an infinite loop.",
    fixedLine: "    current--; "
  },
  {
    title: "Off-by-One String Indexing",
    difficulty: "Medium",
    lines: [
      "function reverseWord(word) {",
      "  let reversed = '';",
      "  for (let i = word.length; i >= 0; i--) {",
      "    reversed += word[i];",
      "  }",
      "  return reversed;",
      "}"
    ],
    bugLine: 2,
    explanation: "Starting loop at 'word.length' accesses an out-of-bounds character (undefined). Should start at 'word.length - 1'.",
    fixedLine: "  for (let i = word.length - 1; i >= 0; i--) {"
  }
];

export const LAYOUT_PAIRS = [
  { id: "nav", slot: "Top Navigation Bar (Logo + Links)", chip: "<Header & Navbar>" },
  { id: "hero", slot: "Main Visual Banner + Call to Action", chip: "<Hero Section>" },
  { id: "grid", slot: "3-Column Feature Cards Layout", chip: "<Features Grid>" },
  { id: "footer", slot: "Bottom Copyright & Social Links", chip: "<Footer Bar>" }
];

export const COLOR_ROUNDS = [
  {
    id: "dark_card",
    label: "Dark Navy Background (#1B1E52)",
    bg: "#1B1E52",
    options: [
      { name: "Option A (Poor)", hex: "#3A3D7C", correct: false },
      { name: "Option B (Optimal)", hex: "#F5F3ED", correct: true },
      { name: "Option C (Low Contrast)", hex: "#4E5296", correct: false }
    ],
    correct: "#F5F3ED"
  },
  {
    id: "amber_banner",
    label: "Golden Amber Accent Background (#FFB238)",
    bg: "#FFB238",
    options: [
      { name: "Option A (Optimal)", hex: "#12143A", correct: true },
      { name: "Option B (Low Contrast)", hex: "#FFD485", correct: false },
      { name: "Option C (Faded)", hex: "#FFFFFF", correct: false }
    ],
    correct: "#12143A"
  },
  {
    id: "coral_button",
    label: "Bright Coral Alert (#FF7A6B)",
    bg: "#FF7A6B",
    options: [
      { name: "Option A (Low Contrast)", hex: "#FFB5AD", correct: false },
      { name: "Option B (Optimal)", hex: "#12143A", correct: true },
      { name: "Option C (Faded)", hex: "#FF9B8F", correct: false }
    ],
    correct: "#12143A"
  }
];

export const FONT_PAIRS = [
  { id: "title", slot: "Bold Impact Title / Hero Heading", chip: "Space Grotesk (700 Bold)" },
  { id: "body", slot: "High-Readability Article Body Paragraph", chip: "Inter Regular (400)" },
  { id: "code", slot: "Technical Code Snippet & Terminal Output", chip: "JetBrains Mono (Monospace)" }
];

export const SIGNAL_DECODER_ROUNDS = [
  {
    scrambled: ["to", "Click", "changes", "save", "submit"],
    target: "Click submit to save changes",
    hint: "Action instruction"
  },
  {
    scrambled: ["from", "Data", "server", "to", "client", "flows"],
    target: "Data flows from client to server",
    hint: "System flow sentence"
  },
  {
    scrambled: ["simplifies", "Clear", "ideas", "complex", "communication"],
    target: "Clear communication simplifies complex ideas",
    hint: "Core principle"
  }
];

export const EXPLAIN_SIMPLE_PROMPTS = [
  {
    id: "api",
    prompt: "Explain what an API is to a non-technical friend.",
    options: [
      {
        text: "An API is like a waiter at a restaurant — it takes your order (request) to the kitchen (server) and brings back your food (data) without you needing to enter the kitchen.",
        score: 100,
        feedback: "Perfect analogy! Clear, jargon-free, and easy for anyone to picture."
      },
      {
        text: "An API is an Application Programming Interface that exposes HTTP endpoints using REST JSON payloads for client-server decoupling.",
        score: 35,
        feedback: "Too much technical jargon! Doesn't simplify for a non-tech audience."
      },
      {
        text: "It is a piece of code that connects two applications together on the internet.",
        score: 70,
        feedback: "Accurate, but a bit plain. Lacks a memorable analogy."
      }
    ]
  },
  {
    id: "database",
    prompt: "Explain what a Database is to a high school student.",
    options: [
      {
        text: "A database is a giant digital filing cabinet organized with drawers and labels so an app can store, find, and update information instantly.",
        score: 100,
        feedback: "Spot-on! Visual filing cabinet metaphor communicates organization and instant retrieval."
      },
      {
        text: "A database is a structured B-tree storage engine that processes ACID compliant SQL transactions.",
        score: 30,
        feedback: "Loaded with heavy database internals. A non-tech listener will get confused."
      },
      {
        text: "A database holds user passwords and data in memory.",
        score: 60,
        feedback: "Partially correct, but imprecise and missing key storage concepts."
      }
    ]
  }
];

export const QA_SPOTTER_DATASETS = [
  {
    id: "user_table",
    title: "User Account Records Data Audit",
    instruction: "Spot the record containing a data anomaly or bug (e.g. invalid email format, negative age, or corrupt ID):",
    rows: [
      { id: "USR-101", name: "Ananya Sharma", email: "ananya@college.edu", age: 21, status: "Active" },
      { id: "USR-102", name: "Rahul Verma", email: "rahul.verma@gmail", age: 22, status: "Active", isBug: true, bugReason: "Invalid email syntax (missing domain extension .com)" },
      { id: "USR-103", name: "Priya Patel", email: "priya@domain.in", age: 20, status: "Pending" },
      { id: "USR-104", name: "Vikram Singh", email: "vikram@tech.co", age: 23, status: "Active" }
    ]
  },
  {
    id: "api_response",
    title: "API Status Code Audit",
    instruction: "Spot the HTTP response entry with an inconsistent state logic:",
    rows: [
      { id: "REQ-001", endpoint: "/api/v1/auth", status: 200, message: "OK Success" },
      { id: "REQ-002", endpoint: "/api/v1/users", status: 404, message: "Not Found" },
      { id: "REQ-003", endpoint: "/api/v1/payment", status: 200, message: "Server Internal Error", isBug: true, bugReason: "Status 200 (OK) contradicts error message 'Server Internal Error'!" },
      { id: "REQ-004", endpoint: "/api/v1/health", status: 500, message: "Service Unavailable" }
    ]
  }
];
