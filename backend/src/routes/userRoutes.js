const { default: passport } = require("@fastify/passport");
const {
  createStudent,
  getAllUsers,
  login,
  GoggleLoginCallBAck,
  EmailVerify,
  ContactUS,
  passwordResetHandler,
  otpVerification,
  changePassword,
  profileUpdateHandler,
} = require("../controllers/userController");
const { ValidateUser, userSwaggerSchema, loginSchema, updateProfileSchema, changePasswordSchema, verifyEmailSchema, passwordResetSchema, otpVerificationSchema, googleAuthSchema, googleAuthCallbackSchema, getAllUsersSchema } = require("../Schema/userSchema");
const { contactUsSchema } = require("../Schema/contactUsSchema.js")
const userRoutes = async (fastify, options) => {
  //signup as student
  fastify.post("/signup", userSwaggerSchema, createStudent);
  fastify.get("/verify-email", verifyEmailSchema, EmailVerify);

  //get all students
  fastify.get("/users", getAllUsersSchema, getAllUsers);

  //signin as student
  fastify.post("/login", loginSchema, login);

  //sign in with google
  fastify.get("/auth/google", googleAuthSchema, passport.authenticate("google", { scope: ["profile", "email"] }));
  fastify.get("/auth/google/callback", { preValidation: passport.authenticate("google", { scope: ["profile"] }) }, GoggleLoginCallBAck, googleAuthCallbackSchema);

  //forgot password
  fastify.get("/password-reset", passwordResetSchema, passwordResetHandler);
  fastify.get("/otp-verification", otpVerificationSchema, otpVerification);
  fastify.post("/change-password", changePasswordSchema, changePassword);

  //update profile
  fastify.post("/update-profile", updateProfileSchema, profileUpdateHandler);

  //Contact Us
  fastify.post("/contact-us", contactUsSchema, ContactUS);
};

module.exports = userRoutes;
