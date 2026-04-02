const express = require("express");
const binRoutes = require("./binRoutes");
const healthRoutes = require("./healthRoutes");
const router = express.Router();

router.use("/health", healthRoutes);
router.use("/bin", binRoutes);
module.exports = router;
