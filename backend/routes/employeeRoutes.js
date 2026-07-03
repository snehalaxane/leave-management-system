const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const employeeController = require("../controllers/employeeController");

router.get(
  "/dashboard",
  authenticate,
  authorize("EMPLOYEE"),
  employeeController.getDashboard,
);

module.exports = router;
