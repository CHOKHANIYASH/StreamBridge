require("dotenv").config();

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const ffmpeg = require("fluent-ffmpeg");
const { exit } = require("node:process");
const resolutions = [
  { name: "1080p", width: 1920, height: 1080 },
  { name: "720p", width: 1280, height: 720 },
  { name: "480p", width: 854, height: 480 },
  { name: "360p", width: 640, height: 360 },
];
const { getObject, putObject, deleteObject } = require("./s3");

async function transcoder() {
  const Key = process.env.OBJECT_KEY;
  const Bucket = process.env.UPLOAD_BUCKET;
  const bufferBucket = process.env.BUFFER_BUCKET;
  console.log("Hello from Transcoder");

  // extract the video from Bucket
  const filePath = path.join(__dirname, "videos", Key); // Adjusted file path
  const video = await getObject({ Bucket: bufferBucket, Key });
  await new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(filePath);
    video.Body.pipe(writeStream); // Pipe the S3 object to the file write stream

    // Handle the "finish" event when the file is completely written
    writeStream.on("finish", () => {
      console.log(`File successfully downloaded to ${filePath}`);
      resolve(); // Resolve the promise
    });

    // Handle errors during the stream
    writeStream.on("error", (err) => {
      console.error(`Error writing file to ${filePath}:`, err);
      reject(err); // Reject the promise
    });
  });

  // Transcode the Video
  const transcodePromises = resolutions.map((resolution) => {
    return new Promise((resolve, reject) => {
      const outputDir = path.join(
        __dirname,
        "videos",
        "transcoded",
        resolution.name
      );
      const playlist = path.join(outputDir, "index.m3u8");

      // Ensure the output directory exists
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      if (fs.existsSync(filePath)) {
        console.log("File exists!");
      } else {
        console.log("File does not exist at the path:", filePath);
      }
      ffmpeg(filePath)
        .outputOptions([
          `-vf scale=${resolution.width}:${resolution.height}`, // Resize
          "-c:v libx264", // Use H.264 codec for video
          "-c:a aac", // Use AAC codec for audio
          "-strict -2", // Strict mode for compatibility
          "-hls_time 10", // 10-second segments
          "-hls_playlist_type vod", // Video on Demand HLS
        ])
        .output(playlist)
        .on("end", () => {
          console.log(`HLS transcoding finished for ${resolution.name}`);
          resolve(playlist);
        })
        .on("error", (err) => {
          console.error(`Error transcoding ${resolution.name}:`, err.message);
          reject(err);
        })
        .run();
    });
  });

  // Execute all Transcode promises
  await Promise.all(transcodePromises).then(() => {
    console.log("Transcoding done");
  });

  // Upload the Transcoded Video to the Bucket
  const uploadPromises = resolutions.map((resolution) => {
    return new Promise(async (resolve, reject) => {
      try {
        const outputDir = path.join(
          __dirname,
          "videos",
          "transcoded",
          resolution.name
        );
        const files = fs.readdirSync(outputDir);
        // Wait for all putObject calls to complete
        await Promise.all(
          files.map(async (filename) => {
            console.log("Hello from upload ", filename);
            await putObject({
              Bucket,
              Key: `${Key}/${resolution.name}/${filename}`,
              path: path.join(outputDir, filename),
            });
          })
        );
        resolve();
      } catch (err) {
        console.log("error uploading videos", err);
        throw err;
      }
    });
  });

  // Execute all Upload promises
  await Promise.all(uploadPromises).then(async () => {
    console.log("Uploading Done Successfully");
  });
  await putObject({
    Bucket,
    Key: `${Key}/master.m3u8`,
    path: path.join(__dirname, "master.m3u8"),
  });

  // delete video from buffer bucket
  await deleteObject({ Bucket: bufferBucket, Key });
  await axios.post(`${process.env.SERVER_URL}/video/success`, {
    key: Key,
    adminCode: process.env.ADMIN_CODE,
  });

  // call lambda function for success
}
transcoder()
  .then(() => {
    console.log("transcoding done successfully");
  })
  .catch(async (err) => {
    console.error("Error occurred:", err);
    await axios.post(`${process.env.SERVER_URL}/video/fail`, {
      key: Key,
      adminCode: process.env.ADMIN_CODE,
    });
  })
  .finally(() => {
    process.exit(0);
  });
