const db = require("../config/firebase");

const BINS_REF = "Bins";

const BinModel = {
  // Get all bins
  async getAll() {
    const snapshot = await db.ref(BINS_REF).once("value");
    return snapshot.val();
  },

  // Get a single bin by name (e.g. "Bin1")
  async getOne(binName) {
    const snapshot = await db.ref(`${BINS_REF}/${binName}`).once("value");
    return snapshot.val();
  },

  // Update a bin's value
  async updateValue(binName, value) {
    await db.ref(`${BINS_REF}/${binName}`).set(value);
    return { [binName]: value };
  },

  // Update multiple bins at once
  async updateMany(updates) {
    const payload = {};
    for (const [binName, value] of Object.entries(updates)) {
      payload[`${BINS_REF}/${binName}`] = value;
    }
    await db.ref().update(payload);
    return updates;
  },
};

module.exports = BinModel;
