const employeeService = require("../services/employeeService");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const getDashboard = async (req, res) => {
  try {
    const dashboard = await employeeService.getDashboard(req.user.id);

    return successResponse(
      res,
      "Dashboard fetched successfully",
      dashboard
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  getDashboard,
};