const { createUser, readAllUser, findUser, LoginUser, UserContact, } = require("../repositories/userRepository");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { logger } = require("../../logger");
const { redisClient } = require("../../Infrastructure/redis");
const { sendVerificationEmail, verifyPassword } = require("../mediators/userMediator");


const emailVerificationForRegister = async (userInfo) => {
  const { email } = userInfo;
  const existingUser = await findUser({ where: { email } });
  if (existingUser) {
    throw Error("User Already Exists With This Email");
  }

  const verificationToken = jwt.sign(userInfo, process.env.JWT_SECRET, { expiresIn: '1h' });
  logger.info(['src > repository > userRepository > verificationToken', verificationToken]);
  await redisClient.set(email, verificationToken);
  await sendVerificationEmail(email, verificationToken);
};

const createUserAfterVerification = async (verificationToken) => {
  const tokenData = jwt.decode(verificationToken, process.env.JWT_SECRET)
  console.log("userdata: ", tokenData);
  const isUserExist = await findUser({ where: { email: tokenData?.email } })
  if (isUserExist) {
    logger.info(["user already exists", isUserExist])
    throw Error("User already exist with this email")
  }
  const hashedPassword = await bcrypt.hash(tokenData?.password, 10);
  const userData = { ...tokenData, password: hashedPassword };
  let newUser = await createUser(userData);
  let token = jwt.sign(newUser, process.env.JWT_SECRET);
  return token;
}

const findAllUser = async () => {
  try {
    const data = await readAllUser();
    return data;
  } catch (error) {
    logger.error(error.message)
    throw Error(error) 
  }
};

const UserLogin = async (loginData) => {
  try {
    const { email, password } = loginData;
    const isUserExist = await findUser({
      where: { email: email }
    })
    logger.info(["src > services > userService > UserLogin ? existingUser: ", isUserExist])
    if (!isUserExist) {
      throw Error("User does not exist")
    }

    const passwordVerification = await verifyPassword(password, isUserExist);
    console.log("password verification: ",passwordVerification);

    return passwordVerification;

  } catch (error) {
    logger.error(error.message)
    throw Error(error);
  }
  // return await LoginUser(loginData);
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
    logger.error(['src > services > userService > 21', error.message])
  }
}

const ContactUser = async (userInfo) => {
  try {
    const ContactUs = await UserContact(userInfo);
    console.log("Contact Us in Service ", ContactUs);
    if (ContactUs) {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "fa21bscs0017@maju.edu.pk",
          pass: "ncld ucwk kfac hzvh",
        },
      });

      const UsermailOptions = {
        from: "fa21bscs0017@maju.edu.pk",
        to: `${userInfo.email} }  `,
        subject: `Message From SkillBuilder`,
        html: `<p>Hello ${userInfo.FirstName} ${userInfo.LastName},</p>
                 <p>Thank you for contacting us. We have received your email. Our team will review it shortly and contact you as soon as possible.</p>`,
      };
      const AdminmailOptions = {
        from: `${userInfo.email}`,
        to: `${"rajaasgharali009@gmail.com"} }  `,
        subject: `${userInfo.Subject}`,
        html: `<p>New Message From${userInfo.FirstName} ${userInfo.LastName},</p>
               <p>${userInfo.Text}</p>`,
      };
      console.log("AdminMail", AdminmailOptions);

      await transporter.sendMail(UsermailOptions);
      await transporter.sendMail(AdminmailOptions);
      console.log(
        `Email Successfully Send t0 ${userInfo.email
        } ${"rajaasgharali009@gmail.com"}`
      );
      return ContactUs;
    }
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

module.exports = {
  createGoogleUser,
  emailVerificationForRegister,
  createUserAfterVerification,
  findAllUser,
  UserLogin,
  ContactUser,
};
