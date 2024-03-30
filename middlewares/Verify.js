const AppError = require("../utils/ErrorHandler");
const AsyncError = require("../utils/CatchAsync");
const Jwt = require("jsonwebtoken");
const User = require("../Models/userModel");
const { promisify } = require("util");

exports.verifyJWT = AsyncError(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    token = req.headers.cookie.split('=')[1];
  }


  if (!token) {
    return next(new AppError("You don't have access to this route", 401));
  }

  const decoded = await promisify(Jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  console.log(currentUser)
  res.locals.user = currentUser;

  next();
});
