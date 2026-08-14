import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const INITIAL_DB = {
  users: [],
  onboarding: {},
  game_attempts: [],
  skill_profiles: {},
  roadmaps: {},
  badges: {}
};

function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf8');
      return INITIAL_DB;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(data);
    return {
      users: parsed.users || [],
      onboarding: parsed.onboarding || {},
      game_attempts: parsed.game_attempts || [],
      skill_profiles: parsed.skill_profiles || {},
      roadmaps: parsed.roadmaps || {},
      badges: parsed.badges || {}
    };
  } catch (err) {
    console.error('Error reading database file:', err);
    return INITIAL_DB;
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing database file:', err);
  }
}

export function hashPassword(password) {
  return crypto.createHash('sha256').update((password || '') + 'skillquest_salt_2026').digest('hex');
}

export function generateToken(user) {
  const payload = `${user.id}:${user.email}:${Date.now()}`;
  return crypto.createHmac('sha256', 'skillquest_secret_key_2026').update(payload).digest('hex') + '.' + Buffer.from(payload).toString('base64');
}

export function verifyToken(token) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const payload = Buffer.from(parts[1], 'base64').toString('utf8');
    const [userId, email] = payload.split(':');
    const db = readDB();
    const user = db.users.find(u => u.id === userId && u.email === email);
    return user || null;
  } catch (e) {
    return null;
  }
}

export { readDB, writeDB };

