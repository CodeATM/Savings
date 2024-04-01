const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const PORT = 8000;
require("dotenv").config();
const AppError = require("./utils/ErrorHandler");
const globalErrorHandler = require("./Controllers/ErrorController");
const { resolve } = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(process.env.STATIC_DIR));

app.get('/', async (req, res) => {
  const path = resolve(process.env.STATIC_DIR + '/register.html');
  res.sendFile(path);
});

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  }),
);

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`databse connected`));


// app.get("/", (req, res, next) => {
//   res.json({ message: "Hello, welcome to AJO's Api" });
// });

app.use("/user", require("./routes/userRoutes"));
app.use("/payment", require("./routes/paymentRoutes"));


app.all("*", (req, res, next) => {
  next(new AppError(`can't find this route on the server!!!`, 404));
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});
