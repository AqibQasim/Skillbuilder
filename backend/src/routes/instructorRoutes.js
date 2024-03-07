const {
  getAllInstructor,
  instructorDetail,
} = require("../controllers/InstructorController");

const instructorRoutes = async (fastify, options) => {
  fastify.get("/get-all-instructors", getAllInstructor);

  fastify.get("/instructor-detail/:id", instructorDetail);
};

module.exports = instructorRoutes;
