const { s3Client, dynamodbClient } = require("../aws/clients");
const {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
} = require("@aws-sdk/client-s3");
const { PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { unmarshall } = require("@aws-sdk/util-dynamodb");

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

const addVideoBuffer = async ({ videoId, userId, name, email }) => {
  const command = new PutItemCommand({
    TableName: "streambridge_buffer",
    Item: {
      videoId: { S: videoId },
      userId: { S: userId },
      // email: { S: email },
      name: { S: name },
    },
  });
  const response = await dynamodbClient.send(command);
  return;
};

const getVideo = async ({ videoId }) => {
  const command = new GetItemCommand({
    TableName: "streambridge_videos",
    Key: { id: { S: videoId } },
  });
  const response = await dynamodbClient.send(command);
  if (!response.Item) {
    throw new AppError("Video not found", 404);
  }
  const video = unmarshall(response.Item);
  return {
    status: 200,
    response: {
      success: true,
      message: "Video found",
      data: { video },
    },
  };
};

const getObjectUrl = async ({ Key }) => {
  const s3ObjectUrl = `${process.env.CLOUDFRONT_URL}/${Key}`;
  return s3ObjectUrl;
};
const addVideo = async ({ key }) => {
  const command = new GetItemCommand({
    TableName: "streambridge_buffer",
    Key: { videoId: { S: key } },
  });
  const response = await dynamodbClient.send(command);
  if (!response.Item) {
    throw new AppError("Video not found", 404);
  }
  const video = unmarshall(response.Item);
  const userId = video.userId;
  const userCommand = new GetItemCommand({
    TableName: "streambridge_user",
    Key: { id: { S: userId } },
  });
  const userResponse = await dynamodbClient.send(userCommand);
  const user = unmarshall(userResponse.Item);
  const url = await getObjectUrl({ Key: key });
  const putCommand = new PutItemCommand({
    TableName: "streambridge_videos",
    Item: {
      id: { S: key },
      name: { S: video.name },
      userId: { S: user.id },
      userName: { S: user.firstname },
      url: { S: url },
    },
  });
  const putResponse = await dynamodbClient.send(putCommand);
  return { url, email: user.email };
};
module.exports = {
  preSignedUploadUrl,
  addVideoBuffer,
  addVideo,
  getVideo,
};
