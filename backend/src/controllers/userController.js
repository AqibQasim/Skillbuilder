const { logger } = require("../../logger");
const { ValidateUser, loginValidation, validateEmailAndPassword, updateProfileValidation } = require("../Schema/userSchema");
const ValidateContactUs = require("../Schema/contactUsSchema");
const { redisClient } = require("../../Infrastructure/redis");
const jwt = require('jsonwebtoken');
const User = require('../entities/userEntity');
const {findUser}= require("../repositories/userRepository");

const {
  emailVerificationForRegister,
  findAllUser,
  UserLogin,
  ContactUser,
  createUserAfterVerification,
  findUserByEmail,
  sendMailToUser,
  passwordChange,
  profileUpdateService
} = require("../services/userService");

// const createStudent = async (request, reply) => {
//   logger.info(["src > controllers > userController > ", request.body]);
//   try {
//     if (request.body) {
//       console.log('req:', request.body);
//       const { error } = ValidateUser.validate(request.body);
//       if (error) {
//         console.log('validation error:',error)
//         return reply.code(400).send({message: error});
//       }
//       console.log("hey1");
//       await emailVerificationForRegister(request.body);
//       console.log('hey3');
//       reply.code(201).send({
//         staus: true,
//         message: "Message sent to given email for email verification",
//       });
//     } else {

//       console.log('hello from else')
//       reply.code(400).send({
//         status: false,
//         message: "Cannot request without body",
//       });
//     }
//   } catch (error) {
//     console.log("error:",err)
//     logger.error(["Error registering user:", error.message]);
//     reply.code(500).send({
//       staus: false,
//       message: error.message,
//     });
//   }
// };

const createStudent = async (request, reply) => {
  logger.info(["src > controllers > userController > ", request.body]);
  try {
    if (request.body) {
      console.log('req:', request.body);
      const { error } = ValidateUser.validate(request.body);
      if (error) {
        console.log('validation error:', error);
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

// const EmailVerify = async (request, reply) => {
//   try {
//     const { email, token } = request?.query;
//     console.log('params:',request?.query);
//     const storedToken = await redisClient.get(email);
//     if (storedToken === token) {
//       await redisClient.del(email);
//       let newUser = await createUserAfterVerification(token);
//       console.log('newUser creation status:', newUser);
//       return reply.redirect(process.env.LOGINREDIRECTPAGE);
//     } else {
//       reply.status(400).send("Link Expire");
//     }
//   } catch (error) {
//     logger.error(["Error verifying email:", error.message]);
//     reply.status(500).send(error.message);
//   };
// };

const EmailVerify = async (request, reply) => {
  try {
    const { email, token } = request.query;
    console.log('params:', request.query);
    const storedToken = await redisClient.get(email);
    if (storedToken === token) {
      await redisClient.del(email);
      let newUser = await createUserAfterVerification(token);
      console.log('newUser creation status:', newUser);
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
      };
      const user = await UserLogin(payload);
      console.log('user:',user);
      if( user && user?.userId && user?.token ){
        reply.status(200).send({
          token : user?.token,
          userId: user?.userId
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

const GoggleLoginCallBAck = async (request, reply) => {
  try {
    const { email } = request.user;
    // Check if user exists or create a new user
    let user = await findUser({ where: { email } });
    console.log("request body: >>> ", request?.body);
    const code = request?.query?.code;
    console.log("code: ", code);
    const token = jwt.sign({ id: user?.id, email: user?.email }, process.env.JWT_SECRET, { expiresIn: "10h" });
    console.log("token:",token);
    // reply.redirect(process.env.HOME_PAGE_REDIRECT);
    if(user?.id){
      return reply.status(200).send({ token , userId: user?.id});
    }
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
    const getOtp = await redisClient.get(`otp-${email}`)
    console.log("getOPT : ", getOtp);
    if (otp == getOtp) {
      reply.code(200).send({
        status: true,
        message: "OTP verification successful"
      });
      redisClient.del(`otp-${email}`)
    } else {
      reply.code(200).send({
        status: false,
        message: "Invalid OTP"
      });
    }

  } catch (error) {
    logger.error(["error in userController > otpVerificatio", error.message])
    reply.code(500).send({
      status: false,
      message: error.message
    })
  }
};

const changePassword = async (request, reply) => {
  try {
    const userData = request.body;
    const { error } = validateEmailAndPassword.validate(userData);
    if (error) {
      return reply.code(403).send({
        status: false,
        message: error.details[0].message
      })
    };
    const updatePassword = await passwordChange(userData);
    reply.code(200).send({
      status: true,
      message: "update password sucessfully"
    })
    // logger.info([ "update password in userController > ", updatePassword ]);
  } catch (error) {
    reply.code(500).send({
      status: false,
      message: error.message
    })
  }
}

const profileUpdateHandler = async (request, reply) => {
  try {
    const requestedData = request?.body;
    const { error } = updateProfileValidation.validate(requestedData);
    if (error) {
      return reply.code(403).send({
        status: false,
        message: error.details[0].message
      })
    };
    const result = await profileUpdateService(requestedData);

    logger.info("updated result: ",result)
    reply.code(200).send(result)

  } catch (err) {
    reply.code(500).send({
      status: false,
      message: err.message
    })
  }
}

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
      message : sentMail
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
  passwordResetHandler,
  otpVerification,
  changePassword,
  profileUpdateHandler,
  ContactUS,
 

};
