// <<<<<<< HEAD
// const { createUser, readAllUser, findUser, UserContact, updateUserByEmail, updateUserById } = require("../repositories/userRepository");
// =======
// <<<<<<< HEAD
// const {
//   createUser,
//   readAllUser,
//   findUser,
//   UserContact,
//   updateUserByEmail,
//   updateUserById,
//   addToCartDb
// } = require("../repositories/userRepository");


// =======
const { createUser, readAllUser, findUser, UserContact, updateUserByEmail, updateUserById } = require("../repositories/userRepository");
// >>>>>>> 7635d92 (add courses apis and much work)
// >>>>>>> c25baf8
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { logger } = require("../../logger");
const { redisClient } = require("../../Infrastructure/redis");
const { sendVerificationEmail, verifyPassword, sendOTPMail } = require("../mediators/userMediator");

const emailVerificationForRegister = async (userInfo) => {
  try {
    console.log('user info:', userInfo);
    console.log("Hey2");
    const { email } = userInfo;
    const existingUser = await findUser({ where: { email } });
    if (existingUser) {
      throw Error("User Already Exists With This Email");
    }

    const verificationToken = jwt.sign(userInfo, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });

    logger.info(["src > repository > userRepository > verificationToken", verificationToken]);
    await redisClient.set(email, verificationToken);
    await sendVerificationEmail(email, verificationToken);
  } catch (err) {
    console.log("error:", err);
  }
};

const createUserAfterVerification = async (verificationToken) => {
  try {
    const tokenData = jwt.decode(verificationToken, process.env.JWT_SECRET);  
    console.log("userdata: ", tokenData);
    const isUserExist = await findUser({ where: { email: tokenData?.email } });
    if (isUserExist) {
      logger.info(["user already exists", isUserExist]);
      throw Error("User already exist with this email");
      
    }
    const hashedPassword = await bcrypt.hash(tokenData?.password, 10);
    const currentTime = new Date();
    console.log("currentTime: ", currentTime);
    const userData = { ...tokenData, password: hashedPassword, created_at: currentTime };
    let newUser = await createUser(userData);
    let token = jwt.sign(newUser, process.env.JWT_SECRET);
    return token;
  } catch (err){
    console.log('error:',err);
    return;
  }
};

const findAllUser = async () => {
  try {
    const data = await readAllUser();
    return data;
  } catch (error) {
    logger.error(error.message);
    throw Error(error);
  }
};

const UserLogin = async (loginData) => {
  try {
    const { email, password } = loginData;
    const isUserExist = await findUser({
      where: { email: email },
    });
    logger.info(["src > services > userService > UserLogin ? existingUser: ", isUserExist]);
    if (!isUserExist) {
      throw Error("User does not exist");
    }

    const passwordVerification = await verifyPassword(password, isUserExist);
    console.log("password verification: ", passwordVerification);

    return passwordVerification;
  } catch (error) {
    logger.error(error.message);
    throw Error(error);
  }
};

const createGoogleUser = async (userInfo) => {
  try {
    const { email } = userInfo;
    const existingUser = await findUser({ where: { email } });
    if (!existingUser) {
      let newUser = await createUser(userInfo);
      // let token = jwt.sign(newUser, process.env.JWT_SECRET);
      // return token;
    }
  } catch (error) {
    logger.error(["src > services > userService > 21", error.message]);
  }
};

const findUserByEmail = async (email) => {
  try {
    const filter = {
      where: {
        email: email,
      },
    };
    const result = await findUser(filter);
    return result;
  } catch (error) {
    logger.error(["error in fetching user by email in userService", error.message]);
    throw Error(error?.message);
  }
};

const findUserById = async (id) => {
  try {
    const filter = {
      where: {
        id: id,
      },
    };
    const result = await findUser(filter);
    return result;
  } catch (error) {
    logger.error(["error in fetching user by id in userService", error.message]);
    throw Error(error?.message);
  }
};

const sendMailToUser = async (email) => {
  try {
    await sendOTPMail(email);
  } catch (error) {
    logger.error(["error in userService > sendMailToUser ", error.message]);
  }
};

const passwordChange = async (userData) => {
  try {
    const hashedPassword = await bcrypt.hash(userData?.password, 10);
    const updatedUser = await updateUserByEmail(userData.email, { ...userData, password: hashedPassword });
    console.log(updatedUser);
    return updatedUser;
  } catch (error) {
    logger.error(["error in userService > passwordChange > ", error.message]);
    throw Error(error);
  }
};

const profileUpdateService = async (userData) => {
  try {
    const id = userData?.id;
    if (userData?.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;
    }
    const updatedUser = await updateUserById(id, userData);
    return updatedUser;
  } catch (error) {
    logger.error(["error in userService > profileUpdateService > ", error.message]);
    throw Error(error);
  }
};

const ContactUser = async (userInfo) => {
  try {
    const ContactUs = await UserContact(userInfo);
    console.log("Contact Us in Service ", ContactUs);
    if (ContactUs) {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });

      const UsermailOptions = {
        from: process.env.MAIL_USER,
        to: `${userInfo.email}`,
        subject: `Message From SkillBuilder`,
        html: `<h3>Hello ${userInfo.firstName} ${userInfo.lastName},</h3>
                 <p>Thank you for contacting us. We have received your email. Our team will review it shortly and contact you as soon as possible.</p>`,
      };
      const AdminmailOptions = {
        from: `${userInfo.email}`,
        to: `${process.env.MAIL_USER} }  `,
        subject: `${userInfo.subject}`,
        html: `<h3>New Message From ${userInfo.firstName} ${userInfo.lastName},</h3>
               <p>${userInfo.text}</p>`,
      };

      await transporter.sendMail(UsermailOptions);
      await transporter.sendMail(AdminmailOptions);
      logger.info(`Email Successfully Send to ${userInfo.email}`);
      return ContactUs;
    }
  } catch (error) {
    logger.error("Error sending verification email:", error);
    throw error;
  }
};




module.exports = {
  createGoogleUser,
  emailVerificationForRegister,
  createUserAfterVerification,
  findAllUser,
  UserLogin,
  findUserByEmail,
  findUserById,
  sendMailToUser,
  passwordChange,
  profileUpdateService,
  ContactUser,
};
