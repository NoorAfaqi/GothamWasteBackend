const db = require("../config/firebase");
const LOGS_REF = "Logs";

function formatTimestamp(date = new Date()) {
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const HH = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    // JavaScript supports milliseconds (3 digits); append 0 to match :ffff format.
    const ffff = `${String(date.getMilliseconds()).padStart(3, "0")}0`;
    return `${yyyy}/${MM}/${dd} ${HH}:${mm}:${ss}:${ffff}`;
}

const LogsModel = {
    // Get all logs
    async getAll() {
        const snapshot = await db.ref(LOGS_REF).once("value");
        return snapshot.val();
    },
    // Create a log
    async create(input) {
        const binName = input?.binName;
        const statusValue = input?.status ?? input?.binStatus;

        if (!binName || typeof statusValue === "undefined") {
            throw new Error("binName and status (or binStatus) are required");
        }

        const payload = {
            timestamp: formatTimestamp(),
            status: `${binName} is ${statusValue}`,
        };

        const newLogRef = db.ref(LOGS_REF).push();
        await newLogRef.set(payload);

        return {
            id: newLogRef.key,
            ...payload,
        };
    },
    // Delete a log
    async deleteOne(logId) {
        await db.ref(`${LOGS_REF}/${logId}`).remove();
    },
    // Patch a log
    async patch(logId, log) {
        await db.ref(`${LOGS_REF}/${logId}`).update(log);
    },
    // Get a log by id
    async getOne(logId) {
        const snapshot = await db.ref(`${LOGS_REF}/${logId}`).once("value");
        return snapshot.val();
    },
    // Get logs by bin name
    async getByBinName(binName) {
        const snapshot = await db.ref(`${LOGS_REF}`).orderByChild("binName").equalTo(binName).once("value");
        return snapshot.val();
    },
    // Get logs by date
    async getByDate(date) {
        const snapshot = await db.ref(`${LOGS_REF}`).orderByChild("date").equalTo(date).once("value");
        return snapshot.val();
    },
    // Get logs by time
    async getByTime(time) {
        const snapshot = await db.ref(`${LOGS_REF}`).orderByChild("time").equalTo(time).once("value");
        return snapshot.val();
    },
    // Get logs by user id
}

module.exports = LogsModel;