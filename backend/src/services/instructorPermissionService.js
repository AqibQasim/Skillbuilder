const instructorPermissionRepo = require("../repositories/instructorPermissionRepository");
const instructorRepo = require("../repositories/instructorRepository");
const notificationService = require("../services/appNotificationService");
const { logger } = require("../../logger");
const dataSource = require("../../Infrastructure/postgres");

// Constants for request limits
const MAX_REJECTED_REQUESTS = 5; // Maximum number of rejected requests to keep per instructor/type
const REJECTION_COOLDOWN_DAYS = 7; // Cooldown period in days after rejection

exports.requestPermission = async (instructor_id, type) => {
  logger.info([
    "src > services > instructorPermissionService > requestPermission",
    { instructor_id, type },
  ]);
  try {
    // Check for existing pending request only
    const existingPendingRequest =
      await instructorPermissionRepo.findPendingByInstructorAndType(
        instructor_id,
        type
      );
    if (existingPendingRequest) {
      logger.warn([
        "Duplicate pending request",
        { instructor_id, type, existing_request_id: existingPendingRequest.id },
      ]);
      const error = new Error(
        "A pending request for this permission type already exists"
      );
      error.statusCode = 400;
      throw error;
    }

    // Check if instructor already has this permission
    const instructor = await instructorRepo.findInstructorByInstructorId(
      instructor_id
    );
    if (!instructor) {
      logger.warn(["Instructor not found", { instructor_id }]);
      const error = new Error("Instructor not found");
      error.statusCode = 404;
      throw error;
    }

    // Check if instructor already has the permission
    let hasPermission = false;
    switch (type) {
      case "courses":
        hasPermission = instructor.courses_rights;
        break;
      case "live_sessions":
        hasPermission = instructor.live_session_rights;
        break;
      case "career_counselling":
        hasPermission = instructor.career_counselling_rights;
        break;
    }

    if (hasPermission) {
      logger.warn([
        "Instructor already has permission",
        { instructor_id, type },
      ]);
      const error = new Error("Instructor already has this permission");
      error.statusCode = 400;
      throw error;
    }

    // Check for recent rejections (cooldown period)
    const recentRejection =
      await instructorPermissionRepo.findMostRecentRejection(
        instructor_id,
        type
      );

    if (recentRejection) {
      const rejectionDate = new Date(recentRejection.updated_at);
      const cooldownEndDate = new Date(rejectionDate);
      cooldownEndDate.setDate(
        cooldownEndDate.getDate() + REJECTION_COOLDOWN_DAYS
      );

      if (new Date() < cooldownEndDate) {
        const daysLeft = Math.ceil(
          (cooldownEndDate - new Date()) / (1000 * 60 * 60 * 24)
        );
        logger.warn([
          "Request in cooldown period",
          { instructor_id, type, daysLeft, rejectionDate },
        ]);
        const error = new Error(
          `You must wait ${daysLeft} more day(s) before submitting a new request for this permission type`
        );
        error.statusCode = 400;
        throw error;
      }
    }

    // Create new request
    const newRequest = await instructorPermissionRepo.createPermissionRequest(
      instructor_id,
      type
    );

    // Clean up old rejected requests if there are too many
    await instructorPermissionRepo.cleanupOldRejectedRequests(
      instructor_id,
      type,
      MAX_REJECTED_REQUESTS
    );

    // Send notification to admin about the new permission request
    try {
      await notificationService.sendPermissionRequestNotification({
        instructorId: instructor_id,
        permissionType: type,
      });
      logger.info([
        "Notification sent to admin about permission request",
        { request_id: newRequest.id },
      ]);
    } catch (notificationError) {
      // Don't fail the request if notification fails, just log it
      logger.error(["Error sending notification", notificationError.message]);
    }

    logger.info([
      "Permission request created successfully",
      { request_id: newRequest.id, instructor_id, type },
    ]);
    return newRequest;
  } catch (error) {
    logger.error(["Error in requestPermission", error.message]);
    throw error;
  }
};

exports.getPendingRequests = async () => {
  logger.info([
    "src > services > instructorPermissionService > getPendingRequests",
  ]);
  try {
    const pendingRequests =
      await instructorPermissionRepo.findPendingRequests();
    logger.info([
      "Pending requests retrieved",
      { count: pendingRequests.length },
    ]);
    return pendingRequests;
  } catch (error) {
    logger.error(["Error in getPendingRequests", error.message]);
    throw error;
  }
};

exports.getRequestStats = async () => {
  logger.info([
    "src > services > instructorPermissionService > getRequestStats",
  ]);
  try {
    const stats = await instructorPermissionRepo.getRequestStats();
    logger.info(["Request stats retrieved"]);
    return stats;
  } catch (error) {
    logger.error(["Error in getRequestStats", error.message]);
    throw error;
  }
};

exports.getInstructorRequestHistory = async (instructor_id, type) => {
  logger.info([
    "src > services > instructorPermissionService > getInstructorRequestHistory",
    { instructor_id, type },
  ]);
  try {
    const history = await instructorPermissionRepo.findAllByInstructorAndType(
      instructor_id,
      type
    );
    logger.info(["Request history retrieved", { count: history.length }]);
    return history;
  } catch (error) {
    logger.error(["Error in getInstructorRequestHistory", error.message]);
    throw error;
  }
};

exports.approveRequest = async (id) => {
  logger.info([
    "src > services > instructorPermissionService > approveRequest",
    { id },
  ]);

  // Create a query runner for transaction management
  const queryRunner = dataSource.createQueryRunner();

  try {
    // Start transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();

    logger.info(["Transaction started for approving request", { id }]);

    // Get repositories within the transaction
    const permissionRepo = queryRunner.manager.getRepository(
      "InstructorPermission"
    );

    // Find the request with transaction
    const request = await permissionRepo.findOne({
      where: { id },
      relations: ["instructor"],
    });

    if (!request) {
      logger.warn(["Request not found", { id }]);
      const error = new Error(
        `Permission request with ID ${id} not found. Please verify the ID and try again.`
      );
      error.statusCode = 404;
      throw error;
    }

    if (request.status !== "pending") {
      logger.warn([
        "Invalid request status for approval",
        { id, current_status: request.status },
      ]);
      const error = new Error(
        `Request with ID ${id} cannot be approved because it is not in pending status. Current status: ${request.status}`
      );
      error.statusCode = 400;
      throw error;
    }

    // Update instructor rights based on permission type
    const updateData = {};
    switch (request.type) {
      case "courses":
        updateData.courses_rights = true;
        break;
      case "live_sessions":
        updateData.live_session_rights = true;
        break;
      case "career_counselling":
        updateData.career_counselling_rights = true;
        break;
    }

    // Update instructor rights within the transaction
    logger.info([
      "Updating instructor rights within transaction",
      { instructor_id: request.instructor_id, rights: updateData },
    ]);

    await queryRunner.manager.update(
      "Instructor",
      request.instructor_id,
      updateData
    );

    // Update request status within the transaction
    request.status = "approved";
    await permissionRepo.save(request);

    // Commit the transaction
    await queryRunner.commitTransaction();
    logger.info([
      "Transaction committed successfully for approving request",
      { id },
    ]);

    // Send notification to instructor about approval (outside transaction)
    try {
      await notificationService.sendPermissionResponseNotification({
        instructorId: request.instructor_id,
        permissionType: request.type,
        approved: true,
      });
      logger.info([
        "Notification sent to instructor about permission approval",
        { request_id: id, instructor_id: request.instructor_id },
      ]);
    } catch (notificationError) {
      // Just log the error, don't fail the request
      logger.error([
        "Error sending notification about approval",
        notificationError.message,
      ]);
    }

    return request;
  } catch (error) {
    // Rollback in case of error
    if (queryRunner.isTransactionActive) {
      logger.warn([
        "Rolling back transaction due to error",
        { error: error.message },
      ]);
      await queryRunner.rollbackTransaction();
    }
    logger.error(["Error in approveRequest", error.message]);
    throw error;
  } finally {
    // Release query runner
    await queryRunner.release();
    logger.info(["Query runner released"]);
  }
};

exports.rejectRequest = async (id) => {
  logger.info([
    "src > services > instructorPermissionService > rejectRequest",
    { id },
  ]);

  // Create a query runner for transaction management
  const queryRunner = dataSource.createQueryRunner();

  try {
    // Start transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();

    logger.info(["Transaction started for rejecting request", { id }]);

    // Get repositories within the transaction
    const permissionRepo = queryRunner.manager.getRepository(
      "InstructorPermission"
    );

    // Find the request with transaction
    const request = await permissionRepo.findOne({
      where: { id },
    });

    if (!request) {
      logger.warn(["Request not found", { id }]);
      const error = new Error(
        `Permission request with ID ${id} not found. Please verify the ID and try again.`
      );
      error.statusCode = 404;
      throw error;
    }

    if (request.status !== "pending") {
      logger.warn([
        "Invalid request status for rejection",
        { id, current_status: request.status },
      ]);
      const error = new Error(
        `Request with ID ${id} cannot be rejected because it is not in pending status. Current status: ${request.status}`
      );
      error.statusCode = 400;
      throw error;
    }

    // Update request status within the transaction
    request.status = "rejected";
    await permissionRepo.save(request);

    // Commit the transaction
    await queryRunner.commitTransaction();
    logger.info([
      "Transaction committed successfully for rejecting request",
      { id },
    ]);

    // Send notification to instructor about rejection (outside transaction)
    try {
      await notificationService.sendPermissionResponseNotification({
        instructorId: request.instructor_id,
        permissionType: request.type,
        approved: false,
      });
      logger.info([
        "Notification sent to instructor about permission rejection",
        { request_id: id, instructor_id: request.instructor_id },
      ]);
    } catch (notificationError) {
      // Just log the error, don't fail the request
      logger.error([
        "Error sending notification about rejection",
        notificationError.message,
      ]);
    }

    return request;
  } catch (error) {
    // Rollback in case of error
    if (queryRunner.isTransactionActive) {
      logger.warn([
        "Rolling back transaction due to error",
        { error: error.message },
      ]);
      await queryRunner.rollbackTransaction();
    }
    logger.error(["Error in rejectRequest", error.message]);
    throw error;
  } finally {
    // Release query runner
    await queryRunner.release();
    logger.info(["Query runner released"]);
  }
};
