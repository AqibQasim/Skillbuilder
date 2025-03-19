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
      recipientId: notificationData.recipientId,
      recipientType: notificationData.recipientType,
      senderId: notificationData.senderId,
      senderType: notificationData.senderType,
    });

    // Ensure senderId and senderType have default values if not provided
    const senderId = notificationData.senderId || 0;
    const senderType = notificationData.senderType || "system";

    const newNotification = appNotificationRepo.create({
      title: notificationData.title,
      message: notificationData.message,
      recipient_id: notificationData.recipientId,
      recipient_type: notificationData.recipientType,
      notification_type: notificationData.notificationType,
      sender_id: senderId,
      sender_type: senderType,
      is_read: false,
    });

    const savedNotification = await appNotificationRepo.save(newNotification);

    logger.info("Notification saved successfully", {
      notificationId: savedNotification.id,
      savedSenderId: savedNotification.sender_id,
      savedSenderType: savedNotification.sender_type,
    });

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

    // Build base where clause
    let whereClause = [];

    // Primary role condition - This will always apply based on the token
    const primaryRoleCondition = {
      recipient_id: userId,
      recipient_type: userType,
    };

    if (unreadOnly) {
      primaryRoleCondition.is_read = false;
    }

    whereClause.push(primaryRoleCondition);

    // Check if student is also an instructor
    if (userType === "student") {
      try {
        // Query the instructor table to see if this user is also an instructor
        const instructorRepo = dataSource.getRepository("Instructor");
        const instructor = await instructorRepo.findOne({
          where: { user_id: userId },
        });

        if (instructor) {
          logger.info("User is also an instructor", {
            userId,
            instructorId: instructor.id,
          });

          // Add instructor role condition
          const instructorRoleCondition = {
            recipient_id: instructor.id,
            recipient_type: "instructor",
          };

          if (unreadOnly) {
            instructorRoleCondition.is_read = false;
          }

          whereClause.push(instructorRoleCondition);
        }
      } catch (err) {
        logger.warn("Error checking for instructor role", {
          error: err.message,
          userId,
        });
        // Continue with just the student role if there's an error
      }
    }

    // Execute query with OR conditions if we have multiple roles
    const [notifications, total] = await appNotificationRepo.findAndCount({
      where: whereClause.length > 1 ? whereClause : whereClause[0],
      order: {
        created_at: "DESC",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

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
 * @returns {Promise<Object>} Success object with status
 */
const markAsRead = async (notificationId, userId, userType) => {
  try {
    logger.info("Marking notification as read", {
      notificationId,
      userId,
      userType,
    });

    // Find the notification with primary role
    let notification = await appNotificationRepo.findOne({
      where: {
        id: notificationId,
        recipient_id: userId,
        recipient_type: userType,
      },
    });

    // If not found and user is a student, check if they have instructor notifications
    if (!notification && userType === "student") {
      try {
        // Query the instructor table to see if this user is also an instructor
        const instructorRepo = dataSource.getRepository("Instructor");
        const instructor = await instructorRepo.findOne({
          where: { user_id: userId },
        });

        if (instructor) {
          logger.info(
            "User is also an instructor, checking instructor notifications",
            {
              userId,
              instructorId: instructor.id,
            }
          );

          // Try to find the notification for the instructor role
          notification = await appNotificationRepo.findOne({
            where: {
              id: notificationId,
              recipient_id: instructor.id,
              recipient_type: "instructor",
            },
          });
        }
      } catch (err) {
        logger.warn("Error checking for instructor role", {
          error: err.message,
          userId,
        });
      }
    }

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

    return { success: true };
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

    let totalAffected = 0;

    // Update notifications for primary role
    const primaryRoleResult = await appNotificationRepo.update(
      {
        recipient_id: userId,
        recipient_type: userType,
        is_read: false,
      },
      {
        is_read: true,
      }
    );

    totalAffected += primaryRoleResult.affected || 0;

    // Check if student is also an instructor
    if (userType === "student") {
      try {
        // Query the instructor table to see if this user is also an instructor
        const instructorRepo = dataSource.getRepository("Instructor");
        const instructor = await instructorRepo.findOne({
          where: { user_id: userId },
        });

        if (instructor) {
          logger.info(
            "User is also an instructor, marking those notifications as read",
            {
              userId,
              instructorId: instructor.id,
            }
          );

          // Update instructor notifications
          const instructorResult = await appNotificationRepo.update(
            {
              recipient_id: instructor.id,
              recipient_type: "instructor",
              is_read: false,
            },
            {
              is_read: true,
            }
          );

          totalAffected += instructorResult.affected || 0;
        }
      } catch (err) {
        logger.warn("Error checking for instructor role", {
          error: err.message,
          userId,
        });
        // Continue with just the student notifications if there's an error
      }
    }

    return totalAffected;
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
