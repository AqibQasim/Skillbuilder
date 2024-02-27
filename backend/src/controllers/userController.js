const { emit } = require("nodemon");
const { logger } = require("../../logger");
const { registerUser, signInUser } = require("../services/userService");
const { getRepository } = require("typeorm");
const { User } = require("../entities/userEntity");

const postUser = async (request, reply) => {
  logger.info("data: ", request.body);
  try {
    const user = await registerUser(request.body);
    reply.send(user);
  } catch (error) {
    reply.status(500).send(error);
  }
};

//SIGN IN USER
const signIn = async (req, rep) => {
  console.log("sign in is working");
  try {
    const { email, password } = req.body;

    console.log("checking");
    console.log(email, password);

    // finding user by email

    const user = await signInUser(req.body);

    rep.send(user);
  } catch (err) {
    rep.status(500).send({ error: err.message });
  }
};

module.exports = {
  postUser,
  signIn,
};
