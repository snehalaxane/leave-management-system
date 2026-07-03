const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { loginValidator } = require("../validators/authValidator");

router.post("/login", loginValidator, authController.login);
router.post("/logout", authController.logout);

module.exports = router;
