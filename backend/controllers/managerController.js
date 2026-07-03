const managerService = require("../services/managerService");
const {
  successResponse,
  errorResponse,
} = require("../utils/apiResponse");

const getDashboard = async (req, res) => {
  try {
    const dashboard = await managerService.getDashboard();

    return successResponse(
      res,
      "Manager dashboard fetched successfully",
      dashboard
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  getDashboard,
};