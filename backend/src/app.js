require("dotenv").config();
const express = require("express");
const binRoutes = require("./routes/binRoutes");

const app = express();
app.use(express.json());

app.use("/api/bins", binRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;