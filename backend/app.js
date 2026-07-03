const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Database Connection
require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Leave Management API Running"
    });
});

module.exports = app;