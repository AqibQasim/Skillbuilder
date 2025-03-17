const instructorPermissionService = require("../services/instructorPermissionService");

// Schema for instructor history requests
exports.requestPermission = async (req, reply) => {
  try {
    const { instructor_id, type } = req.body;
    const result = await instructorPermissionService.requestPermission(
      instructor_id,
      type
    );
    reply.send({
      status: 200,
      data: result,
    });
  } catch (error) {
    console.error("Error requesting permission:", error);

    const statusCode = error.statusCode || 500;
    reply.code(statusCode).send({
      status: statusCode,
      message: error.message || "Internal server error",
    });
  }
};

exports.getPendingRequests = async (req, reply) => {
  try {
    const result = await instructorPermissionService.getPendingRequests();
    reply.send({
      status: 200,
      data: result,
    });
  } catch (error) {
    console.error("Error getting pending requests:", error);

    const statusCode = error.statusCode || 500;
    reply.code(statusCode).send({
      status: statusCode,
      message: error.message || "Internal server error",
    });
  }
};

exports.getRequestStats = async (req, reply) => {
  try {
    const result = await instructorPermissionService.getRequestStats();
    reply.send({
      status: 200,
      data: result,
    });
  } catch (error) {
    console.error("Error getting request stats:", error);

    const statusCode = error.statusCode || 500;
    reply.code(statusCode).send({
      status: statusCode,
      message: error.message || "Internal server error",
    });
  }
};

exports.getInstructorRequestHistory = async (req, reply) => {
  try {
    const { instructor_id, type } = req.query;
    const result =
      await instructorPermissionService.getInstructorRequestHistory(
        instructor_id,
        type
      );
    reply.send({
      status: 200,
      data: result,
    });
  } catch (error) {
    console.error("Error getting instructor request history:", error);

    const statusCode = error.statusCode || 500;
    reply.code(statusCode).send({
      status: statusCode,
      message: error.message || "Internal server error",
    });
  }
};

exports.approveRequest = async (req, reply) => {
  try {
    const { id } = req.params;
    const result = await instructorPermissionService.approveRequest(id);
    reply.send({
      status: 200,
      data: result,
    });
  } catch (error) {
    console.error("Error approving request:", error);

    const statusCode = error.statusCode || 500;
    reply.code(statusCode).send({
      status: statusCode,
      message: error.message || "Internal server error",
    });
  }
};

exports.rejectRequest = async (req, reply) => {
  try {
    const { id } = req.params;
    const result = await instructorPermissionService.rejectRequest(id);
    reply.send({
      status: 200,
      data: result,
    });
  } catch (error) {
    console.error("Error rejecting request:", error);

    const statusCode = error.statusCode || 500;
    reply.code(statusCode).send({
      status: statusCode,
      message: error.message || "Internal server error",
    });
  }
};
