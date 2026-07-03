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

router.get(
  "/",
  authenticate,
  employeeController.getEmployees,
);

router.get(
  "/:id",
  authenticate,
  employeeController.getEmployeeById,
);

module.exports = router;
