const managerService = require("../services/managerService");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const getDashboard = async (req, res) => {
  try {
    const dashboard = await managerService.getDashboard();

    return successResponse(
      res,
      "Manager dashboard fetched successfully",
      dashboard,
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getPendingLeaves = async (req, res) => {
  try {
    const leaves = await managerService.getPendingLeaves();

    return successResponse(
      res,
      "Pending leave requests fetched successfully",
      leaves,
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const approveLeave = async (req, res) => {
  try {
    const leave = await managerService.approveLeave(req.params.id);

    return successResponse(res, "Leave approved successfully", leave);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

module.exports = {
  getDashboard,
  getPendingLeaves,
  approveLeave,
};
