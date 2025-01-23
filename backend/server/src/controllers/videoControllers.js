const { s3Client, dynamodbClient } = require("../aws/clients");
const {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
} = require("@aws-sdk/client-s3");
const {
  PutItemCommand,
  GetItemCommand,
  QueryCommand,
  DeleteItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { unmarshall } = require("@aws-sdk/util-dynamodb");
const { format } = require("date-fns");
const { AppError } = require("../middlewares/middleware");

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

const getUserVideos = async ({ userId }) => {
  console.log(userId);
  const command = new QueryCommand({
    TableName: "streambridge_videos",
    IndexName: "userId-index",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": { S: userId },
    },
    ScanIndexForward: false,
  });

  const response = await dynamodbClient.send(command);
  const arr = response.Items;
  videos = arr.map((video) => {
    return unmarshall(video);
  });
  return {
    status: 200,
    response: {
      success: true,
      message: "User Videos found",
      data: { videos },
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
  const createdAt = format(new Date(), "yyyy-MM-dd HH:mm:ss");
  const putCommand = new PutItemCommand({
    TableName: "streambridge_videos",
    Item: {
      id: { S: key },
      name: { S: video.name },
      userId: { S: user.id },
      username: { S: user.firstName },
      url: { S: url },
      createdAt: { S: createdAt },
    },
  });
  const putResponse = await dynamodbClient.send(putCommand);
  const deleteCommand = new DeleteItemCommand({
    TableName: "streambridge_buffer",
    Key: { videoId: { S: key } },
  });
  const deleteResponse = await dynamodbClient.send(deleteCommand);
  return { url, email: user.email };
};

const deleteVideo = async ({ videoId }) => {
  const command = new GetItemCommand({
    TableName: "streambridge_videos",
    Key: { id: { S: videoId } },
  });
  const response = await dynamodbClient.send(command);
  if (!response.Item) {
    throw new AppError("Video not found", 404);
  }
  const deleteObjectCommand = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: videoId,
  });
  const deleteObjectResponse = await s3Client.send(deleteObjectCommand);
  const deleteDbCommand = new DeleteItemCommand({
    TableName: "streambridge_videos",
    Key: { id: { S: videoId } },
  });
  const dbResponse = await dynamodbClient.send(deleteDbCommand);
  return {
    status: 200,
    response: {
      success: true,
      message: "Video Deleted Successfully",
      data: {},
    },
  };
};

module.exports = {
  preSignedUploadUrl,
  addVideoBuffer,
  addVideo,
  getVideo,
  getUserVideos,
  deleteVideo,
};
