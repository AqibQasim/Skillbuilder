const { postUser } = require("../controllers/userController");

const userRoutes = async (fastify, options) => {
  fastify.post("/create-user", postUser);
};

module.exports = userRoutes;
