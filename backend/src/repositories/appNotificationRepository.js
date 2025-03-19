const dataSource = require("../../Infrastructure/postgres");
const { logger } = require("../../logger");

const appNotificationRepo = dataSource.getRepository("AppNotification");

/**
 * Create a new app notification in the database
 * @param {Object} notificationData - The notification data
 * @returns {Promise<Object>} The created notification
 */
const createNotification = async (notificationData) => {
  try {
    logger.info("Creating new notification", {
      recipient: notificationData.recipient_id,
    });

    const newNotification = appNotificationRepo.create({
      title: notificationData.title,
      message: notificationData.message,
      recipient_id: notificationData.recipientId,
      recipient_type: notificationData.recipientType,
      notification_type: notificationData.notificationType,
      sender_id: notificationData.senderId,
      sender_type: notificationData.senderType,
      is_read: false,
    });

    const savedNotification = await appNotificationRepo.save(newNotification);

    // Transform the saved notification to camelCase for consistent API response
    return {
      id: savedNotification.id,
      title: savedNotification.title,
      message: savedNotification.message,
      recipientId: savedNotification.recipient_id,
      recipientType: savedNotification.recipient_type,
      notificationType: savedNotification.notification_type,
      senderId: savedNotification.sender_id,
      senderType: savedNotification.sender_type,
      isRead: savedNotification.is_read,
      createdAt: savedNotification.created_at,
    };
  } catch (error) {
    logger.error("Error creating notification", { error: error.message });
    throw error;
  }
};

/**
 * Get notifications for a specific user
 * @param {number} userId - The user's ID
 * @param {string} userType - The user's type (admin, instructor, student)
 * @param {number} page - The page number
 * @param {number} limit - The number of results per page
 * @param {boolean} unreadOnly - Whether to return only unread notifications
 * @returns {Promise<Object>} The notifications and pagination info
 */
const getNotifications = async (
  userId,
  userType,
  page = 1,
  limit = 10,
  unreadOnly = false
) => {
  try {
    logger.info("Getting notifications", {
      userId,
      userType,
      page,
      limit,
      unreadOnly,
    });

    // Build query options
    const queryOptions = {
      where: {
        recipient_id: userId,
        recipient_type: userType,
      },
      order: {
        created_at: "DESC",
      },
      skip: (page - 1) * limit,
      take: limit,
    };

    // Add unread filter if specified
    if (unreadOnly) {
      queryOptions.where.is_read = false;
    }

    // Execute query
    const [notifications, total] = await appNotificationRepo.findAndCount(
      queryOptions
    );

    // Transform the notifications to camelCase
    const transformedNotifications = notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      recipientId: notification.recipient_id,
      recipientType: notification.recipient_type,
      notificationType: notification.notification_type,
      senderId: notification.sender_id,
      senderType: notification.sender_type,
      isRead: notification.is_read,
      createdAt: notification.created_at,
    }));

    // Return with pagination info
    return {
      notifications: transformedNotifications,
      pagination: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        limit,
      },
    };
  } catch (error) {
    logger.error("Error getting notifications", { error: error.message });
    throw error;
  }
};

/**
 * Mark a notification as read
 * @param {number} notificationId - The notification ID
 * @param {number} userId - The user's ID
 * @param {string} userType - The user's type
 * @returns {Promise<boolean>} Success status
 */
const markAsRead = async (notificationId, userId, userType) => {
  try {
    logger.info("Marking notification as read", {
      notificationId,
      userId,
      userType,
    });

    // Find the notification and verify ownership
    const notification = await appNotificationRepo.findOne({
      where: {
        id: notificationId,
        recipient_id: userId,
        recipient_type: userType,
      },
    });

    if (!notification) {
      logger.warn("Notification not found or not authorized", {
        notificationId,
        userId,
        userType,
      });
      throw new Error("Notification not found or not authorized");
    }

    // Update the notification
    notification.is_read = true;
    await appNotificationRepo.save(notification);

    return true;
  } catch (error) {
    logger.error("Error marking notification as read", {
      error: error.message,
    });
    throw error;
  }
};

/**
 * Mark all notifications as read for a user
 * @param {number} userId - The user's ID
 * @param {string} userType - The user's type
 * @returns {Promise<number>} Number of notifications marked as read
 */
const markAllAsRead = async (userId, userType) => {
  try {
    logger.info("Marking all notifications as read", { userId, userType });

    // Update all unread notifications for the user
    const result = await appNotificationRepo.update(
      {
        recipient_id: userId,
        recipient_type: userType,
        is_read: false,
      },
      {
        is_read: true,
      }
    );

    return result.affected || 0;
  } catch (error) {
    logger.error("Error marking all notifications as read", {
      error: error.message,
    });
    throw error;
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
};
