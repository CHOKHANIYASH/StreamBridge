const jwt = require("jsonwebtoken");
const { CognitoJwtVerifier } = require("aws-jwt-verify");
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: process.env.COGNITO_CLIENT_ID,
});
class AppError extends Error {
  constructor(message, status) {
    super();
    this.message = message;
    this.status = status;
    this.name = "AppError";
  }
}

const handleAsyncError = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => next(err));
};

const isValidUser = handleAsyncError(async (req, res, next) => {
  const userId = req.body.userId || req.params.userId;
  const access_token = req.headers.access_token;
  // console.log(access_token);
  if (!access_token) throw new AppError("Unauthorized", 401);
  const payload = await verifier.verify(access_token).catch((err) => {
    throw new AppError("Unauthorized", 401);
  });
  if (!payload) throw new AppError("Unauthorized", 401);
  if (userId !== payload.sub) throw new AppError("unauthorized", 401);
  next();
});

const isAdmin = handleAsyncError(async (req, res, next) => {
  const code = req.body.adminCode;
  if (code !== process.env.ADMIN_CODE)
    throw new AppError("Only Admin Requests is allowed", 400);
  next();
});

module.exports = { AppError, handleAsyncError, isValidUser, isAdmin };
