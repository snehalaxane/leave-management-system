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

const getPendingLeaves = async () => {
  const pendingLeaves = await prisma.leaveRequest.findMany({
    where: {
      status: "PENDING",
    },
    include: {
      employee: {
        select: {
          id: true,
          employeeCode: true,
          name: true,
          email: true,
          department: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return pendingLeaves;
};

const approveLeave = async (leaveId) => {
  const leave = await prisma.leaveRequest.findUnique({
    where: {
      id: Number(leaveId),
    },
  });

  if (!leave) {
    throw new Error("Leave request not found");
  }

  if (leave.status !== "PENDING") {
    throw new Error("Leave request has already been processed");
  }

  const updatedLeave = await prisma.leaveRequest.update({
    where: {
      id: Number(leaveId),
    },
    data: {
      status: "APPROVED",
      managerComments: "Approved",
    },
  });

  return updatedLeave;
};

module.exports = {
  getDashboard,
  getPendingLeaves,
  approveLeave,
};
