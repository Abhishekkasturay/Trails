const messages = require("../Constant/messages");
const { sendResponse } = require("../Helper/ResponseHelper");
const validate = require("../Helper/ValidationHelper");
const User = require("../Models/UserSchema");

module.exports = {
  verifyOtp: async (req, res) => {
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
      const user = await User.findOne({ email });

      if (!user) {
        return sendResponse(res, {}, "User not found", 422);
      }

      if (!user.otp || !user.otpExpiry) {
        return sendResponse(res, {}, "OTP not requested", 422);
      }

      if (user.otpExpiry < Date.now()) {
        return sendResponse(res, {}, "OTP has expired", 422);
      }

      if (user.otp !== String(otp)) {
        return sendResponse(res, {}, "Invalid OTP", 422);
      }

      // OTP is valid
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();

      return sendResponse(res, {}, "OTP verified successfully", 200);
    } catch (error) {
      console.log("error", error.message);
      return sendResponse(res, {}, error.message, 500);
    }
  },
  resetPassword: async (req, res) => {
    try {
      const resetValidationRules = {
        email: "required|email",
        otp: "required|string",
        newPassword:
          "required|string|minLength:6|maxLength:32|same:confirmPassword",
        confirmPassword: "required|string|minLength:6|maxLength:32",
      };

      const error = await validate(req.body, EmailValidationRules);
      if (error) {
        return sendResponse(res, {}, error, 422);
      }
      const { email, otp, newPassword, confirmPassword } = req.body;

      // 1. Validate input
      if (!email || !otp || !newPassword || !confirmPassword) {
        return sendResponse(res, {}, "All fields are required", 400);
      }

      if (newPassword !== confirmPassword) {
        return sendResponse(res, {}, "Passwords do not match", 400);
      }

      // 2. Find user
      const user = await User.findOne({ email });

      if (!user || !user.otp || !user.otpExpiry) {
        return sendResponse(res, {}, "Invalid or expired OTP", 400);
      }

      // 3. Check OTP validity
      if (user.otp !== otp || user.otpExpiry < Date.now()) {
        return sendResponse(res, {}, "Invalid or expired OTP", 401);
      }

      // 4. Hash and update new password
      user.password = newPassword;
      // 5. Clear OTP and expiry
      user.otp = undefined;
      user.otpExpiry = undefined;

      await user.save();

      return sendResponse(res, {}, "Password reset successful", 200);
    } catch (error) {
      return sendResponse(res, {}, error.message, 500);
    }
  },
  updatePassword: async (req, res) => {
    try {
      const updateValidationRules = {
        email: "required|email",
        password: "required|string|minLength:6|maxLength:32",
      };

      const error = await validate(req.body, updateValidationRules);
      if (error) {
        return sendResponse(res, {}, error, 422);
      }
      const userId = req.user.id;
      const { oldPassword, newPassword, confirmPassword } = req.body;

      if (!oldPassword || !newPassword || !confirmPassword) {
        return sendResponse(res, {}, "All fields are required", 400);
      }

      if (newPassword !== confirmPassword) {
        return sendResponse(
          res,
          {},
          "New password and confirm password do not match",
          400
        );
      }

      const user = await User.findById(userId);
      console.log("User fetched from DB:", user);
      if (!user) {
        return sendResponse(res, {}, messages.AUTH.USER_NOT_FOUND, 404);
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return sendResponse(res, {}, "Old password is incorrect", 401);
      }

      await user.save();

      return sendResponse(res, {}, "Password updated successfully", 200);
    } catch (error) {
      console.error("Update Password Error:", error);
      return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
    }
  },
};
