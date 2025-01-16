const router = require("express").Router();
const {
  handleAsyncError,
  AppError,
  isValidUser,
} = require("../middlewares/middleware");
const videoControllers = require("../controllers/videoControllers");
router.get(
  "/",
  handleAsyncError(async (req, res) => {
    // const response = await videoControllers.getObject({
    //   Bucket: "chokhaniyash-streambridge-hls-transcoded",
    //   Key: "ShangChi.mp4",
    // });
    // if (response.message) res.send(response.message);
    // else {
    //   res.set("content-type", response.ContentType);
    //   response.Body.pipe(res);
    // }
    res.send("Hello from Video Route");
  })
);
router.post(
  "/upload",
  // isValidUser,
  handleAsyncError(async (req, res) => {
    const { contentType, userId } = req.body;
    if (contentType !== "video/mp4")
      throw new AppError("Only Mp4 files are allowed", 400);
    const key = `${userId}_${new Date().toISOString()}.${
      contentType.split("/")[1]
    }`;
    const url = await videoControllers.preSignedUploadUrl({
      key,
    });
    res.status(200).send({
      success: true,
      message: "upload using the following url and key within 60 minutes",
      data: { key, url },
    });
  })
);

module.exports = router;
