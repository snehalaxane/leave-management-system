const { validationResult } = require("express-validator");
const leaveService = require("../services/leaveService");
const {
  successResponse,
  errorResponse,
} = require("../utils/apiResponse");

const applyLeave = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 400);
    }

    const leave = await leaveService.applyLeave(
      req.user.id,
      req.body
    );

    return successResponse(
      res,
      "Leave request submitted successfully",
      leave,
      201
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

module.exports = {
  applyLeave,
};