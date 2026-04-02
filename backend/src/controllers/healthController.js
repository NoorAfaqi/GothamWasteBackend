const {
  getFirebaseConfigStatus,
  FIREBASE_WRITE_TIMEOUT_MS,
  firebaseConfig,
} = require("../config/env");

function getHealth(req, res) {
  const firebase = getFirebaseConfigStatus();
  const mockFirebase = process.env.MOCK_FIREBASE === "true";
  const authTokenConfigured = Boolean(
    process.env.FIREBASE_RTDB_AUTH_TOKEN ||
      process.env.FIREBASE_DATABASE_SECRET
  );
  const readyForBinWrites = mockFirebase || firebase.isConfigured;

  return res.status(200).json({
    status: readyForBinWrites ? "ok" : "degraded",
    service: "gotham-waste-backend",
    firebase,
    rtdb: {
      mode: "firebase-admin",
      databaseUrlConfigured: Boolean(firebaseConfig.databaseURL),
      databaseUrlPresentButInvalid: firebase.databaseUrlPresentButInvalid,
      authQueryConfigured: authTokenConfigured,
    },
    readyForBinWrites,
    mockFirebase,
    firebaseWriteTimeoutMs: FIREBASE_WRITE_TIMEOUT_MS,
    timestamp: new Date().toISOString(),
  });
}

module.exports = {
  getHealth,
};
