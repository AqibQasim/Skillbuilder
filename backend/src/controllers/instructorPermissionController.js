const instructorPermissionService = require("../services/instructorPermissionService");
const {
  createPermissionSchema,
  updatePermissionSchema,
  historyRequestSchema,
} = require("../Schema/instructorPermissionSchema");

// Schema for instructor history requests
exports.requestPermission = async (req, reply) => {
  try {
    const { error, value } = createPermissionSchema.validate(req.body);
    if (error) {
      return reply.code(400).send({
        status: 400,
        message: error.details[0].message,
      });
    }

    const { instructor_id, type } = value;
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
    const { error, value } = historyRequestSchema.validate(req.query);
    if (error) {
      return reply.code(400).send({
        status: 400,
        message: error.details[0].message,
      });
    }

    const { instructor_id, type } = value;
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
    const { error, value } = updatePermissionSchema.validate(req.params);
    if (error) {
      return reply.code(400).send({
        status: 400,
        message: error.details[0].message,
      });
    }

    const { id } = value;
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
    const { error, value } = updatePermissionSchema.validate(req.params);
    if (error) {
      return reply.code(400).send({
        status: 400,
        message: error.details[0].message,
      });
    }

    const { id } = value;
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
