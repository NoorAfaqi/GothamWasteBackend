require("dotenv").config();

const PORT = process.env.PORT || 3000;

const rawTimeout = Number(process.env.FIREBASE_WRITE_TIMEOUT_MS || 30000);
const FIREBASE_WRITE_TIMEOUT_MS = Number.isFinite(rawTimeout)
  ? Math.max(1000, rawTimeout)
  : 30000;

function normalizeDatabaseUrl(raw) {
  if (raw == null) {
    return undefined;
  }
  let s = String(raw).trim();
  if (!s) {
    return undefined;
  }
  s = s.replace(/^['"`]+|['"`]+$/g, "").trim();
  if (!s) {
    return undefined;
  }
  if (!/^https?:\/\//i.test(s)) {
    s = `https://${s}`;
  }
  try {
    const u = new URL(s);
    if (!u.hostname) {
      return undefined;
    }
    return `${u.protocol}//${u.host}`.replace(/\/$/, "");
  } catch {
    return undefined;
  }
}

const rawDatabaseURL =
  process.env.FIREBASE_DATABASE_URL || process.env.DATABASE_URL;
const databaseURL = normalizeDatabaseUrl(rawDatabaseURL);
const databaseUrlPresentButInvalid = Boolean(rawDatabaseURL) && !databaseURL;

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || process.env.API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || process.env.AUTH_DOMAIN,
  databaseURL,
  projectId: process.env.FIREBASE_PROJECT_ID || process.env.PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.STORAGE_BUCKET,
  messagingSenderId:
    process.env.FIREBASE_MESSAGING_SENDER_ID || process.env.MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID || process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

function getFirebaseConfigStatus() {
  const missing = [];
  if (!firebaseConfig.databaseURL) {
    missing.push("databaseURL");
  }

  return {
    isConfigured: missing.length === 0,
    missing,
    projectIdConfigured: Boolean(firebaseConfig.projectId),
    databaseUrlPresentButInvalid,
  };
}

module.exports = {
  PORT,
  FIREBASE_WRITE_TIMEOUT_MS,
  firebaseConfig,
  getFirebaseConfigStatus,
  normalizeDatabaseUrl,
};
