const express = require("express");
const AppError = require("../utils/ErrorHandler");
const AsyncError = require("../utils/CatchAsync");
const User = require("../Models/userModel");
const Jwt = require("jsonwebtoken");
// import Email from './../utils/email.js';

const jsontoken = (id) => {
  return Jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//send cookies
const createToken = (user, statusCode, req, res) => {
  const token = jsontoken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // cookie cannot be accessed or modified in any way by the browser
    secure: req.secure || req.headers["x-forwarded-proto"] === "http",
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};

//Check if emailExist

//Register user
const registerUser = AsyncError(async (req, res, next) => {
  const user = await User.create(req.body);
  console.log(req.body);

  createToken(user, 201, req, res);
});

//Login user
const loginUser = AsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("please input your credentials"));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createToken(user, 200, req, res);
});

module.exports = {
  registerUser,
  loginUser,
};
