const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const employeeController = require("../controllers/employeeController");

router.get("/dashboard", authenticate, employeeController.getDashboard);

module.exports = router;
