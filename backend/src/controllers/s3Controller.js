const { logger } = require("../../logger");
const { uploadSingle, getSignedUrl, getObject, deleteFile } = require("../mediators/s3Mediator");

const getSignedUrlFromS3 = async (request, reply) => {
  try {
    const uploadingFile = await request.file();
    const module = request.query.module;
    console.log("module: ", module);
    const fileUrl = await getSignedUrl({ ...uploadingFile, module });
    reply.code(200).send({
      status: true,
      message: "success",
      data: fileUrl,
    });
  } catch (error) {
    logger.error("src > controllers > getSignedUrlFromS3 > error");
    logger.error(error);
    reply.code(500).send({
      status: false,
      message: error.message,
    });
  }
};

const getItemFromS3 = async (request, reply) => {
  try {
    const fileName = request.params.key;
    console.log("file", fileName);
    const object = await getObject(fileName);
    reply.code(200).send({
      status: true,
      message: "success",
      data: object,
    });
  } catch (error) {
    reply.code(500).send({
      status: false,
      message: error.message,
    });
  }
};

const removeItemFromS3 = async (request, reply) => {
  const fileName = request.params.key;
  try {
    const reponse = await deleteFile(fileName);
    reply.code(200).send({ 
      status: true,
      message: "success",
      data: reponse
    });
  } catch (error) {
    reply.code(500).send({
      status: false,
      message: error.message,
    });
  }
};

const postOnS3 = async (request, reply ) => {
  try {
    const uploadingFile = await request.file();
    console.log("uploading file", uploadingFile);
    // const module = request.query.module;
    const fileUrl = await uploadSingle(uploadingFile);
    reply.code(200).send({
      status: true,
      message: "file uploaded successfully",
      data: fileUrl,
    });
  } catch (error) {
    logger.error("src > controllers > uploadS3Controller > error")
    logger.error(error)
    reply.code(500).send({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  postOnS3,
  getSignedUrlFromS3,
  getItemFromS3,
  removeItemFromS3,
};
