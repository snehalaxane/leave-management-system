const prisma = require("../config/prisma");

const getDashboard = async (employeeId) => {
  // Total Leave Requests
  const totalLeaves = await prisma.leaveRequest.count({
    where: {
      employeeId,
    },
  });

  // Approved Leaves
  const approvedLeaves = await prisma.leaveRequest.count({
    where: {
      employeeId,
      status: "APPROVED",
    },
  });

  // Pending Leaves
  const pendingLeaves = await prisma.leaveRequest.count({
    where: {
      employeeId,
      status: "PENDING",
    },
  });

  // Rejected Leaves
  const rejectedLeaves = await prisma.leaveRequest.count({
    where: {
      employeeId,
      status: "REJECTED",
    },
  });

  // Recent Leave Requests
  const recentLeaves = await prisma.leaveRequest.findMany({
    where: {
      employeeId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  return {
    totalLeaves,
    approvedLeaves,
    pendingLeaves,
    rejectedLeaves,
    recentLeaves,
  };
};

const getEmployees = async (searchQuery) => {
  let whereClause = {
    role: "EMPLOYEE",
  };

  if (searchQuery) {
    whereClause = {
      ...whereClause,
      OR: [
        { name: { contains: searchQuery } },
        { email: { contains: searchQuery } },
        { employeeCode: { contains: searchQuery } },
      ],
    };
  }

  const employees = await prisma.employee.findMany({
    where: whereClause,
    select: {
      id: true,
      employeeCode: true,
      name: true,
      email: true,
      department: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return employees;
};

const getEmployeeById = async (employeeId) => {
  const employee = await prisma.employee.findUnique({
    where: {
      id: Number(employeeId),
    },
    select: {
      id: true,
      employeeCode: true,
      name: true,
      email: true,
      department: true,
      role: true,
      createdAt: true,
      leaveRequests: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  return employee;
};

module.exports = {
  getDashboard,
  getEmployees,
  getEmployeeById,
};