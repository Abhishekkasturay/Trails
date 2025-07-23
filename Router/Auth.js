const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
} = require("../Controllers/AuthControllers");

const {
  verifyOtp,
  resetPassword,
} = require("../Controllers/VerifyUserController");
const { requestLoginOtp } = require("../Controllers/OtpVerifyControllers");
const { verifyEmailOtp } = require("../Controllers/VerifyEmailControllers");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/email-login", requestLoginOtp);
router.post("/verify-email", verifyEmailOtp);

module.exports = router;
