const path = require("path");
const fs = require("fs");
const admin = require("firebase-admin");
const { firebaseConfig } = require("./env");

function normalizePrivateKey(key) {
  if (key == null || typeof key !== "string") {
    return key;
  }
  return key.replace(/\\n/g, "\n");
}

function loadServiceAccountFromJsonString() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw || !String(raw).trim()) {
    return null;
  }
  const parsed = JSON.parse(raw);
  if (parsed.private_key) {
    parsed.private_key = normalizePrivateKey(parsed.private_key);
  }
  return parsed;
}

function loadServiceAccountFromBase64() {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (!b64 || !String(b64).trim()) {
    return null;
  }
  const parsed = JSON.parse(
    Buffer.from(String(b64).trim(), "base64").toString("utf8")
  );
  if (parsed.private_key) {
    parsed.private_key = normalizePrivateKey(parsed.private_key);
  }
  return parsed;
}

/**
 * Build service account object from .env fields (same keys as the downloaded JSON).
 * Prefix: FIREBASE_SA_* maps to snake_case JSON fields.
 */
function loadServiceAccountFromEnvFields() {
  const projectId =
    process.env.FIREBASE_SA_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
  const privateKey = normalizePrivateKey(process.env.FIREBASE_SA_PRIVATE_KEY);
  const clientEmail = process.env.FIREBASE_SA_CLIENT_EMAIL;

  if (!projectId || !privateKey || !clientEmail) {
    return null;
  }

  return {
    type: process.env.FIREBASE_SA_TYPE || "service_account",
    project_id: projectId,
    private_key_id: process.env.FIREBASE_SA_PRIVATE_KEY_ID || "",
    private_key: privateKey,
    client_email: clientEmail,
    client_id: process.env.FIREBASE_SA_CLIENT_ID || "",
    auth_uri:
      process.env.FIREBASE_SA_AUTH_URI ||
      "https://accounts.google.com/o/oauth2/auth",
    token_uri:
      process.env.FIREBASE_SA_TOKEN_URI || "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url:
      process.env.FIREBASE_SA_AUTH_PROVIDER_X509_CERT_URL ||
      "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_SA_CLIENT_X509_CERT_URL || "",
    universe_domain: process.env.FIREBASE_SA_UNIVERSE_DOMAIN || "googleapis.com",
  };
}

function loadServiceAccountFromFile() {
  const custom = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (!custom || !String(custom).trim()) {
    return null;
  }
  const keyPath = path.isAbsolute(custom)
    ? custom
    : path.resolve(process.cwd(), custom);
  if (!fs.existsSync(keyPath)) {
    throw new Error(`FIREBASE_SERVICE_ACCOUNT_PATH file not found: ${keyPath}`);
  }
  const parsed = JSON.parse(fs.readFileSync(keyPath, "utf8"));
  if (parsed.private_key) {
    parsed.private_key = normalizePrivateKey(parsed.private_key);
  }
  return parsed;
}

function loadServiceAccount() {
  const sources = [
    loadServiceAccountFromJsonString,
    loadServiceAccountFromBase64,
    loadServiceAccountFromEnvFields,
    loadServiceAccountFromFile,
  ];

  for (const load of sources) {
    try {
      const account = load();
      if (account && account.private_key && account.client_email) {
        return account;
      }
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw new Error(
          `Invalid FIREBASE_SERVICE_ACCOUNT_JSON (or BASE64): ${e.message}`
        );
      }
      throw e;
    }
  }

  throw new Error(
    "Firebase Admin credentials missing. Set one of: " +
      "FIREBASE_SERVICE_ACCOUNT_JSON (full JSON string), " +
      "FIREBASE_SERVICE_ACCOUNT_BASE64, " +
      "FIREBASE_SA_PRIVATE_KEY + FIREBASE_SA_CLIENT_EMAIL + FIREBASE_SA_PROJECT_ID (or FIREBASE_PROJECT_ID), " +
      "or FIREBASE_SERVICE_ACCOUNT_PATH (path to JSON file)."
  );
}

const databaseURL = firebaseConfig.databaseURL;
if (!databaseURL) {
  throw new Error(
    "Set FIREBASE_DATABASE_URL (or DATABASE_URL) in .env to your Realtime Database URL."
  );
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(loadServiceAccount()),
    databaseURL,
  });
}

module.exports = admin.database();
