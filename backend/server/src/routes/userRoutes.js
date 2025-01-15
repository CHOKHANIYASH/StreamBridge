const router = require("express").router();
const {
  handleAsyncError,
  AppError,
  isValiduser,
} = require("../middlewares/middleware");
const userControllers = require("../controllers/userControllers");

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
    const { response, status } = userControllers.getUser({ userId });
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
    res.status(status).send(response);
  })
);

router.post(
  "/delete/:userId",
  isValiduser,
  handleAsyncError(async (req, res) => {
    const userId = req.params.userId;
    if (!userId) throw new AppError("User Id is required", 400);
    const { response, status } = await userControllers.deleteUser({ userId });
    res.status(status).send(response);
  })
);

module.exports = router;
