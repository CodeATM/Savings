const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Pleae add a firstname"],
  },
  lastname: {
    type: String,
    required: [true, "Pleae add a lastname"],
  },
  email: {
    type: String,
    required: [true, "Please add an email address"],
    unique: [true, "This email has been used before"],
    validate: [validator.isEmail, "please add a valid emai"],
  },
  nextofkin:{
    type: String,
    required: [true, 'User address is required']
  },
  monthlyplan:{
    type: String,
  },
  datejoined:{
    type: Date,
  },
  dob:{
    type: String,
  },
  phone:{
    type: String,
  },
  nextofkinPhone:{
    type: String,
  },
  address: {
    type: String,
  },
  customerCode: {
    type: String
  },
  customerId: {
    type: String
  },
  paidRegFee: {
    type: Boolean,
    default: false
  }
});

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   this.password = await bcrypt.hash(this.password, 12);
//   this.confirmPassword = undefined;

//   next();
// });

// userSchema.methods.correctPassword = async function (
//   candidatePassword,
//   userPassword
// ) {
//   return await bcrypt.compare(candidatePassword, userPassword);
// };


// //reset Password token
// userSchema.methods.createPasswordResetToken = function () {
//   const resetToken = crypto.randomBytes(32).toString("hex");
//   this.passwordResetToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");
//     this.paswordResetExpires = Date.now() + 10 * 60 * 1000;
//   return resetToken;
// };

// userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
//   if (this.passwordChangedAt) {
//     const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

//     return JWTTimestamp < changedTimestamp;
//   }
//   // False means NOT changed
//   return false;
// };

// userSchema.pre('save', function(next) {
//   if (!this.isModified('password') || this.isNew) return next();

//   this.passwordChangedAt = Date.now() - 1000;
//   next();
// });


module.exports = mongoose.model("User", userSchema);
