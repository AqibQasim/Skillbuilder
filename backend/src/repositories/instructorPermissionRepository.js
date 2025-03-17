const dataSource = require("../../Infrastructure/postgres");
const InstructorPermission = require("../entities/InstructorPermission");
const { logger } = require("../../logger");

exports.createPermissionRequest = async (instructor_id, type) => {
  logger.info([
    "src > repositories > instructorPermissionRepository > createPermissionRequest",
    { instructor_id, type },
  ]);
  try {
    const repo = dataSource.getRepository(InstructorPermission);
    const newRequest = repo.create({ instructor_id, type, status: "pending" });
    const result = await repo.save(newRequest);
    logger.info(["Permission request created", result]);
    return result;
  } catch (error) {
    logger.error("Error creating permission request:", error);
    throw error;
  }
};

exports.findPendingRequests = async () => {
  logger.info([
    "src > repositories > instructorPermissionRepository > findPendingRequests",
  ]);
  try {
    const repo = dataSource.getRepository(InstructorPermission);
    const results = await repo.find({
      where: { status: "pending" },
      relations: ["instructor"],
    });
    logger.info(["Found pending requests", { count: results.length }]);
    return results;
  } catch (error) {
    logger.error("Error finding pending requests:", error);
    throw error;
  }
};

exports.findRequestById = async (id) => {
  logger.info([
    "src > repositories > instructorPermissionRepository > findRequestById",
    { id },
  ]);
  try {
    const repo = dataSource.getRepository(InstructorPermission);
    const result = await repo.findOne({
      where: { id },
      relations: ["instructor"],
    });
    logger.info([
      "Request found",
      result ? { id: result.id, status: result.status } : "Not found",
    ]);
    return result;
  } catch (error) {
    logger.error("Error finding request by id:", error);
    throw error;
  }
};

exports.findPendingByInstructorAndType = async (instructor_id, type) => {
  logger.info([
    "src > repositories > instructorPermissionRepository > findPendingByInstructorAndType",
    { instructor_id, type },
  ]);
  try {
    const repo = dataSource.getRepository(InstructorPermission);
    const result = await repo.findOne({
      where: {
        instructor_id,
        type,
        status: "pending",
      },
    });
    logger.info([
      "Pending request found",
      result ? { id: result.id } : "None found",
    ]);
    return result;
  } catch (error) {
    logger.error(
      "Error finding pending request by instructor and type:",
      error
    );
    throw error;
  }
};

exports.findMostRecentRejection = async (instructor_id, type) => {
  logger.info([
    "src > repositories > instructorPermissionRepository > findMostRecentRejection",
    { instructor_id, type },
  ]);
  try {
    const repo = dataSource.getRepository(InstructorPermission);
    const result = await repo.findOne({
      where: {
        instructor_id,
        type,
        status: "rejected",
      },
      order: {
        updated_at: "DESC",
      },
    });
    logger.info([
      "Recent rejection found",
      result ? { id: result.id, updated_at: result.updated_at } : "None found",
    ]);
    return result;
  } catch (error) {
    logger.error("Error finding most recent rejection:", error);
    throw error;
  }
};

exports.cleanupOldRejectedRequests = async (instructor_id, type, maxToKeep) => {
  logger.info([
    "src > repositories > instructorPermissionRepository > cleanupOldRejectedRequests",
    { instructor_id, type, maxToKeep },
  ]);
  try {
    const repo = dataSource.getRepository(InstructorPermission);

    // Find all rejected requests for this instructor and type
    const rejectedRequests = await repo.find({
      where: {
        instructor_id,
        type,
        status: "rejected",
      },
      order: {
        updated_at: "DESC",
      },
    });

    // If we have more than the max, delete the oldest ones
    if (rejectedRequests.length > maxToKeep) {
      const requestsToDelete = rejectedRequests.slice(maxToKeep);
      const idsToDelete = requestsToDelete.map((request) => request.id);

      logger.info([
        "Cleaning up old rejected requests",
        {
          totalFound: rejectedRequests.length,
          toDelete: idsToDelete.length,
          idsToDelete,
        },
      ]);
      await repo.delete(idsToDelete);
      logger.info(["Old rejected requests deleted"]);
    } else {
      logger.info([
        "No cleanup needed",
        { found: rejectedRequests.length, maxToKeep },
      ]);
    }
  } catch (error) {
    logger.error("Error cleaning up old rejected requests:", error);
    throw error;
  }
};

exports.findAllByInstructorAndType = async (instructor_id, type) => {
  logger.info([
    "src > repositories > instructorPermissionRepository > findAllByInstructorAndType",
    { instructor_id, type },
  ]);
  try {
    const repo = dataSource.getRepository(InstructorPermission);
    const results = await repo.find({
      where: {
        instructor_id,
        type,
      },
      order: {
        created_at: "DESC",
      },
    });
    logger.info(["Request history found", { count: results.length }]);
    return results;
  } catch (error) {
    logger.error("Error finding request history:", error);
    throw error;
  }
};

exports.getRequestStats = async () => {
  logger.info([
    "src > repositories > instructorPermissionRepository > getRequestStats",
  ]);
  try {
    const repo = dataSource.getRepository(InstructorPermission);

    // Get counts by status
    const pendingCount = await repo.count({ where: { status: "pending" } });
    const approvedCount = await repo.count({ where: { status: "approved" } });
    const rejectedCount = await repo.count({ where: { status: "rejected" } });

    // Get counts by type
    const coursesCount = await repo.count({ where: { type: "courses" } });
    const liveSessionsCount = await repo.count({
      where: { type: "live_sessions" },
    });
    const careerCounsellingCount = await repo.count({
      where: { type: "career_counselling" },
    });

    const stats = {
      byStatus: {
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        total: pendingCount + approvedCount + rejectedCount,
      },
      byType: {
        courses: coursesCount,
        live_sessions: liveSessionsCount,
        career_counselling: careerCounsellingCount,
      },
    };

    logger.info(["Request stats generated", stats]);
    return stats;
  } catch (error) {
    logger.error("Error generating request stats:", error);
    throw error;
  }
};

exports.updateRequestStatus = async (id, status) => {
  logger.info([
    "src > repositories > instructorPermissionRepository > updateRequestStatus",
    { id, status },
  ]);
  try {
    const repo = dataSource.getRepository(InstructorPermission);
    const request = await repo.findOne({ where: { id } });
    if (!request) {
      logger.warn(["Request not found", { id }]);
      const error = new Error(
        `Permission request with ID ${id} not found. Please verify the ID and try again.`
      );
      error.statusCode = 404;
      throw error;
    }

    const oldStatus = request.status;
    request.status = status;
    const result = await repo.save(request);
    logger.info([
      "Request status updated",
      { id, oldStatus, newStatus: status },
    ]);
    return result;
  } catch (error) {
    logger.error("Error updating request status:", error);
    throw error;
  }
};
