const { S3 } = require("aws-sdk");
// import fs from "node:fs";
// import { promisify } from "node:util";
// import { pipeline } from "node:stream";

const s3Client = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  signatureVersion: 'v4'
});

module.exports = { s3Client };
