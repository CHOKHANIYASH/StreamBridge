const jwt = require("jsonwebtoken");

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
  if (!access_token) throw new AppError("Unauthorized", 401);
  const decoded = jwt.decode(access_token, { complete: true });
  if (!decoded) throw new AppError("unauthorized", 401);
  if (userId !== decoded.payload.sub) throw new AppError("unauthorized", 401);
  next();
});

const isAdmin = handleAsyncError(async (req, res, next) => {
  const code = req.body.adminCode;
  if (code !== process.env.ADMIN_CODE)
    throw new AppError("Only Admin Requests is allowed", 400);
  next();
});

module.exports = { AppError, handleAsyncError, isValidUser, isAdmin };
