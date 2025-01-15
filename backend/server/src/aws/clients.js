const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { S3Client } = require("@aws-sdk/client-s3");
const { SESClient } = require("@aws-sdk/client-ses");
const dynamodbClient = new DynamoDBClient({
  region: "ap-south-1",
});
const s3Client = new S3Client({
  region: "ap-south-1",
});
const sesClient = new SESClient({
  region: "ap-south-1",
});

module.exports = { dynamodbClient, s3Client, sesClient };
