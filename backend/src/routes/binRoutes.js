const express = require("express");
const router = express.Router();
const BinController = require("../controllers/binController");

router.get("/", BinController.getAllBins);           // GET    all bins
router.get("/:binName", BinController.getBin);       // GET    single bin
router.put("/:binName", BinController.updateBin);    // PUT    update one bin
router.patch("/", BinController.updateManyBins);     // PATCH  update multiple bins

module.exports = router;
