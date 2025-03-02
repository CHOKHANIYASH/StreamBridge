const router = require("express").Router();
const {
  handleAsyncError,
  AppError,
  isValidUser,
  isAdmin,
} = require("../middlewares/middleware");
const videoControllers = require("../controllers/videoControllers");
const userController = require("../controllers/userControllers");
const short = require("short-uuid");
const { successMail } = require("../middlewares/email");

router.get(
  "/",
  handleAsyncError(async (req, res) => {
    res.send("Hello from Video Route");
  })
);

router.get(
  "/user/:userId",
  isValidUser,
  handleAsyncError(async (req, res) => {
    const { userId } = req.params;
    const { response, status } = await videoControllers.getUserVideos({
      userId,
    });
    res.status(status).send(response);
  })
);

router.get(
  "/:videoId",
  handleAsyncError(async (req, res) => {
    const { videoId } = req.params;
    const { response, status } = await videoControllers.getVideo({ videoId });
    res.status(status).send(response);
  })
);

router.post(
  "/upload",
  isValidUser,
  handleAsyncError(async (req, res) => {
    const { contentType, userId, name, email } = req.body;
    if (!userId) throw new AppError("User not found", 404);
    if (contentType !== "video/mp4")
      throw new AppError("Only Mp4 files are allowed", 400);
    const key = `${short.generate()}.${contentType.split("/")[1]}`;
    const url = await videoControllers.preSignedUploadUrl({
      key,
    });
    const videoId = key;
    await videoControllers.addVideoBuffer({ videoId, name, userId, email });
    res.status(200).send({
      success: true,
      message: "upload using the following url within 60 minutes",
      data: { key, url },
    });
  })
);

router.post(
  "/delete/:videoId",
  isValidUser,
  handleAsyncError(async (req, res) => {
    const { videoId } = req.params;
    const { response, status } = await videoControllers.deleteVideo({
      videoId,
    });
    res.status(status).send(response);
  })
);

router.post(
  "/success",
  isAdmin,
  handleAsyncError(async (req, res) => {
    const { key } = req.body;
    console.log(key);
    const { email, url, name } = await videoControllers.addVideo({ key });
    await successMail(email, name);
    res
      .status(200)
      .send({
        success: true,
        message: "Video transcoding completed and Email send successfully",
      });
  })
);

router.post(
  "/fail",
  isAdmin,
  handleAsyncError(async (req, res) => {})
);

module.exports = router;
