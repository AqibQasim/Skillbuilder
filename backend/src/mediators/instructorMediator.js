const {s3} = require("../../Infrastructure/s3Client");
const { PutObjectCommand, } =  require("@aws-sdk/client-s3");
// const { logger } = require("../../logger");


const uploadOnS3 = async (files) => {
  for (const file of files) {
    const { data, filename, mimetype } = file;
    console.log("file", file);

    const uniqueName = Date.now() + Math.round(Math.random() * 1e3);
    console.log("unique name: ", uniqueName);

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: uniqueName.toString(),
      Body: data,
      ContentType: mimetype,
    });
    const upload = await s3.send(putObjectCommand);
    if(upload){
        const bucketName = process.env.AWS_BUCKET;
        const awsRegion = process.env.AWS_REGION;
        const video_url = `https://${bucketName}.s3.${awsRegion}.amazonaws.com/${uniqueName}`;
        return video_url;
    }
  }
};


module.exports = {
    uploadOnS3
}
