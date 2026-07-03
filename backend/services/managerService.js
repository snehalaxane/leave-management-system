const prisma = require("../config/prisma");

const getDashboard = async () => {
  const totalEmployees = await prisma.employee.count({
    where: {
      role: "EMPLOYEE",
    },
  });

  const pendingApprovals = await prisma.leaveRequest.count({
    where: {
      status: "PENDING",
    },
  });

  const approvedRequests = await prisma.leaveRequest.count({
    where: {
      status: "APPROVED",
    },
  });

  const rejectedRequests = await prisma.leaveRequest.count({
    where: {
      status: "REJECTED",
    },
  });

  const recentActivities = await prisma.leaveRequest.findMany({
    include: {
      employee: {
        select: {
          employeeCode: true,
          name: true,
          department: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  return {
    totalEmployees,
    pendingApprovals,
    approvedRequests,
    rejectedRequests,
    recentActivities,
  };
};

module.exports = {
  getDashboard,
};