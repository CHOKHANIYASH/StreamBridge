const router = require("express").Router();
const {
  handleAsyncError,
  AppError,
  isValidUser,
} = require("../middlewares/middleware");
const userControllers = require("../controllers/userControllers");
const { welcomeMail } = require("../middlewares/email");

router.get(
  "/",
  handleAsyncError(async (req, res) => {
    res.send("Hello from user Route");
  })
);

router.get(
  "/:userId",
  handleAsyncError(async (req, res) => {
    const userId = req.params.userId;
    const { response, status } = await userControllers.getUser({ userId });
    res.status(status).send(response);
  })
);

router.post(
  "/signup",
  handleAsyncError(async (req, res) => {
    const { email, userId, firstName, lastName } = req.body;
    if (!email) throw new AppError("Email is required", 400);
    if (!userId) throw new AppError("User Id is required");
    const { response, status } = await userControllers.signup({
      email,
      userId,
      firstName,
      lastName,
    });
    await welcomeMail(email);
    res.status(status).send(response);
  })
);

router.post(
  "/delete",
  // isValidUser,
  handleAsyncError(async (req, res) => {
    const userId = req.body.userId;
    if (!userId) throw new AppError("User Id is required", 400);
    const { response, status } = await userControllers.deleteUser({ userId });
    res.status(status).send(response);
  })
);

module.exports = router;
