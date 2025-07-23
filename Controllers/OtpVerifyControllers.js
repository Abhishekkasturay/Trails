const { generateOTP } = require("../Helper/OtpGeneratorHelper");
const { sendEmail } = require("../Helper/MailHelper");
const TempOtp = require("../Models/OtpSchema");
const { sendResponse } = require("../Helper/ResponseHelper");

exports.requestLoginOtp = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) return sendResponse(res, {}, "Email is required", 400);

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Upsert OTP for same email
    await TempOtp.findOneAndUpdate(
      { email },
      { otp, otpExpiry: expiry },
      { upsert: true, new: true }
    );

    const html = `<h3>Your Login OTP is</h3><p><strong>${otp}</strong></p>`;
    await sendEmail(email, "Your Login OTP", html);

    return sendResponse(res, {}, "OTP sent to email", 200);
  } catch (error) {
    return sendResponse(res, {}, "Server error", 500);
  }
};
