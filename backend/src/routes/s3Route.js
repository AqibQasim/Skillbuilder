const { getSignedUrlFromS3, getItemFromS3, removeItemFromS3, postOnS3 } = require("../controllers/s3Controller");

const s3Routes = async (fastify, options) => {
  fastify.post("/s3-presigned-url", getSignedUrlFromS3);
  fastify.post("/s3-upload", postOnS3);
  fastify.get("/s3-get/:key", getItemFromS3);
  fastify.delete("/s3-delete/:key", removeItemFromS3)
};

module.exports = s3Routes;
