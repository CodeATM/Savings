const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const PORT = 8000;
require("dotenv").config();
const AppError = require("./utils/ErrorHandler");
const globalErrorHandler = require("./Controllers/ErrorController");

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  }),
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`databse connected`));


app.get("/", (req, res, next) => {
  res.json({ message: "Hello, welcome to AJO's Api" });
});

app.use("/user", require("./routes/userRoutes"));
app.use("/payment", require("./routes/paymentRoutes"));


app.all("*", (req, res, next) => {
  next(new AppError(`can't find this route on the server!!!`, 404));
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});
