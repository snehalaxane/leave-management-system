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

module.exports = {
  getDashboard,
};