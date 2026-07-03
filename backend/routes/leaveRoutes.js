const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const leaveController = require("../controllers/leaveController");
const {
  applyLeaveValidator,
} = require("../validators/leaveValidator");

router.post(
  "/",
  authenticate,
  authorize("EMPLOYEE"),
  applyLeaveValidator,
  leaveController.applyLeave
);

module.exports = router;