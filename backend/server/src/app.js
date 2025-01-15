require("dotenv").config();
const app = require("express")();
const cors = require("cors");
const bodyParser = require("body-parser");
const serverless = require("serverless-http");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const userRoutes = require("./routes/userRoutes");
const videoRoutes = require("./routes/videoRoutes");

app.get("/health", (req, res) => {
  res.send("ok health");
});
app.get("/", (req, res) => {
  res.send("Welcome");
});
app.use("/user", userRoutes);
app.use("/video", videoRoutes);

app.use((err, req, res, next) => {
  console.log(err);
  if (err.name === "AppError") {
    res.status(err.status).send({
      success: false,
      message: err.message,
      data: {},
    });
    return;
  } else {
    res.status(err.status || 500).send({
      status: 500,
      message: "Internal Server Error,try after some time",
      data: {},
    });
  }
});
const PORT = process.env.PORT || 5000;

if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  app.listen(PORT, () => {
    console.log(`Server is listening at port:${PORT}`);
  });
}
module.exports.handle = serverless(app);
