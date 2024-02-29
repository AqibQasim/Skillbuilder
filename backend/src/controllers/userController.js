const {registerUser,FindUser,UserLogin,googleLogin,googleClient} = require("../services/userService");
const { logger } = require("../../logger");
const bcrypt = require("bcrypt");
const Redis = require("ioredis");
const redis = new Redis();

const postUser = async (request, reply) => {
  logger.info("data: ", request.body);  
  const { name, email, password } = request.body;
  try {
    if (!name || !email || !password) {
      return reply.code(400).send({
        code: 400,
        status: "failed",
        message: "All fields are compulsory",
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const userInfo = { name, email, password: hashedPassword };

      const users = await registerUser(userInfo);

      reply.code(201).send({
        users,
      });
    }
  } catch (error) {
    request.log.error("Error registering user:", error);
    reply
      .code(500)
      .send({ error: "An error occurred while registering user." });
  }
};

const FindAllUsers = async (request, reply) => {
  logger.info("Find User: ");

  try {
    const users = await FindUser();
    reply.send(users);
  } catch (error) {
    reply.status(500).send(error);
  }
};

const Login = async (request, reply) => {
  logger.info("Login", request.body);
  try {
    const { email, password } = request.body;

    if (email && password) {
      const user = await UserLogin({ email, password });

      reply.send(user);
    } else {
      reply.send({
        code: 400,
        status: "failed",
        message: "All fields are compulsory",
      });
    }
  } catch (error) {
    logger.error("Error during login:", error);
    reply.status(500).send({
      code: 500,
      status: "error",
      message: "Internal Server Error",
    });
  }
};

const GoogleLogin = async (request, reply) => {
  const authUrl = await googleLogin();
  reply.redirect(authUrl);
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


const EmailVarify = async (request, reply) => {
  try {
    const { email, verificationToken } = request.query;

    const storedToken = await redis.get(email);

    if (storedToken === verificationToken) {
      
      await redis.del(email);

      reply.send("Email verified successfully!");
    } else {
      reply.status(400).send("Link Expire");
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    reply.status(500).send("An error occurred while verifying the email.");
  }
};

module.exports = {
  postUser,
  FindAllUsers,
  Login,
  GoogleLogin,
  GoggleLoginCallBAck,
  EmailVarify,
};
