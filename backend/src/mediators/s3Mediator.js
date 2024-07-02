const { s3Client } = require("../../Infrastructure/s3Client");
// const {} = require("aws-sdk");
const { logger } = require("../../logger");

const BUCKET_NAME = process.env.AWS_BUCKET;
const AwsRegion = process.env.AWS_REGION;

const getSignedUrl = async (file) => {
  const { data, filename, mimetype } = file;
  console.log("getSignedUrlFile: ", file);
  const uniqueName = `module${file?.module}-${Date.now()}-${Math.round(Math.random() * 1e3)}`;
  const params = {
    Bucket: BUCKET_NAME,
    Key: uniqueName.toString(),
    Expires: 300,
    ContentType: mimetype,
  };
  const signedUrl = await s3Client.getSignedUrl("putObject", params);
  logger.info("signed url: ", signedUrl)
  return signedUrl;
};

const getObject = async (fileKey) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileKey
  };

  return s3Client.getObject(params).createReadStream();
};

const uploadSingle = async (fileData) => {
  console.log("fileData:", fileData);
  const file = await fileData.toBuffer();
  console.log("fileBuffer", file);
  const { filename, mimetype } = fileData;

  const uniqueName = `${Date.now() + Math.round(Math.random() * 1e3)}-${filename}`;
  console.log("file name: ", uniqueName);

  const putObjectCommand = {
    Bucket: BUCKET_NAME,
    Key: uniqueName.toString(),
    Body: file,
    ContentType: mimetype,
    // ACL: "public-read"
  };
  const upload = await s3Client.upload(putObjectCommand).promise();
  if (upload) {
    return uniqueName;
  };
  // if (upload) {
  //   const bucketName = process.env.AWS_BUCKET;
  //   const awsRegion = process.env.AWS_REGION;
  //   const video_url = `https://${bucketName}.s3.${awsRegion}.amazonaws.com/${uniqueName}`;
  //   return video_url;
  // }
};

const deleteFile = async (fileKey) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileKey
  };

  return s3Client.deleteObject(params).promise();
};

module.exports = {
  // uploadMultipleFilesOnS3,
  getSignedUrl,
  getObject,
  uploadSingle,
  deleteFile
};
