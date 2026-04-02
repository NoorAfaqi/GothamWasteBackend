const BinModel = require("../models/binModel");

const BinController = {
  // GET /api/bins
  async getAllBins(req, res) {
    try {
      const bins = await BinModel.getAll();
      if (!bins) return res.status(404).json({ message: "No bins found" });
      res.json({ success: true, data: bins });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // GET /api/bins/:binName
  async getBin(req, res) {
    try {
      const { binName } = req.params;
      const value = await BinModel.getOne(binName);
      if (value === null) return res.status(404).json({ message: `${binName} not found` });
      res.json({ success: true, data: { [binName]: value } });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // PUT /api/bins/:binName   body: { "value": <newValue> }
  async updateBin(req, res) {
    try {
      const { binName } = req.params;
      const { value } = req.body;

      if (value === undefined) {
        return res.status(400).json({ success: false, message: '"value" is required in request body' });
      }

      const updated = await BinModel.updateValue(binName, value);
      res.json({ success: true, message: `${binName} updated`, data: updated });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // PATCH /api/bins   body: { "Bin1": val1, "Bin2": val2, ... }
  async updateManyBins(req, res) {
    try {
      const updates = req.body;

      if (!updates || Object.keys(updates).length === 0) {
        return res.status(400).json({ success: false, message: "Request body must contain at least one bin to update" });
      }

      const updated = await BinModel.updateMany(updates);
      res.json({ success: true, message: "Bins updated", data: updated });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};

module.exports = BinController;
