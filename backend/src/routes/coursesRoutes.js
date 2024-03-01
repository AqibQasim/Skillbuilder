const {
  allCourses,
  coursesRating,
} = require("../controllers/CourseController");

const coursesRoutes = async (fastify, options) => {
  fastify.get("/all-courses", allCourses);
  fastify.get("/courses-rating", coursesRating);
};

module.exports = coursesRoutes;
