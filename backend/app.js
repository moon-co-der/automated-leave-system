const express = require("express");
const cors = require("cors");

const leaveRoutes = require("./routes/leaveRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
    res.send("Leave Management API Running");
});

// API Routes
app.use("/api/leaves", leaveRoutes);
app.use("/api/employees", employeeRoutes);

module.exports = app;