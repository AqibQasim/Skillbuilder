const { default: passport } = require("@fastify/passport");
const { createStudent, getAllUsers, login, GoggleLoginCallBAck, EmailVerify, ContactUS, passwordResetHandler, otpVerification, changePassword, profileUpdateHandler} = require("../controllers/userController");

const userRoutes = async (fastify, options) => {

  //signup as student
  fastify.post("/signup-student", createStudent);
  fastify.get("/verify-email", EmailVerify);

  //get all students
  fastify.get("/students", getAllUsers);

  //signin as student
  fastify.post("/login-student", login);

  //sign in with google
  fastify.get("/auth/google", passport.authenticate('google', {scope: ['profile', "email"]}));
  fastify.get("/auth/google/callback", {preValidation: passport.authenticate('google',{scope:['profile']})}, GoggleLoginCallBAck);

  //forgot password
  fastify.get("/password-reset", passwordResetHandler);
  fastify.get("/otp-verification", otpVerification);
  fastify.post("/change-password", changePassword)

  //update profile
  fastify.post("/update-profile", profileUpdateHandler)
  
  //Contact Us
  fastify.post("/contact-us", ContactUS);
};

module.exports = userRoutes;
