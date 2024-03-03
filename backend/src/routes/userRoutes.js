const { postUser, getAllUsers, login, GoogleLogin, GoggleLoginCallBAck, EmailVerify, ContactUS} = require("../controllers/userController");


const userRoutes = async (fastify, options) => {
  // Define routes
  fastify.post("/user", postUser);//update
  fastify.get("/users", getAllUsers);//update
  fastify.post("/login", login);//update

  fastify.get("/auth/google", GoogleLogin);
  fastify.get("/auth/google/callback", GoggleLoginCallBAck);

  fastify.get("/verify-email", EmailVerify);

  //Contact Us
  fastify.post("/contact-us", ContactUS);
};

module.exports = userRoutes;
