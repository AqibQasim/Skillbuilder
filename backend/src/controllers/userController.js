const { logger } = require("../../logger");
const {
  ValidateUser,
  loginValidation,
  validateEmailAndPassword,
  updateProfileValidation,
} = require("../Schema/userSchema");
const ValidateContactUs = require("../Schema/contactUsSchema");
const { redisClient } = require("../../Infrastructure/redis");
const jwt = require("jsonwebtoken");
const User = require("../entities/userEntity");
const { findUser } = require("../repositories/userRepository");

const {
  emailVerificationForRegister,
  findAllUser,
  UserLogin,
  ContactUser,
  createUserAfterVerification,
  findUserByEmail,
  sendMailToUser,
  passwordChange,
  profileUpdateService,
  createGoogleUser,
  getOneUserService,
  sendEmailService,
  enrollInCourseService,
  getStudentsByInstructorIdService
} = require("../services/userService");

const createStudent = async (request, reply) => {
  logger.info(["src > controllers > userController > ", request.body]);
  try {
    if (request.body) {
      console.log("req:", request.body);
      const { error } = ValidateUser.validate(request.body);
      if (error) {
        console.log("validation error:", error);
        return reply.code(400).send({
          status: false,
          message: error.details[0].message,
        });
      }
      const result = await emailVerificationForRegister(request.body);
      reply.code(result.code).send(result.message);
    } else {
      reply.code(400).send({
        status: false,
        message: "Cannot request without body",
      });
    }
  } catch (error) {
    console.log("error:", error);
    logger.error(["Error registering user:", error.message]);
    reply.code(500).send({
      status: false,
      message: error.message,
    });
  }
};

const sendEmail = async  (req,res) => {
  try{
    const {email, content, subject} = req?.body;
    console.log("body data:", email, content);
    const result = await sendEmailService(email,content, subject);
    res.status(200).send(result)
  } catch(e){
    console.log("Error while sending a mail:", e);
    res.status(200).send("Some error occured:",e);
  }
}

const EmailVerify = async (request, reply) => {
  try {
    const { email, token } = request.query;
    console.log("params:", request.query);
    const storedToken = await redisClient.get(email);
    if (storedToken === token) {
      await redisClient.del(email);
      let newUser = await createUserAfterVerification(token);
      console.log("newUser creation status:", newUser);
      reply.redirect(process.env.LOGINREDIRECTPAGE);
      return;
    } else {
      reply.status(400).send("Link Expired");
      return;
    }
  } catch (error) {
    logger.error(["Error verifying email:", error.message]);
    reply.status(500).send(error.message);
    return;
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
      }
      const user = await UserLogin(payload);
      console.log("user:", user);
      if (user) {
        reply.status(200).send({
          token: user?.token,
          user: user?.user,
        });
      }
    } else {
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

const getOneUser = async (req,res) => {
  try{
    const id = req?.params?.id;
    const result = await getOneUserService(id);
    console.log("result:", result);  
    res.status(result?.status).send({
      success: result?.status,
      message : result?.message
    })
  } catch(err){
    console.log("ERR:",err);
  }
}

const enrollInCourse = async (request,reply) => {
  try{
    const {student_id,course_id,filter} = request?.body;
    const result = await enrollInCourseService({student_id,course_id,filter});
    reply.status(200).send(result);
  } catch(err){
    console.log("Some internal server error occured",err);
    reply.status(500).send("Some internal server error occured",err);
  }
}

const GoggleLoginCallBAck = async (request, reply) => {
  try {
    const user = request.user;
    console.log("google callback: >>>>>> ", user);
    const code = request.query?.code;
    console.log("code: ", code);
    const userCreation = await createGoogleUser(user);
    console.log("userCreation: ", userCreation);
    reply.send({
      status: true,
      message: "logged in successfully",
      data: userCreation,
    });
  } catch (error) {
    reply.code(500).send({
      status: false,
      error: error.message,
    });
  }
};

const passwordResetHandler = async (request, reply) => {
  try {
    const { email } = request.query;
    const user = await findUserByEmail(email);
    if (!user) {
      return reply.code(404).send({
        status: false,
        message: "User not found",
      });
    }

    await sendMailToUser(user?.email);
    reply.code(200).send({
      status: true,
      message: "OTP sent to the given email",
    });
  } catch (error) {
    logger.error([
      "error in userController > passowrdResetHandler",
      error.message,
    ]);
    reply.code(500).send({
      status: false,
      message: error.message,
    });
  }
};

const otpVerification = async (request, reply) => {
  try {
    const { otp, email } = request.query;
    const getOtp = await redisClient.get(`otp-${email}`);
    console.log("getOPT : ", getOtp);
    if (otp == getOtp) {
      reply.code(200).send({
        status: true,
        message: "OTP verification successful",
      });
      redisClient.del(`otp-${email}`);
    } else {
      reply.code(200).send({
        status: false,
        message: "Invalid OTP",
      });
    }
  } catch (error) {
    logger.error(["error in userController > otpVerificatio", error.message]);
    reply.code(500).send({
      status: false,
      message: error.message,
    });
  }
};

const changePassword = async (request, reply) => {
  try {
    const { email, current_password, new_password } = request.body;

    const { error } = validateEmailAndPassword.validate({
      email,
      password: current_password,
    });
    if (error) {
      return reply.code(403).send({
        status: false,
        message: error.details[0].message,
      });
    }
    const { status, code, message } = await passwordChange(request.body);
    reply.code(code).send({
      status,
      message,
    });
    // logger.info([ "update password in userController > ", updatePassword ]);
  } catch (error) {
    reply.code(500).send({
      status: false,
      message: error.message,
    });
  }
};

const profileUpdateHandler = async (request, reply) => {
  try {
    const requestedData = request?.body;
    const { error } = updateProfileValidation.validate(requestedData);
    if (error) {
      return reply.code(403).send({
        status: false,
        message: error.details[0].message,
      });
    }
    const result = await profileUpdateService(requestedData);

    logger.info("updated result: ", result);
    reply.code(200).send(result);
  } catch (err) {
    reply.code(500).send({
      status: false,
      message: err.message,
    });
  }
};

const ContactUS = async (request, reply) => {
  const userInfo = request.body;

  // const { error } = ValidateContactUs.validate(userInfo);
  // if (error) {
  //   return reply.code(400).send({ error: error.details[0].message });
  // }

  console.log("User Info", userInfo);
  try {
    const sentMail = await ContactUser(userInfo);
    console.log("Users in Controller", userInfo);
    reply.code(201).send({
      success: true,
      message: sentMail,
    });
  } catch (error) {
    console.log("Error in Controller ", error);
    request.log.error("Error while Contacting:", error);
    reply.code(500).send({ error: "An Error Occured" });
  }
};

const getStudentsByInstructorId = async (request,response) => {
  try{
    const {instructor_id} = request?.query;
    const result = await getStudentsByInstructorIdService({instructor_id});
    response.status(200).send(result);
  } catch(err){
    console.log("Error while handling:",err);
    response.status(500).send("Error while handling:",err);
  }
}

module.exports = {
  createStudent,
  getAllUsers,
  login,
  GoggleLoginCallBAck,
  EmailVerify,
  passwordResetHandler,
  otpVerification,
  changePassword,
  profileUpdateHandler,
  ContactUS,
  getOneUser,
  sendEmail,
  enrollInCourse,
  getStudentsByInstructorId
};
