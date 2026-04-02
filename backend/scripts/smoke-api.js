/**
 * API smoke test (no separate server process). Loads .env via env module.
 */
require("../src/config/env");

const request = require("supertest");
const app = require("../src/app");
const { firebaseConfig } = require("../src/config/env");

const DEADLINE_MS = 25000;

async function run() {
  if (!firebaseConfig.databaseURL) {
    console.warn(
      "Warning: FIREBASE_DATABASE_URL / DATABASE_URL not set. Bin tests may fail."
    );
  }

  const agent = request(app);

  const health = await agent.get("/health").timeout(DEADLINE_MS);
  if (health.status !== 200) {
    console.error("GET /health failed:", health.status, health.text);
    process.exit(1);
  }
  console.log("GET /health", health.status, JSON.stringify(health.body));

  const putRes = await agent
    .put("/bin/Bin1")
    .set("Content-Type", "application/json")
    .send({ value: { binStatus: "smoke-test" } })
    .timeout(DEADLINE_MS);

  if (putRes.status !== 200) {
    console.error("PUT /bin/Bin1 failed:", putRes.status, JSON.stringify(putRes.body));
    process.exit(1);
  }
  console.log("PUT /bin/Bin1", putRes.status, JSON.stringify(putRes.body));

  const getRes = await agent.get("/bin/Bin1").timeout(DEADLINE_MS);
  if (getRes.status !== 200) {
    console.error("GET /bin/Bin1 failed:", getRes.status, getRes.text);
    process.exit(1);
  }
  console.log("GET /bin/Bin1", getRes.status, JSON.stringify(getRes.body));

  console.log("All API smoke tests passed.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
