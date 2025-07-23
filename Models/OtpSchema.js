const mongoose = require("mongoose");

const tempOtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    otpExpiry: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);


module.exports = mongoose.model("TempOtp", tempOtpSchema);
