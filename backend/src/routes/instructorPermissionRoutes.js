const permissionController = require("../controllers/instructorPermissionController");
const adminAuth = require("../middleware/adminAuth");

async function instructorPermissionRoutes(fastify, options) {
  // Regular instructor route - no admin auth needed
  fastify.post(
    "/instructor-permissions/request",
    permissionController.requestPermission
  );

  // Instructor history route - no admin auth needed
  fastify.get(
    "/instructor-permissions/history",
    permissionController.getInstructorRequestHistory
  );

  // Admin only routes
  fastify.get(
    "/instructor-permissions/pending",
    {
      preHandler: [adminAuth],
    },
    permissionController.getPendingRequests
  );

  fastify.get(
    "/instructor-permissions/stats",
    {
      preHandler: [adminAuth],
    },
    permissionController.getRequestStats
  );

  fastify.post(
    "/instructor-permissions/approve/:id",
    {
      preHandler: [adminAuth],
    },
    permissionController.approveRequest
  );

  fastify.post(
    "/instructor-permissions/reject/:id",
    {
      preHandler: [adminAuth],
    },
    permissionController.rejectRequest
  );
}

module.exports = instructorPermissionRoutes;
