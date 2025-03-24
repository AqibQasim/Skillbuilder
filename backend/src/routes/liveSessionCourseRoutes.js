const liveSessionCourseController = require("../controllers/liveSessionCourseController");
const {
  checkCourseRights,
  COURSE_TYPES,
} = require("../middleware/checkCourseRights");

const liveSessionCourseRoutes = async (fastify, options) => {
  fastify.post(
    "/create-live-session-course",
    {
      preHandler: [checkCourseRights(COURSE_TYPES.LIVE_SESSION)],
    },
    liveSessionCourseController.createLiveSessionCourse
  );
  fastify.get(
    "/get-live-session-course",
    liveSessionCourseController.getLiveSessionCourse
  );
  fastify.get(
    "/get-live-session-course-enrolled-students",
    liveSessionCourseController.getLiveSessionCourseEnrolledStudents
  );
  fastify.get(
    "/get-live-session-course/:course_id",
    liveSessionCourseController.getLiveSessionCourseById
  );

  fastify.get(
    "/get-live-session-courses/:instructor_id",
    liveSessionCourseController.getLiveSessionCourseOfInstrcutor
  )
};

module.exports = liveSessionCourseRoutes;
