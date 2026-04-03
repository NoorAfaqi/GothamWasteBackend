const LogsModel = require("../models/logsModel");

const LogsController = {
  // GET /api/logs
  async getAllLogs(req, res) {
    try {
      const logs = await LogsModel.getAll();
      if (!logs) return res.status(404).json({ message: "No logs found" });
      res.json({ success: true, data: logs });
    } catch (err) {
      res.status(500).json({ success: false, message: `Error getting all logs: ${err.message}` });
    }
  },

  // POST /api/logs
  async createLog(req, res) {
    try {
      const log = await LogsModel.create(req.body);
      res.json({ success: true, message: "Log created", data: { logId: log.id, log } });
    } catch (err) {
      res.status(500).json({ success: false, message: `Error creating log: ${err.message}` });
    }
  },

  // DELETE /api/logs/:logId
  async deleteLog(req, res) {
    try {
      const { logId } = req.params;
      await LogsModel.deleteOne(logId);
      res.json({ success: true, message: "Log deleted", data: { logId } });
    } catch (err) {
      res.status(500).json({ success: false, message: `Error deleting log: ${err.message}` });
    }
  },
  // PATCH /api/logs/:logId
  async patchLog(req, res) {
    try {
      const { logId } = req.params;
      await LogsModel.patch(logId, req.body);
      res.json({ success: true, message: "Log patched", data: { logId } });
    } catch (err) {
      res.status(500).json({ success: false, message: `Error patching log: ${err.message}` });
    }
  },
};

module.exports = LogsController;