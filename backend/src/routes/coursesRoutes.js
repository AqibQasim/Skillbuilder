const {
  allCourses,
  coursesRating,
  courseDetails,
  recentCourses,
} = require("../controllers/CourseController");

const coursesRoutes = async (fastify, options) => {
  fastify.get("/all-courses", allCourses);
  fastify.get("/courses-rating", coursesRating);
  fastify.get("/recent-courses", recentCourses);
  fastify.get("/course-details/:id", courseDetails);


};

module.exports = coursesRoutes;
