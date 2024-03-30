const axios = require("axios");
const AsyncError = require("../utils/CatchAsync");
const AppError = require("../utils/ErrorHandler");
const User = require("../Models/userModel");
const Paystack = require("@paystack/paystack-sdk");
// const User = require("../Models/userModel");

const paystack = new Paystack(process.env.paystack_secret_key);

const createCustomer = async (req, res) => {
  try {
    let { email, firstname, lastname, address, nextOfKin, montlyplan, datejoined, phone, nextofkinPhone, dob, } = req.body;

    if (!email) {
      throw Error("Please include a valid email address");
    }

    let createCustomerResponse = await paystack.customer.create({
      email,
    });

    if (createCustomerResponse.status === false) {
      console.log("Error creating customer: ", createCustomerResponse.message);
      return res
        .status(400)
        .send(`Error creating customer: ${createCustomerResponse.message}`);
    }
    let customer = createCustomerResponse.data;

    // This is where you would save your customer to your DB. Here, we're mocking that by just storing the customer_code in a cookie

    const user = await User.create({
      ...req.body,
      customerCode: customer.customer_code,
      customerId: customer.id,
    });
    res.cookie("customer", customer.customer_code);
    return res.status(200).send({customer, user});
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
};

const subscribe = async (req, res) => {
  try {
    let { email, amount, plan } = req.body;

    if (!email || !amount || !plan) {
      throw Error(
        'Please provide a valid customer email, amount to charge, and plan code'
      );
    }

    let initializeTransactionResponse = await paystack.transaction.initialize({
      email,
      amount,
      plan,
      channels: ['card'], // limiting the checkout to show card, as it's the only channel that subscriptions are currently available through
      callback_url: `${process.env.SERVER_URL}/account.html`,
    });

    if (initializeTransactionResponse.status === false) {
      return console.log(
        'Error initializing transaction: ',
        initializeTransactionResponse.message
      );
    }
    let transaction = initializeTransactionResponse.data;
    return res.status(200).send(transaction);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

module.exports = {
  createCustomer,
  subscribe
};
