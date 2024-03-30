// routes.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
} = require("../Controllers/userController");

// Authentication Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
