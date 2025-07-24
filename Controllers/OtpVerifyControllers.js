const { generateOTP } = require("../Helper/OtpGeneratorHelper");
const { sendEmail } = require("../Helper/MailHelper");
const TempOtp = require("../Models/OtpSchema");
const { sendResponse } = require("../Helper/ResponseHelper");
const messages = require("../Constant/messages");

// Request login OTP

exports.requestLoginOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // Check Email Provided by User
    if (!email) return sendResponse(res, {}, messages.AUTH.EMAIL_FAILED, 400);

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

    return sendResponse(res, {}, messages.OTP.OTP_SEND_USER, 200);
  } catch (error) {
    // return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
    return  
     
  }
};
