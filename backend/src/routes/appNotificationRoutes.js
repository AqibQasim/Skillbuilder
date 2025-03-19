const appNotificationController = require("../controllers/appNotificationController");
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
  // Send notification
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
      // login ho
      // user ie instructor ho
      //   preHandler: [adminAuth],
      schema: getNotificationsSchema.schema,
    },
    appNotificationController.getUserNotifications
  );

  // Mark notification as read
  fastify.patch(
    "/notifications/:id/read",
    {
      preHandler: [adminAuth],
      schema: markAsReadSchema.schema,
    },
    appNotificationController.markNotificationAsRead
  );

  // Mark all notifications as read
  fastify.patch(
    "/notifications/read-all",
    {
      preHandler: [adminAuth],
      schema: markAllAsReadSchema.schema,
    },
    appNotificationController.markAllNotificationsAsRead
  );
};

module.exports = { appNotificationRoutes };
