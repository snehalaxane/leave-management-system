const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const managerController = require("../controllers/managerController");

router.get(
  "/dashboard",
  authenticate,
  authorize("MANAGER"),
  managerController.getDashboard,
);

router.get(
  "/pending-leaves",
  authenticate,
  authorize("MANAGER"),
  managerController.getPendingLeaves,
);

router.put(
  "/leaves/:id/approve",
  authenticate,
  authorize("MANAGER"),
  managerController.approveLeave,
);

router.put(
  "/leaves/:id/reject",
  authenticate,
  authorize("MANAGER"),
  managerController.rejectLeave,
);

module.exports = router;
