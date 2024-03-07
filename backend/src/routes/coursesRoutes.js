const {
  allCourses,
  coursesRating,
  courseDetails,
  recentCourses,
} = require("../controllers/CourseController");

const coursesRoutes = async (fastify, options) => {
  fastify.get("/all-courses",    allCourses);
  fastify.get("/courses-rating", coursesRating);
  fastify.get("/recent-courses", recentCourses);
  fastify.get("/courses-detail", courseDetails);


};

module.exports = coursesRoutes;
