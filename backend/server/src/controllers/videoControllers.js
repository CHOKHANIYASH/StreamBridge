const { s3Client, dynamodbClient } = require("../aws/clients");
const {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
} = require("@aws-sdk/client-s3");
const { PutItemCommand } = require("@aws-sdk/client-dynamodb");
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

const addVideoBuffer = async ({ videoId, userId, name }) => {
  const command = new PutItemCommand({
    TableName: "streambridge_buffer",
    Item: {
      videoId: { S: videoId },
      userId: { S: userId },
      name: { S: name },
    },
  });
  const response = await dynamodbClient.send(command);
  return;
};

module.exports = { preSignedUploadUrl, addVideoBuffer };
