const { validationResult } = require("express-validator");
const authService = require("../services/authService");
const {
  errorResponse,
  successResponse,
} = require("../utils/apiResponse");

const login = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 400);
    }

    const result = await authService.login(req.body);

    return successResponse(res, "Login successful", result);
  } catch (error) {
    return errorResponse(res, error.message, 401);
  }
};

module.exports = {
  login,
};