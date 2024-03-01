const {
  postUser,
  FindAllUsers,
  Login,
  GoogleLogin,
  GoggleLoginCallBAck,
  EmailVerify,
  ContactUS,
} = require("../controllers/userController");
const dotenv = require("dotenv");

dotenv.config();

const userRoutes = async (fastify, options) => {
  // Define routes
  fastify.post("/create-user", postUser);
  fastify.get("/users", FindAllUsers);
  fastify.post("/login", Login);

  fastify.get("/auth/google", GoogleLogin);
  fastify.get("/auth/google/callback", GoggleLoginCallBAck);

  fastify.get("/verify-email", EmailVerify);

  //Contact Us
  fastify.post("/contact-us", ContactUS);
};

module.exports = userRoutes;
