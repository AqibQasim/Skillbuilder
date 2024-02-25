const { registerUser,FindUser,UserLogin } = require("../services/userService");
const { logger } = require("../../logger");
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')
const cookies=require('cookie-parser')
const app=(cookies);


const postUser=async(request,reply)=>{
  logger.info("data: ", request.body);
      const { name, email, password }=request.body;
  try {
    if (!name || !email || !password) {
            return reply.code(400).send({
              code: 400,
              status: "failed",
              message: "All fields are compulsory"
            });
    }
    else{
          const hashedPassword = await bcrypt.hash(password, 10);
         const userInfo = { name, email, password: hashedPassword };
          const users = await registerUser(userInfo)

            reply.send(users);
    }
  }catch (error) {
      reply.status(500).send(error);
  }

}




const FindAllUsers=async(request,reply)=>{
  logger.info("Find User: ")

  try {
    const users = await FindUser();
    reply.send(users);
  } catch (error) {
    reply.status(500).send(error);
  }

}

const Login = async (request, reply) => {
  logger.info("Login", request.body);
  try {
    const { email, password } = request.body;

    if (email && password) {
      const user = await UserLogin({ email, password });

      reply.send(user)
    } else {
      reply.send({
        code: 400,
        status: "failed",
        message: "All fields are compulsory"
      });
    }
  } catch (error) {
    logger.error("Error during login:", error);
    reply.status(500).send({
      code: 500,
      status: "error",
      message: "Internal Server Error"
    });
  }
}


module.exports = {
  postUser,
  FindAllUsers,
  Login
};