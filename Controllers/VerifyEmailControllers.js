const messages = require("../Constant/messages");
const { generateToken } = require("../Helper/JwtHelper");
const { sendResponse } = require("../Helper/ResponseHelper");
const validate = require("../Helper/ValidationHelper");
const Otp = require("../Models/OtpSchema");
const User = require("../Models/UserSchema");

exports.verifyEmailOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const EmailValidationRules = {
      email: "required|email",
      otp: "required|string",
    };

    const error = await validate(req.body, EmailValidationRules);
    if (error) {
      return sendResponse(res, {}, error, 422);
    }

    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      return sendResponse(res, {}, messages.OTP.OTP_NOT_REQUESTED, 422);
    }

    if (otpRecord.otpExpiry < Date.now()) {
      return sendResponse(res, {}, messages.OTP.OTP_EXPIRED, 401);
    }

    if (otpRecord.otp !== String(otp)) {
      return sendResponse(res, {}, messages.OTP.OTP_INVALID, 422);
    }

    // Optional: delete the OTP record after successful verification
    await Otp.deleteOne({ email });

    // Check if user exists, if yes → login; if not → allow registration
    const user = await User.findOne({ email });

    if (user) {
      // generate token and login
      const token = generateToken({ id: user._id, email: user.email });
      return sendResponse(res, { token, user }, "Login successful", 200);
    } else {
      return sendResponse(
        res,
        {},
        "OTP verified, please complete registration",
        200
      );
    }
  } catch (error) {
    console.log("OTP Verification Error:", error);
    return sendResponse(res, {}, "Server error", 500);
  }
};
