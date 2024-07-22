const { default: passport } = require("@fastify/passport");
const { googleAPICallBack, uploadInstVideo, fetchVideos , } = require("../controllers/ytAPIControllers");
// const multer = require('fastify-multer');
// const upload = multer({ dest: 'uploads/' });


// const { ValidateUser, userSwaggerSchema } = require("../Schema/userSchema");

const ytRoutes = async (fastify, options) => {
  fastify.get("/oauth2callback", googleAPICallBack);
  
  fastify.get("/videos", fetchVideos);
};

module.exports = ytRoutes;
