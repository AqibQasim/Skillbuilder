const { postUser } = require("../controllers/userController");
const { allCourses } = require("../controllers/CourseController");

const userRoutes = async (fastify, options) => {
  fastify.post("/create-user", postUser);
  fastify.get("/all-courses", allCourses);
};

module.exports = userRoutes;
