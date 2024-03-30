// routes.js
const express = require("express");
const router = express.Router();
const { createCustomer, subscribe } = require("../Controllers/Payment");
const {verifyJWT } = require('../middlewares/Verify')

// Authentication Routes
router.post("/createCustomer", createCustomer);
router.post('/create-subscription', subscribe);
// router.post("/login", loginUser);

module.exports = router;
