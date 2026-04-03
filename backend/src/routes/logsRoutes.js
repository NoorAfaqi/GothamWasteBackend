const express = require("express");
const logsController = require("../controllers/logsController");

const router = express.Router();

router.get("/", logsController.getAllLogs);
router.post("/", logsController.createLog);   // body: { "timestamp": <timestamp>, "binName": <binName>, "status": <status> }
router.delete("/:logId", logsController.deleteLog);
router.patch("/:logId", logsController.patchLog);   // body: { "timestamp": <timestamp>, "binName": <binName>, "status": <status> }

module.exports = router;