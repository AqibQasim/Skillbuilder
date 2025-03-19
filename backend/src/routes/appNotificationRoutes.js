const appNotificationController = require("../controllers/appNotificationController");
const verifyToken = require("../middleware/verifyToken");
const adminAuth = require("../middleware/adminAuth");

const {
  createNotificationSchema,
  getNotificationsSchema,
  markAsReadSchema,
  markAllAsReadSchema,
} = require("../Schema/appNotificationSchema");

/**
 * App notification routes
 * @param {Object} fastify - Fastify instance
 * @param {Object} options - Options
 */
const appNotificationRoutes = async (fastify, options) => {
  // Send notification - Admin only
  fastify.post(
    "/notifications",
    {
      preHandler: [adminAuth],
      schema: createNotificationSchema.schema,
    },
    appNotificationController.sendNotification
  );

  // Get notifications for authenticated user
  fastify.get(
    "/notifications",
    {
      preHandler: [verifyToken],
      schema: getNotificationsSchema.schema,
    },
    appNotificationController.getUserNotifications
  );

  // Mark notification as read
  fastify.patch(
    "/notifications/:id/read",
    {
      preHandler: [verifyToken],
      schema: markAsReadSchema.schema,
    },
    appNotificationController.markNotificationAsRead
  );

  // Mark all notifications as read
  fastify.patch(
    "/notifications/read-all",
    {
      preHandler: [verifyToken],
      schema: markAllAsReadSchema.schema,
    },
    appNotificationController.markAllNotificationsAsRead
  );
};

module.exports = { appNotificationRoutes };
