// routes.js
const express = require("express");
const router = express.Router();
const {
  createCustomer,
  subscribe,
  initialPayment,
  getPlans,
  userSubscription,
  updatePayment
} = require("../Controllers/Payment");

// Authentication Routes
router.post("/create-customer", createCustomer);
router.post("/create-subscription", subscribe);
router.post("/initial-payment", initialPayment);
router.get('/plans', getPlans)
router.get('/subscription', userSubscription)
router.get('/update-payment-method',  updatePayment)

router.post("/webhook", async (req, res) => {
  const hash = crypto
    .createHmac("sha512", process.env.paystack_secret_key)
    .update(JSON.stringify(req.body))
    .digest("hex");
  if (hash == req.headers["x-paystack-signature"]) {
    const webhook = req.body;
    res.status(200).send("Webhook received");

    switch (webhook.event) {
      case "subscription.create": // Sent when a subscription is created successfully
      case "charge.success": // Sent when a subscription payment is made successfully
      case "invoice.create": // Sent when an invoice is created to capture an upcoming subscription charge. Should happen 2-3 days before the charge happens
      case "invoice.payment_failed": // Sent when a subscription payment fails
      case "subscription.not_renew": // Sent when a subscription is canceled to indicate that it won't be charged on the next payment date
      case "subscription.disable": // Sent when a canceled subscription reaches the end of the subscription period
      case "subscription.expiring_cards": // Sent at the beginning of each month with info on what cards are expiring that month
    }
  }
});

module.exports = router;
