const notificationService = require("../services/appNotificationService");
const { logger } = require("../../logger");

/**
 * Send a notification
 * @param {Object} request - Fastify request object
 * @param {Object} reply - Fastify reply object
 */
const sendNotification = async (request, reply) => {
  try {
    const { title, message, recipientId, recipientType, notificationType } =
      request.body;

    // Add sender info from authenticated user
    const senderId = request.user?.id;
    const senderType = request.user?.role;

    const notification = await notificationService.sendNotification({
      title,
      message,
      recipientId,
      recipientType,
      notificationType: notificationType || "permission",
      senderId,
      senderType,
    });

    return reply.code(201).send({
      status: 201,
      data: notification,
    });
  } catch (error) {
    logger.error("Controller error sending notification", {
      error: error.message,
    });
    return reply.code(500).send({
      status: 500,
      message: "Failed to send notification",
    });
  }
};

/**
 * Get notifications for the authenticated user
 * @param {Object} request - Fastify request object
 * @param {Object} reply - Fastify reply object
 */
const getUserNotifications = async (request, reply) => {
  try {
    const userId = request.user.id;
    const userType = request.user.role;
    const { page = 1, limit = 10, unreadOnly = false } = request.query;

    const result = await notificationService.getUserNotifications(
      userId,
      userType,
      parseInt(page),
      parseInt(limit),
      unreadOnly === true || unreadOnly === "true"
    );

    return reply.code(200).send({
      status: 200,
      data: result,
    });
  } catch (error) {
    logger.error("Controller error getting user notifications", {
      error: error.message,
    });
    return reply.code(500).send({
      status: 500,
      message: "Failed to get notifications",
    });
  }
};

/**
 * Mark a notification as read
 * @param {Object} request - Fastify request object
 * @param {Object} reply - Fastify reply object
 */
const markNotificationAsRead = async (request, reply) => {
  try {
    const notificationId = parseInt(request.params.id);
    const userId = request.user.id;
    const userType = request.user.role;

    await notificationService.markNotificationAsRead(
      notificationId,
      userId,
      userType
    );

    return reply.code(200).send({
      status: 200,
      message: "Notification marked as read",
    });
  } catch (error) {
    logger.error("Controller error marking notification as read", {
      error: error.message,
    });

    // Determine status code based on error message
    const statusCode = error.message.includes("not found") ? 404 : 500;

    return reply.code(statusCode).send({
      status: statusCode,
      message:
        statusCode === 404
          ? "Notification not found or not authorized"
          : "Failed to mark notification as read",
    });
  }
};

/**
 * Mark all notifications as read for the authenticated user
 * @param {Object} request - Fastify request object
 * @param {Object} reply - Fastify reply object
 */
const markAllNotificationsAsRead = async (request, reply) => {
  try {
    const userId = request.user.id;
    const userType = request.user.role;

    const count = await notificationService.markAllNotificationsAsRead(
      userId,
      userType
    );

    return reply.code(200).send({
      status: 200,
      message: `${count} notifications marked as read`,
    });
  } catch (error) {
    logger.error("Controller error marking all notifications as read", {
      error: error.message,
    });
    return reply.code(500).send({
      status: 500,
      message: "Failed to mark all notifications as read",
    });
  }
};

// Only export the functions we need for our simplified implementation
module.exports = {
  sendNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
