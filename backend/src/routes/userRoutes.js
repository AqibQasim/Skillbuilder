const { postUser,FindAllUsers,Login } = require("../controllers/userController");

const userRoutes = async (fastify, options) => {
  fastify.post('/create-user', postUser);
  fastify.get('/users',FindAllUsers)
  

  fastify.post('/login',Login)
};

module.exports = userRoutes;