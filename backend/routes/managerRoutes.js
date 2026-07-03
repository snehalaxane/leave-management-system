const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const managerController = require("../controllers/managerController");

router.get(
  "/dashboard",
  authenticate,
  authorize("MANAGER"),
  managerController.getDashboard
);

module.exports = router;