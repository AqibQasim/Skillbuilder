const { postUser, signIn } = require("../controllers/userController");

const userRoutes = async (fastify, options) => {
  fastify.post("/create-user", postUser);
  fastify.post("/signIn", signIn);
};

module.exports = userRoutes;
