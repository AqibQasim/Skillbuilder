const nodemailer = require("nodemailer");
const { logger } = require("../../logger");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const randomstring = require('randomstring');
const { redisClient } = require("../../Infrastructure/redis");

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com", // Replace with your Hostinger SMTP server
  port: 465, // Use 587 for TLS or 465 for SSL
  secure: true, // true for SSL
  auth: {
      user: process.env.MAIL_USER, // Your Hostinger email
      pass: process.env.MAIL_PASS, // Your email password
  },
});

const generateOTP = async () => {
  return randomstring.generate({
    length: 6,
    charset: 'numeric'
  });
}

const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Email Verification",
      html: `
      <h1>Click on the link below to verify your email!</h1>
      
      <a href="${process.env.SERVER_BASE_URL}/verify-email?email=${encodeURIComponent(
          email
        )}&token=${verificationToken}">Verify your email</a>`,
    };

    await transporter.sendMail(mailOptions);

    logger.info("Verification email sent successfully.");
    return "Verification email has been sent to your email, please confirm your email."
  } catch (error) {

    logger.error("Error sending verification email:", error);
    return "Unsuccessful to send a verification mail."
  }
};



const verifyPassword = async (password, existingUser) => {
  const passwordMatch = await bcrypt.compare(password, existingUser?.password);
  logger.info(["password matching", passwordMatch]);
  if (!passwordMatch) {
    throw Error("Sorry! your password is incorrect!");
  }
  const tokenPayload = {
    id: existingUser?.id,
    name: existingUser.name,
    email: existingUser.email,
    role: existingUser.role,
    profession: existingUser.profession,
  };
  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);
  const option = {
    headers: {
      "Set-Cookie": cookie.serialize("token", token, {
        // expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      }),
    },
  };

  return { token , user : existingUser , option };
};

const sendOTPMail = async (email) => {
  try {
    const OTP = await generateOTP();
    console.log("generated OTPPPP >>", OTP);
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your OTP",
      html: `<h1> Please enter the below mentioned OTP for reset password </h1> <br> <h2> ${OTP} </h2>`,
    };

    await transporter.sendMail(mailOptions);
    redisClient.set(`otp-${email}`, OTP)

  } catch (error) {
    logger.error(["Error in userMediator > sendOTPMail > ", error.message])
    throw Error(error.message)
  }
};

module.exports = {
  sendVerificationEmail,
  verifyPassword,
  sendOTPMail
};
