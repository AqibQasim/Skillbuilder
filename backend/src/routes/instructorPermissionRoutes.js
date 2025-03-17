const permissionController = require("../controllers/instructorPermissionController");
const adminAuth = require("../middleware/adminAuth");
const {
  createPermissionSchema,
  updatePermissionSchema,
  historyRequestSchema,
  pendingRequestsSchema,
  requestStatsSchema,
} = require("../Schema/instructorPermissionSchema");

async function instructorPermissionRoutes(fastify, options) {
  // Add custom error handler for validation errors
  fastify.setErrorHandler(function (error, request, reply) {
    if (error.validation) {
      // This is a validation error from the schema validation
      let message = error.message;

      // Log the original error message for debugging
      console.log("Validation error message:", message);

      // Enhance error messages for common validation errors
      if (
        message.includes("must be equal to one of") ||
        message.includes("allowed values")
      ) {
        if (message.includes("/type")) {
          message =
            "Type must be one of: courses, live_sessions, career_counselling";
        }
      } else if (message.includes("must be number")) {
        if (message.includes("instructor_id")) {
          message = "Instructor ID must be a number";
        } else if (message.includes("/id")) {
          message = "Permission ID must be a number";
        }
      } else if (message.includes("required property")) {
        if (message.includes("'instructor_id'")) {
          message = "Instructor ID is required";
        } else if (message.includes("'type'")) {
          message = "Type is required";
        } else if (message.includes("'id'")) {
          message = "Permission ID is required";
        }
      }

      return reply.code(400).send({
        status: 400,
        message: message,
      });
    }

    // For other errors, pass to the default error handler
    reply.send(error);
  });

  // Regular instructor route - no admin auth needed
  fastify.post(
    "/instructor-permissions/request",
    {
      schema: createPermissionSchema,
    },
    permissionController.requestPermission
  );

  // Instructor history route - no admin auth needed
  fastify.get(
    "/instructor-permissions/history",
    {
      schema: historyRequestSchema,
    },
    permissionController.getInstructorRequestHistory
  );

  // Admin only routes
  fastify.get(
    "/instructor-permissions/pending",
    {
      preHandler: [adminAuth],
      schema: pendingRequestsSchema,
    },
    permissionController.getPendingRequests
  );

  fastify.get(
    "/instructor-permissions/stats",
    {
      preHandler: [adminAuth],
      schema: requestStatsSchema,
    },
    permissionController.getRequestStats
  );

  fastify.post(
    "/instructor-permissions/approve/:id",
    {
      preHandler: [adminAuth],
      schema: updatePermissionSchema,
    },
    permissionController.approveRequest
  );

  fastify.post(
    "/instructor-permissions/reject/:id",
    {
      preHandler: [adminAuth],
      schema: updatePermissionSchema,
    },
    permissionController.rejectRequest
  );
}

module.exports = instructorPermissionRoutes;
