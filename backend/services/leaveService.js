const prisma = require("../config/prisma");

const applyLeave = async (employeeId, leaveData) => {
  const { leaveType, startDate, endDate, reason } = leaveData;

  // Validate dates
  if (new Date(startDate) > new Date(endDate)) {
    throw new Error("Start date cannot be after end date");
  }

  // Prevent past dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (new Date(startDate) < today) {
    throw new Error("Cannot apply leave for past dates");
  }

  const leave = await prisma.leaveRequest.create({
    data: {
      employeeId,
      leaveType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: "PENDING",
    },
  });

  return leave;
};

const getLeaveHistory = async (employeeId, filters) => {
  const { status, leaveType, search } = filters;

  const where = {
    employeeId,
  };

  if (status) {
    where.status = status;
  }

  if (leaveType) {
    where.leaveType = leaveType;
  }

  if (search) {
    where.reason = {
      contains: search,
    };
  }

  const leaves = await prisma.leaveRequest.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  return leaves;
};

const getLeaveById = async (employeeId, leaveId) => {
  const leave = await prisma.leaveRequest.findFirst({
    where: {
      id: Number(leaveId),
      employeeId,
    },
  });

  if (!leave) {
    throw new Error("Leave request not found");
  }

  return leave;
};

module.exports = {
  applyLeave,
  getLeaveHistory,
  getLeaveById,
};
