const { validationResult } = require("express-validator");
const leaveService = require("../services/leaveService");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const applyLeave = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 400);
    }

    const leave = await leaveService.applyLeave(req.user.id, req.body);

    return successResponse(
      res,
      "Leave request submitted successfully",
      leave,
      201,
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getLeaveHistory = async (req, res) => {
  try {
    const leaves = await leaveService.getLeaveHistory(req.user.id, req.query);

    return successResponse(res, "Leave history fetched successfully", leaves);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getLeaveById = async (req, res) => {
  try {
    const leave = await leaveService.getLeaveById(req.user.id, req.params.id);

    return successResponse(res, "Leave details fetched successfully", leave);
  } catch (error) {
    return errorResponse(res, error.message, 404);
  }
};

module.exports = {
  applyLeave,
  getLeaveHistory,
  getLeaveById,
};
