const axios = require("axios");
const AsyncError = require("../utils/CatchAsync");
const AppError = require("../utils/ErrorHandler");
const User = require("../Models/userModel");
const Paystack = require("@paystack/paystack-sdk");
// const User = require("../Models/userModel");
const crypto = require("crypto");

const paystack = new Paystack(process.env.paystack_secret_key);

let isPaid = false;

const createCustomer = async (req, res) => {
  try {
    let {
      email,
      firstname,
      lastname,
      address,
      nextOfKin,
      montlyplan,
      datejoined,
      phone,
      nextofkinPhone,
      dob,
    } = req.body;
    console.log(req.body);

    if (!email) {
      throw Error("Please include a valid email address");
    }

    let createCustomerResponse = await paystack.customer.create({
      email,
      first_name: firstname,
      last_name: lastname,
      phone: phone,
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
    console.log(user);
    res.cookie("customer", customer.customer_code);
    return res.status(200).send(customer);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
};

// const initialPayment = async (req, res) => {

//   try {
//     let { customerCode, amount, plan } = req.body;

//     const user = await User.findOne({ customerCode: customerCode });
//     console.log(user);

//     if (!user) {
//       throw Error("Please provide a valid customer.");
//     }

//     // subscribe
//     let subscriptionRsponse = await paystack.transaction.initialize({
//       email: user.email,
//       amount,
//       plan,
//       channels: ["card"], // limiting the checkout to show card, as it's the only channel that subscriptions are currently available through
//       callback_url: `${process.env.SERVER_URL}/account.html`,
//     });
//     let suscription = subscriptionRsponse.data
//     res.status(200).send(suscription);

//     // then checkout
//     let initializeTransactionResponse = await paystack.transaction.initialize({
//       email: user.email,
//       amount: 15000 * 100,
//       channels: ["card"], // limiting the checkout to show card, as it's the only channel that subscriptions are currently available through
//       callback_url: `${process.env.SERVER_URL}/account.html`,
//     });

//     if (initializeTransactionResponse.status === false) {
//       return console.log(
//         "Error initializing transaction:",
//         initializeTransactionResponse.message
//       );
//     }
//     let transaction = initializeTransactionResponse.data;
//     console.log(transaction);
//     return res.status(200).send(transaction);
//   } catch (error) {
//     return res.status(400).send(error.message);
//   }
// };

// const subscribe = async (req, res) => {
//   try {
//     let { email, amount, plan } = req.body;

//     if (!email || !amount || !plan) {
//       throw Error(
//         'Please provide a valid customer email, amount to charge, and plan code'
//       );
//     }

//     let initializeTransactionResponse = await paystack.transaction.initialize({
//       email,
//       amount,
//       plan,
//       channels: ['card'], // limiting the checkout to show card, as it's the only channel that subscriptions are currently available through
//       callback_url: `${process.env.SERVER_URL}/account.html`,
//     });

//     if (initializeTransactionResponse.status === false) {
//       return console.log(
//         'Error initializing transaction: ',
//         initializeTransactionResponse.message
//       );
//     }
//     let transaction = initializeTransactionResponse.data;
//     return res.status(200).send(transaction);
//   } catch (error) {
//     return res.status(400).send(error.message);
//   }
// };

// const initialPayment = async (req, res) => {
//   try {
//     let { customerCode } = req.body;

//     const user = await User.findOne({ customerCode: customerCode });
//     console.log(user);

//     if (!user) {
//       throw Error("Please provide a valid customer.");
//     }

//     let initializeTransactionResponse = await paystack.transaction.initialize({
//       email: user.email,
//       amount: 15000 * 100,
//       channels: ["card"], // limiting the checkout to show card, as it's the only channel that subscriptions are currently available through
//       callback_url: `${process.env.SERVER_URL}/account.html`,
//     });

//     if (initializeTransactionResponse.status === false) {
//       return console.log(
//         "Error initializing transaction:",
//         initializeTransactionResponse.message
//       );
//     }
//     let transaction = initializeTransactionResponse.data;
//     console.log(transaction);
//     return res.status(200).send(transaction);
//   } catch (error) {
//     return res.status(400).send(error.message);
//   }
// };

const getPlans = async (req, res) => {
  let fetchPlansResponse = await paystack.plan.list({});

  if (fetchPlansResponse.status === false) {
    console.log("Error fetching plans: ", fetchPlansResponse.message);
    return res
      .status(400)
      .send(`Error fetching subscriptions: ${fetchPlansResponse.message}`);
  }

  return res.status(200).send(fetchPlansResponse.data);
};

const initialPayment = async (req, res) => {
  try {
    let { customerCode, amount, plan } = req.body;

    const user = await User.findOne({ customerCode: customerCode });
    console.log(user);

    if (!user) {
      throw Error("Please provide a valid customer.");
    }

    // subscribe
    let subscriptionRsponse = await paystack.transaction.initialize({
      email: user.email,
      amount,
      plan,
      channels: ["card"], // limiting the checkout to show card, as it's the only channel that subscriptions are currently available through
      callback_url: `${process.env.SERVER_URL}/account.html`,
    });

    if (!subscriptionRsponse.status) {
      // return whatever you want
    }

    /* ONce this part get executed it gives me a response like this
    {
      "authorization_url": "https://checkout.paystack.com/1mxj2x1g8l80x6r",
       "access_code": "1mxj2x1g8l80x6r",
       "reference": "ln2rq546p4"
    }   
    
    Which i will have to use in the brower to complete the payment plus my browser

    Note: i want to make sure the frist transaction goes throuth but the only way is to use the web hook below to know 

*/

    // then checkout
    let initializeTransactionResponse = await paystack.transaction.initialize({
      email: user.email,
      amount: 15000 * 100,
      channels: ["card"], // limiting the checkout to show card, as it's the only channel that subscriptions are currently available through
      callback_url: `${process.env.SERVER_URL}/account.html`,
    });

    if (initializeTransactionResponse.status === false) {
      return console.log(
        "Error initializing transaction:",
        initializeTransactionResponse.message
      );
    }
    let transaction = initializeTransactionResponse.data;
    console.log(transaction);
    return res.status(200).send(transaction);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const subscribe = async (req, res) => {
  try {
    let { customerCode, amount, plan } = req.body;

    const user = await User.findOne({ customerCode: customerCode });
    console.log(user);

    if (!user) {
      throw Error("Please provide a valid customer.");
    }

    let initializeTransactionResponse = await paystack.transaction.initialize({
      email: user.email,
      amount,
      plan,
      channels: ["card"], // limiting the checkout to show card, as it's the only channel that subscriptions are currently available through
      callback_url: `${process.env.SERVER_URL}/account.html`,
    });

    if (initializeTransactionResponse.status === false) {
      return console.log(
        "Error initializing transaction: ",
        initializeTransactionResponse.message
      );
    }
    let transaction = initializeTransactionResponse.data;
    return res.status(200).send(transaction);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const userSubscription = async (req, res) => {
  try {
    let { customer } = req.query;

    if (!customer) {
      throw Error("Please include a valid customer ID");
    }

    let fetchSubscriptionsResponse = await paystack.subscription.list({
      customer,
    });

    if (fetchSubscriptionsResponse.status === false) {
      console.log(
        "Error fetching subscriptions: ",
        fetchSubscriptionsResponse.message
      );
      return res
        .status(400)
        .send(
          `Error fetching subscriptions: ${fetchSubscriptionsResponse.message}`
        );
    }

    let subscriptions = fetchSubscriptionsResponse.data.filter(
      (subscription) =>
        subscription.status === "active" ||
        subscription.status === "non-renewing"
    );

    return res.status(200).send(subscriptions);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
};

const updatePayment = async (req, res) => {
  try {
    const { subscription_code } = req.query;
    const manageSubscriptionLinkResponse =
      await paystack.subscription.manageLink({
        code: subscription_code,
      });
    if (manageSubscriptionLinkResponse.status === false) {
      console.log(manageSubscriptionLinkResponse.message);
    }

    let manageSubscriptionLink = manageSubscriptionLinkResponse.data.link;
    return res.redirect(manageSubscriptionLink);
  } catch (error) {
    console.log(error);
  }
};

const handleWebhook = (req, res) => {
  const hash = req.headers["x-paystack-signature"];
  const body = JSON.stringify(req.body);
  const expectedHash = crypto
    .createHmac("sha512", process.env.paystack_secret_key)
    .update(body)
    .digest("hex");

  if (hash === expectedHash) {
    const event = req.body.event;
    if (event === "charge.success") {
      const transactionData = req.body.data;
      if (transactionData.status == "success") {
        let isPaid = true;
        console.log(isPaid);
      }
      console.log("Successful transaction:", transactionData);
    }
    res.status(200).end();
  } else {
    console.error("Webhook signature verification failed");
    res.status(400).end();
  }
};

module.exports = {
  createCustomer,
  subscribe,
  initialPayment,
  getPlans,
  userSubscription,
  updatePayment,
  handleWebhook,
};
