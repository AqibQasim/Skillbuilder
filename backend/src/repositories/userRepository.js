const { logger } = require("../../logger");
const dataSource = require("../../Infrastructure/postgres");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const Redis = require("ioredis");
const { googleClient } = require("../Authentication/googleAuth");
const redis = new Redis();

const verificationTokens = {};

const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "fa21bscs0017@maju.edu.pk",
        pass: "ncld ucwk kfac hzvh",
      },
    });

    const mailOptions = {
      from: "fa21bscs0017@maju.edu.pk",
      to: email,
      subject: "Email Verification",
      html: `<a href="http://localhost:3000/verify-email?email=${email}&verificationToken=${verificationToken}>Verify your email</a>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully.");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

const createUser = async (userInfo) => {
  const userRepository = dataSource.getRepository("User");

  try {
    const { email } = userInfo;
    const existingUser = await userRepository.findOne({ where: { email } });

    if (existingUser) {
      return "User Already Exists With This Email";
    } else {
      const verificationToken = uuidv4();
      verificationTokens[email] = verificationToken;
      await redis.set(email, verificationToken);

      const user = userRepository.create(userInfo);

      await sendVerificationEmail(email, verificationToken);
      const token = generateToken(user.id, email);

      userInfo.password = undefined;

      await userRepository.save(user);

      return "Verification email sent. Please verify your email to complete the registration.";
    }
  } catch (error) {
    console.error("Error while creating user:", error);
    throw error;
  }
};

const generateToken = (userId, email) => {
  return jwt.sign({ id: userId, email: email }, "shhhh", {
    expiresIn: "2h",
  });
};

const findUser = async () => {
  try {
    const userRepository = dataSource.getRepository("User");
    const user = await userRepository.find();
    return user;
  } catch (error) {
    console.error("Error fetching users:", error);

    throw error;
  }
};

const LoginUser = async (userInfo) => {
  const userRepository = dataSource.getRepository("User");
  try {
    const { email, password } = userInfo;
    const existingUser = await userRepository.findOne({ where: { email } });

    if (existingUser) {
      const passwordMatch = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (passwordMatch) {
        const Token = jwt.sign({ id: userInfo.id, email: email }, "shhhh", {
          expiresIn: "2h",
        });
        userInfo.Token = Token;
        userInfo.password = undefined;

        //cookie section
        const option = {
          headers: {
            "Set-Cookie": cookie.serialize("token", Token, {
              expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
              httpOnly: true,
            }),
          },
        };
        const user = "User Login Successfully";

        return { user, Token, option };
      } else {
        return "Incorrect Password";
      }
    } else {
      return "User Does Not Exist";
    }
  } catch (error) {
    console.error("Error during login:", error);
    throw new Error("Login failed");
  }
};

const LogWithGoogle = () => {
  const Url = googleClient.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
  });
  console.log("Url ", Url);
  return Url;
};

const AfterGoogleLoginRedirect = async (code) => {
  try {
    const userRepository = dataSource.getRepository("User");

    const { tokens } = await googleClient.getToken(code);

    console.log("Token ", tokens);

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience:
        "310731438548-cfvtaihk2d1pnbkhta66hffn525l96vr.apps.googleusercontent.com",
    });

    console.log("Ticket ", ticket);
    const payload = ticket.getPayload();
    console.log("Payload ", payload);
    const { name, email, email_verified, at_hash } = payload;

    const existingUser = await userRepository.findOne({
      where: { email: email },
    });

    if (existingUser) {
      return `Hello ${name} Wellcome TO Tixsee`;
    }
    const newUser = userRepository.create({
      name: name,
      email: email,
      verified: email_verified,
      password: at_hash,
    });

    const savedUser = await userRepository.save(newUser);
    console.log("Saved Usr", savedUser);

    return IfLoginRedirect(ticket);
  } catch (error) {
    console.error("Error in AfterGoogleLoginRedirect:", error.message);
    throw new Error("An error occurred while processing Google login.");
  }
};

const IfLoginRedirect = async (ticket) => {
  const payload = ticket.getPayload();
  const { name } = payload;
  return `Hello ${name}, Welcome to 360Xpert Solution!`;
};

const UserContact = async (userInfo) => {
  const userRepository = dataSource.getRepository("Contact_us");
  console.log("User REpo", userRepository);

  try {
    const user = userRepository.create(userInfo);
    console.log("Users", user);
    const savedUser = await userRepository.save(user);
    return savedUser;
  } catch (error) {
    console.error("Error while creating user:", error);
    throw error;
  }
};

module.exports = {
  createUser,
  findUser,
  LoginUser,
  LogWithGoogle,
  AfterGoogleLoginRedirect,
  IfLoginRedirect,
  UserContact,
};
