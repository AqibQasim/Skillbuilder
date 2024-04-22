const {
  getAllInstructor,
  instructorDetail,
  createInstructor,
} = require("../controllers/InstructorController");

const instructorRoutes = async (fastify, options) => {

  fastify.post("/create-instructor", createInstructor);

  fastify.get("/get-all-instructors", getAllInstructor);

  fastify.get("/instructor-detail/:id", instructorDetail);
};

module.exports = instructorRoutes;
