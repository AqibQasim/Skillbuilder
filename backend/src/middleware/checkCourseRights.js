const {
  findInstructorByInstructorId,
} = require("../repositories/instructorRepository");

/**
 * Course types enum for validation
 */
const COURSE_TYPES = {
  REGULAR: "regular",
  LIVE_SESSION: "live_session",
  CAREER_COUNSELLING: "career_counselling",
};

/**
 * Middleware factory to check instructor rights for course creation
 * @param {string} courseType - Type of course being created
 */
const checkCourseRights = (courseType) => {
  return async (request, reply) => {
    try {
      const instructor_id = request.body.instructor_id;

      if (!instructor_id) {
        return reply.code(400).send({
          status: false,
          message: "Instructor ID is required",
        });
      }

      const instructor = await findInstructorByInstructorId(instructor_id);

      if (!instructor) {
        return reply.code(404).send({
          status: false,
          message: "Instructor not found",
        });
      }

      let hasRights = false;
      switch (courseType) {
        case COURSE_TYPES.REGULAR:
          hasRights = instructor.courses_rights;
          break;
        case COURSE_TYPES.LIVE_SESSION:
          hasRights = instructor.live_session_rights;
          break;
        case COURSE_TYPES.CAREER_COUNSELLING:
          hasRights = instructor.career_counselling_rights;
          break;
        default:
          return reply.code(400).send({
            status: false,
            message: "Invalid course type",
          });
      }

      if (!hasRights) {
        return reply.code(403).send({
          status: false,
          message: `You don't have permission to create ${courseType} courses`,
        });
      }

      // If we get here, the instructor has the required rights
      return;
    } catch (error) {
      console.error("Error checking course rights:", error);
      return reply.code(500).send({
        status: false,
        message: "Internal server error while checking course rights",
      });
    }
  };
};

module.exports = {
  checkCourseRights,
  COURSE_TYPES,
};
