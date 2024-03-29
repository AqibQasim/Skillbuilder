const { logger } = require("../../logger");
const { ValidateUser, loginValidation } = require("../Schema/userSchema");
const ValidateContactUs = require("../Schema/contactUsSchema");
const { redisClient } = require("../../Infrastructure/redis");
const {
  emailVerificationForRegister,
  findAllUser,
  UserLogin,
  ContactUser,
  createUserAfterVerification,
} = require("../services/userService");

const createStudent = async (request, reply) => {
  logger.info(["src > controllers > userController > ", request.body]);
  try {
    if (request.body) {
      const { error } = ValidateUser.validate(request.body);
      if (error) {
        return reply.code(400).send({
          status: false,
          message: error.details[0].message,
        });
      }
      await emailVerificationForRegister(request.body);
      reply.code(201).send({
        staus: true,
        message: "Message sent to given email for email verification",
      });
    } else {
      reply.code(400).send({
        status: false,
        message: "Cannot request without body",
      });
    }
  } catch (error) {
    logger.error(["Error registering user:", error.message]);
    reply.code(500).send({
      staus: false,
      message: error.message,
    });
  }
};

const EmailVerify = async (request, reply) => {
  try {
    const { email, verificationToken } = request.query;
    const storedToken = await redisClient.get(email);
    if (storedToken === verificationToken) {
      await redisClient.del(email);
      let newUser = await createUserAfterVerification(verificationToken);
      return reply.redirect(process.env.LOGINREDIRECTPAGE);
    } else {
      reply.status(400).send("Link Expire");
    }
  } catch (error) {
    logger.error(["Error verifying email:", error.message]);
    reply.status(500).send(error.message);
  }
};

const getAllUsers = async (request, reply) => {
  logger.info("Find User: ");
  try {
    const users = await findAllUser();
    reply.code(200).send({
      status: true,
      message: "success",
      data: users,
    });
  } catch (error) {
    reply.code(500).send({
      status: false,
      message: error.message,
    });
  }
};

const login = async (request, reply) => {
  logger.info("Login", request.body);
  try {
    if (request.body) {
      let payload = {
        email: request.body?.email,
        password: request.body?.password,
      };
      const { error } = loginValidation.validate(payload);
      if (error) {
        return reply.code(400).send({
          status: false,
          message: error.details[0].message,
        });
      };
      const user = await UserLogin(payload);
      reply.code(200).send({
        status: true,
        message: 'success',
        data: user,
      });
    }else {
      reply.code(500).send({
        staus: false,
        message: "can't request without body",
      });
    }
  } catch (error) {
    logger.error(["Error during login:", error.message]);
    reply.status(500).send({
      code: 500,
      status: "Internal Server Error",
      message: error.message,
    });
  }
};

const GoggleLoginCallBAck = async (request, reply) => {
  try {
    console.log("request body: >>> ", request.body);
    const code = request.query.code;
    console.log("code: ", code);
    reply.redirect(process.env.HOME_PAGE_REDIRECT);
    // reply.code(200).send({
    //   status: true,
    //   message: 'User created successfully'
    // })
  } catch (error) {
    reply.code(500).send({
      status: false,
      error: error.message,
    });
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
  createStudent,
  getAllUsers,
  login,
  GoggleLoginCallBAck,
  EmailVerify,
  ContactUS,
};
