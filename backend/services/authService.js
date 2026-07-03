const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");
const { generateToken } = require("../utils/jwt");

const login = async ({ email, password }) => {
  const employee = await prisma.employee.findUnique({
    where: {
      email,
    },
  });

  if (!employee) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, employee.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(employee);

  return {
    token,
    user: {
      id: employee.id,
      employeeCode: employee.employeeCode,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      department: employee.department,
    },
  };
};

module.exports = {
  login,
};
