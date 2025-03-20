const { logger } = require("../../logger");
const notificationRepo = require("../repositories/appNotificationRepository");
const instructorRepo = require("../repositories/instructorRepository");

/**
 * Send a notification
 * @param {Object} notificationData - The notification data
 * @returns {Promise<Object>} The created notification
 */
const sendNotification = async (notificationData) => {
  try {
    // Ensure sender info exists (critical fix)
    if (!notificationData.senderId || notificationData.senderId === 0) {
      logger.warn("No sender ID provided, using admin default", {
        originalSender: notificationData.senderId,
      });
      notificationData.senderId = 1; // Default to first admin
    }

    if (!notificationData.senderType || notificationData.senderType === "") {
      logger.warn("No sender type provided, using admin default", {
        originalType: notificationData.senderType,
      });
      notificationData.senderType = "admin"; // Default sender type
    }

    // Essential log - simplified
    logger.info("Sending notification", {
      to: `${notificationData.recipientType}:${notificationData.recipientId}`,
      type: notificationData.notificationType,
    });

    const notification = await notificationRepo.createNotification(
      notificationData
    );

    return notification;
  } catch (error) {
    logger.error("Error sending notification", { error: error.message });
    throw error;
  }
};

/**
 * Send a permission request notification to admin
 * @param {Object} data - Permission request data
 * @param {number} data.instructorId - Instructor ID
 * @param {string} data.permissionType - Type of permission requested
 * @returns {Promise<Object>} The created notification
 */
const sendPermissionRequestNotification = async (data) => {
  try {
    const dataSource = require("../../Infrastructure/postgres");
    let instructorName = "Unknown";

    // Get instructor with user relation loaded
    const instructor = await dataSource.getRepository("Instructor").findOne({
      where: { id: data.instructorId },
      relations: ["user"],
    });

    if (!instructor) {
      logger.warn(`Instructor not found for ID: ${data.instructorId}`);
      return sendNotification({
        title: "New Permission Request",
        message: `An instructor (ID: ${data.instructorId}) has requested permission for ${data.permissionType}`,
        recipientId: 1, // Admin ID
        recipientType: "admin",
        notificationType: "permission_request",
        senderId: data.instructorId,
        senderType: "instructor",
      });
    }

    // Extract name from the user relation
    if (
      instructor.user &&
      instructor.user.first_name &&
      instructor.user.last_name
    ) {
      instructorName = `${instructor.user.first_name} ${instructor.user.last_name}`;
    } else {
      logger.warn("User relation missing or incomplete", {
        instructorId: data.instructorId,
      });

      // Try a direct user query as fallback
      if (instructor.user_id) {
        try {
          const userRecord = await dataSource.getRepository("User").findOne({
            where: { id: instructor.user_id },
          });

          if (userRecord && userRecord.first_name && userRecord.last_name) {
            instructorName = `${userRecord.first_name} ${userRecord.last_name}`;
          }
        } catch (userError) {
          logger.error("Error in fallback user query", {
            error: userError.message,
          });
        }
      }
    }

    return sendNotification({
      title: "New Permission Request",
      message: `Instructor ${instructorName} (ID: ${data.instructorId}) has requested permission for ${data.permissionType}`,
      recipientId: 1, // Admin ID
      recipientType: "admin",
      notificationType: "permission_request",
      senderId: data.instructorId,
      senderType: "instructor",
    });
  } catch (error) {
    logger.error("Error sending permission request notification", {
      error: error.message,
      instructorId: data.instructorId,
    });
    throw error;
  }
};

/**
 * Send a permission response notification to instructor
 * @param {Object} data - Permission response data
 * @param {number} data.instructorId - Instructor ID
 * @param {string} data.permissionType - Type of permission
 * @param {boolean} data.approved - Whether the permission was approved
 * @returns {Promise<Object>} The created notification
 */
const sendPermissionResponseNotification = async (data) => {
  try {
    const title = data.approved
      ? "Permission Request Approved"
      : "Permission Request Rejected";

    // Format the permission type to be more readable
    let readablePermissionType = data.permissionType;
    switch (data.permissionType) {
      case "courses":
        readablePermissionType = "Course Creation";
        break;
      case "live_sessions":
        readablePermissionType = "Live Session";
        break;
      case "career_counselling":
        readablePermissionType = "Career Counselling";
        break;
    }

    const message = data.approved
      ? `Your request for ${readablePermissionType} permission has been approved. You can now start using these features.`
      : `Your request for ${readablePermissionType} permission has been rejected. Please contact support if you need further information.`;

    // Essential log for permission response
    logger.info(
      `Sending ${
        data.approved ? "approval" : "rejection"
      } notification to instructor ${data.instructorId}`
    );

    return sendNotification({
      title,
      message,
      recipientId: data.instructorId,
      recipientType: "instructor",
      notificationType: "permission_response",
      senderId: 1, // Admin ID
      senderType: "admin",
    });
  } catch (error) {
    logger.error("Error sending permission response notification", {
      error: error.message,
      instructorId: data.instructorId,
      permissionType: data.permissionType,
      approved: data.approved,
    });
    throw error;
  }
};

/**
 * Get notifications for a user
 * @param {number} userId - User ID
 * @param {string} userType - User type (admin, instructor, student)
 * @param {number} page - Page number
 * @param {number} limit - Number of results per page
 * @param {boolean} unreadOnly - Whether to return only unread notifications
 * @returns {Promise<Object>} Notifications and pagination info
 */
const getUserNotifications = async (
  userId,
  userType,
  page = 1,
  limit = 10,
  unreadOnly = false
) => {
  try {
    return await notificationRepo.getNotifications(
      userId,
      userType,
      page,
      limit,
      unreadOnly
    );
  } catch (error) {
    logger.error("Error getting user notifications", { error: error.message });
    throw error;
  }
};

/**
 * Mark a notification as read
 * @param {number} notificationId - Notification ID
 * @param {number} userId - User ID
 * @param {string} userType - User type
 * @returns {Promise<Object>} Result object
 */
const markNotificationAsRead = async (notificationId, userId, userType) => {
  try {
    // Get the notification
    const notification = await notificationRepo.getNotificationById(
      notificationId
    );

    // If notification doesn't exist, return error
    if (!notification) {
      logger.warn("Notification not found", { notificationId });
      throw new Error("Notification not found or not authorized");
    }

    // Check if this notification belongs to the user
    let isAuthorized = false;

    // Check primary role ownership
    if (
      notification.recipientId === userId &&
      notification.recipientType === userType
    ) {
      isAuthorized = true;
    }

    // If not authorized and user is a student, check if they're also an instructor
    if (!isAuthorized && userType === "student") {
      try {
        // Get the instructor record for this student
        const instructor = await instructorRepo.findByUserId(userId);

        // If user is also an instructor and the notification is for that instructor
        if (
          instructor &&
          notification.recipientId === instructor.id &&
          notification.recipientType === "instructor"
        ) {
          isAuthorized = true;
          logger.info("User authorized via dual role (student+instructor)", {
            userId,
            instructorId: instructor.id,
          });
        }
      } catch (err) {
        logger.warn("Error checking instructor role", { error: err.message });
        // Continue with authorization check - default to not authorized
      }
    }

    // If user is not authorized to access this notification
    if (!isAuthorized) {
      logger.warn("User not authorized to mark notification as read", {
        userId,
        userType,
        notificationId,
        recipientId: notification.recipientId,
        recipientType: notification.recipientType,
      });
      throw new Error("Notification not found or not authorized");
    }

    // User is authorized, proceed with marking as read
    await notificationRepo.markAsRead(notificationId, userId, userType);

    return { success: true, id: notificationId };
  } catch (error) {
    logger.error("Error marking notification as read", {
      error: error.message,
    });
    throw error;
  }
};

/**
 * Mark all notifications as read for a user
 * @param {number} userId - User ID
 * @param {string} userType - User type
 * @returns {Promise<number>} Number of notifications marked as read
 */
const markAllNotificationsAsRead = async (userId, userType) => {
  try {
    return await notificationRepo.markAllAsRead(userId, userType);
  } catch (error) {
    logger.error("Error marking all notifications as read", {
      error: error.message,
    });
    throw error;
  }
};

module.exports = {
  sendNotification,
  sendPermissionRequestNotification,
  sendPermissionResponseNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
