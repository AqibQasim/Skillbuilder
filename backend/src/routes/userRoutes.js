const { postUser } = require("../controllers/userController");
const {
  allCourses,
  coursesRating,
} = require("../controllers/CourseController");

const userRoutes = async (fastify, options) => {
  fastify.post("/create-user", postUser);
  fastify.get("/all-courses", allCourses);
  fastify.get("/courses-rating", coursesRating);
};

module.exports = userRoutes;
