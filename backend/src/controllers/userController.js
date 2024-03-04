const { registerUser, findAllUser, UserLogin, googleClient, ContactUser, createUserAfterVerification, } = require("../services/userService");
const { logger } = require("../../logger");
const Redis = require("ioredis");
const redis = new Redis();
const { ValidateUser, loginValidation } = require("../Schema/userSchema");
const ValidateContactUs = require("../Schema/contectUsSchema");
const { GoogleClient } = require("../Authentication/googleAuth");

const postUser = async (request, reply) => {
  logger.info(['src > controllers > userController > ', request.body]);
  try {
    const { error } = ValidateUser.validate(request.body);
    if (error) {
      return reply.code(400).send({ error: error.details[0].message });
    }

    await registerUser(request.body);

    reply.code(201).send({
      message: 'Message sent to given email for email verification',
    });

  } catch (error) {
    console.log(error);
    logger.error(["Error registering user:", error.message]);
    reply
      .code(500)
      .send({ error: "An error occurred while registering user." });
  }
};

const getAllUsers = async (request, reply) => {
  logger.info("Find User: ");
  try {
    const users = await findAllUser();
    reply.status(200).send({ users });
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
};

const login = async (request, reply) => {
  logger.info("Login", request.body);
  try {
    let payload = {
      email: request.body.email,
      password: request.body.password
    }
    const { error } = loginValidation.validate(payload);
    if (error) {
      return reply.code(400).send({ error: error.details[0].message });
    }
    const user = await UserLogin(payload);
    reply.code(200).send(user);

  }
  catch (error) {
    logger.error("Error during login:", error);
    reply.status(500).send({
      code: 500,
      status: "Internal Server Error",
      message: error.message,
    });
  }
};

const GoogleLogin = async (request, reply) => {
  const Url = GoogleClient.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
  });
  console.log("Url ", Url);
  reply.code(200).send({
    message: 'Success',
    url: Url
  })
};

const GoggleLoginCallBAck = async (request, reply) => {
  try {
    const code = request.query.code;
    const userInfo = await googleClient(code);
    if (userInfo) {
      reply.send(userInfo);
    }
  } catch (error) {
    reply
      .status(500)
      .send({ error: "An error occurred while fetching user information." });
  }
};

const EmailVerify = async (request, reply) => {
  try {
    const { email, verificationToken } = request.query;
    const storedToken = await redis.get(email);
    if (storedToken === verificationToken) {
      await redis.del(email);
      let newUser = await createUserAfterVerification(verificationToken)
      reply.code(200).send({
        status: 'Success',
        user: newUser
      });
    } else {
      reply.status(400).send("Link Expire");
    }
  } catch (error) {
    logger.error(["Error verifying email:", error]);
    reply.status(500).send("An error occurred while verifying the email.");
  }
};

const ContactUS = async (request, reply) => {
  const userInfo = request.body;

  const { error } = ValidateContactUs.validate(userInfo);
  if (error) {
    return reply.code(400).send({ error: error.details[0].message });
  }

  console.log("User Info", userInfo);
  try {
    const users = await ContactUser(userInfo);
    console.log("Users in Controller", userInfo);

    reply.code(201).send({
      users,
    });
  } catch (error) {
    console.log("Error in Controller ", error);
    request.log.error("Error registering user:", error);
    reply
      .code(500)
      .send({ error: "An error occurred while registering user." });
  }
};

module.exports = {
  postUser,
  getAllUsers,
  login,
  GoogleLogin,
  GoggleLoginCallBAck,
  EmailVerify,
  ContactUS,
};
