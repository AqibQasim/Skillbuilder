const {
  fetchInstructorWithRevieww,
  getInstructors,
} = require("../controllers/instructorController");

const instructorRoutes = async (fastify, options) => {
  fastify.get("/allInstructors", getInstructors);
  fastify.get("/instructorsWithReview/:id", fetchInstructorWithRevieww);
};

module.exports = instructorRoutes;
