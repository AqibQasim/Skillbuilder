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

  getOneUser,

  sendEmail,

  enrollInCourse,

  getStudentsByInstructorId,

  SignupGoogleSSO,
  getOneInstCourseStudents,
  getEnrolledStudents,
  setStudentStatus,
  getStudentEnrolledCoursesOnInstructorController,
} = require("../controllers/userController");
const {
  ValidateUser,
  userSwaggerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  verifyEmailSchema,
  passwordResetSchema,
  otpVerificationSchema,
  googleAuthCallbackSchema,
  userEnrollcourseSchema,
  getAllUsersSchema,
  setStudentStatusschema,
} = require("../Schema/userSchema");
const {
  contactUsSchema,
  sendMailSchema,
} = require("../Schema/contactUsSchema.js");

// const { ValidateUser, userSwaggerSchema } = require("../Schema/userSchema");

const userRoutes = async (fastify, options) => {
  //signup as student
  fastify.post("/signup-googleSSO", SignupGoogleSSO )
  fastify.post("/signup", createStudent);
  fastify.get("/verify-email", verifyEmailSchema, EmailVerify);

  //get all students
  fastify.get("/users", getAllUsersSchema, getAllUsers);
  fastify.get("/user/:id", getOneUser);

  //signin as student
  fastify.post("/login", loginSchema, login);

  //sign in with google
  fastify.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  fastify.get(
    "/auth/google/callback",
    {
      preValidation: passport.authenticate("google", {
        failureMessage: {
          status: false,
          message: "google authentication failed",
        },
      }),
    },
    GoggleLoginCallBAck
  );

  //forgot password
  fastify.get("/password-reset", passwordResetSchema, passwordResetHandler);
  fastify.get("/otp-verification", otpVerificationSchema, otpVerification);
  fastify.post("/change-password", changePasswordSchema, changePassword);

  fastify.put("/update-profile", updateProfileSchema, profileUpdateHandler);

  fastify.post("/contact-us", contactUsSchema, ContactUS);
  fastify.post("/send-email", sendMailSchema, sendEmail);
  fastify.put("/enroll-in-course", userEnrollcourseSchema, enrollInCourse);
  fastify.get("/get-students-by-inst", getStudentsByInstructorId);
  fastify.get("/get-one-course-inst-students", getOneInstCourseStudents);
  fastify.get("/get-all-students", getEnrolledStudents);
  fastify.put("/set-student-status", setStudentStatusschema, setStudentStatus);
  fastify.get("/student-enrolled-courses-on-instructor",getStudentEnrolledCoursesOnInstructorController);
};

module.exports = userRoutes;
