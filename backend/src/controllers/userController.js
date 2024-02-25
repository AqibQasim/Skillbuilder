const { logger } = require("../../logger");
const { registerUser } = require("../services/userService");

const postUser = async (request, reply) => {
  logger.info("data: ", request.body)
  try {
    const user = await registerUser(request.body);
    reply.send(user);
  } catch (error) {
    reply.status(500).send(error);
  }
};

module.exports = {
  postUser,
};