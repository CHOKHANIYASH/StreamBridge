const { s3Client } = require("../aws/clients");
const {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const preSignedUploadUrl = async ({ key }) => {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUFFER_BUCKET,
    Key: key,
  });
  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });
  return presignedUrl;
};

module.exports = { preSignedUploadUrl };
