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

const getEmployees = async (req, res) => {
  try {
    const { search } = req.query;
    const employees = await employeeService.getEmployees(search);

    return successResponse(
      res,
      "Employees fetched successfully",
      employees
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await employeeService.getEmployeeById(id);

    return successResponse(
      res,
      "Employee details fetched successfully",
      employee
    );
  } catch (error) {
    if (error.message === "Employee not found") {
      return errorResponse(res, error.message, 404);
    }
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  getDashboard,
  getEmployees,
  getEmployeeById,
};