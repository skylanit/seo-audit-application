const express = require("express");
const cors = require("cors");

const auditRoutes = require("./routes/auditRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/audit", auditRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "SEO Audit API Running"
    });
});

module.exports = app;