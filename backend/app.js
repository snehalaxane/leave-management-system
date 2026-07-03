const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Database Connection
require("./config/prisma");

const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Leave Management API Running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);

module.exports = app;