const {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: "ap-south-1",
});

const fs = require("fs");

const getObject = async ({ Bucket, Key }) => {
  try {
    const existCommand = new HeadObjectCommand({
      Bucket,
      Key,
    });
    const objectExists = await s3Client.send(existCommand).catch((err) => {
      console.log("Error " + err);
      if (err.name === "NotFound") {
        return false;
      }
    });
    if (!objectExists) return { message: "Object does not exist" };
    const command = new GetObjectCommand({
      Bucket,
      Key: Key,
    });
    const response = await s3Client.send(command);
    return response;
  } catch (error) {
    return error;
  }
};

const putObject = async ({ Bucket, Key, path }) => {
  try {
    // const Body = fs.readFileSync(path);
    const command = new PutObjectCommand({
      Bucket,
      Key,
      Body: await fs.promises.readFile(path),
    });
    const response = await s3Client.send(command);
    // fs.unlinkSync(path);
  } catch (error) {
    // fs.unlinkSync(path);
    throw error;
  }
};

const deleteObject = async ({ Bucket, Key }) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket,
      Key,
    });
    const response = await s3Client.send(command);
    return { message: "Object deleted Successfully" };
  } catch (error) {
    return error;
  }
};

module.exports = { getObject, putObject, deleteObject };
