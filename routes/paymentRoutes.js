// routes.js
const express = require("express");
const router = express.Router();
const {
  createCustomer,
  subscribe,
  initialPayment,
  getPlans,
  userSubscription,
  updatePayment,
  handleWebhook
} = require("../Controllers/Payment");

// Authentication Routes
router.post("/create-customer", createCustomer);
router.post("/create-subscription", subscribe);
router.post("/initial-payment", initialPayment);
router.get('/plans', getPlans)
router.get('/subscription', userSubscription)
router.get('/update-payment-method',  updatePayment)


router.post('/webhook', handleWebhook);

module.exports = router;
