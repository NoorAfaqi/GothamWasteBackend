const express = require("express");
const binRoutes = require("./binRoutes");
const healthRoutes = require("./healthRoutes");
const logsRoutes = require("./logsRoutes");
const router = express.Router();

router.use("/health", healthRoutes);
router.use("/bin", binRoutes);
router.use("/logs", logsRoutes);
module.exports = router;
