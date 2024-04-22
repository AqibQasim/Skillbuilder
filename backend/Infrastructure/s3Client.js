const { S3Client } = require("@aws-sdk/client-s3");
// import fs from "node:fs";
// import { promisify } from "node:util";
// import { pipeline } from "node:stream";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

module.exports = { s3 };
