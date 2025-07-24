const User = require("../Models/UserSchema");
const messages = require("../Constant/messages");
const bcrypt = require("bcryptjs");
const { generateOTP } = require("../Helper/OtpGeneratorHelper");
const { generateToken } = require("../Helper/JwtHelper");
const { sendResponse } = require("../Helper/ResponseHelper");
const validate = require("../Helper/ValidationHelper");
const { sendEmail } = require("../Helper/MailHelper");

module.exports = {
  // Register User
  registerUser: async (req, res) => {
    try {
       // Validation rules for Register input fields
      const validationRules = {
        name: "required|string",
        email: "required|email",
        password: "required|string|minLength:6|maxLength:32",
        mobile: "required|numeric|minLength:10|maxLength:15",
        address: "required|string",
        status: "required|boolean",
        hobbies: "array",
      };

      const error = await validate(req.body, validationRules);
      if (error) {
        return sendResponse(res, {}, error, 422);
      }

      const { name, email, password, mobile, address, status, hobbies } =
        req.body;

      // Check if User already exist in the Database
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return sendResponse(res, {}, messages.AUTH.USER_ALREADY_CREATED, 404);
      }
      // Check if Mobile Number Already in Database
      const existingUserByMobile = await User.findOne({ mobile });
      if (existingUserByMobile) {
        return sendResponse(res, {}, messages.AUTH.MOBILE_ALREADY_IN_USE, 409);
      }
      
      const newUser = new User({
        name,
        email,
        password,
        mobile,
        address,
        status,
        hobbies,
      });
      
      // Save User in Database
      await newUser.save();

      const payload = {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      };
      // Generate Token
      const token = generateToken(payload);

      return sendResponse(
        res,
        { user: newUser, token },
        messages.USER.CREATED,
        201
      );
    } catch (error) {
      return sendResponse(res, {}, error.message, 500);
    }
  },
  // login User
  loginUser: async (req, res) => {
    try {

      // Validation rules for login input fields
      const loginValidationRules = {
        email: "required|email",
        password: "required|string|minLength:6|maxLength:32",
      };

      const error = await validate(req.body, loginValidationRules);
      if (error) {
        return sendResponse(res, {}, error, 422);
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });
      
      // Check if the user exists in the database
      if (!user) {
        return sendResponse(res, {}, messages.AUTH.USER_NOT_FOUND, 422);
      }

      // Compare Password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return sendResponse(res, {}, messages.AUTH.UNAUTHORIZED, 422);
      }

      const payload = { id: user._id, email: user.email, name: user.name };

      // Generate Token

      const token = generateToken(payload);

      return sendResponse(
        res,
        { user: user, token },
        messages.AUTH.LOGIN_SUCCESS,
        200
      );
    } catch (error) {
      return sendResponse(res, {}, error.message, 500);
    }
  },

  // Forgot Password
  forgotPassword: async (req, res) => {
    try {

      // validation rule for Forgot Password field
      const EmailValidationRules = {
        email: "required|email",
      };

      const error = await validate(req.body, EmailValidationRules);
      if (error) {
        return sendResponse(res, {}, error, 422);
      }

      const { email } = req.body;

      // Check if email is provided by the User

      if (!email) {
        return sendResponse(res, {}, messages.AUTH.EMAIL_FAILED, 422);
      }

      const user = await User.findOne({ email });
      if (!user) {
        return sendResponse(res, {}, messages.AUTH.USER_NOT_FOUND, 422);
      }

      // 1. Generate OTP and expiry time (5 minutes)
      const otp = generateOTP(); // e.g., 6-digit random
      const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

      // 2. Save OTP and expiry to user's document
      user.otp = otp;
      user.otpExpiry = expiry;
      await user.save();

      // 3. Email the OTP
      const htmlContent = `
      <h2>Your Password Reset OTP</h2>
      <p><strong>${otp}</strong></p>
      <p>This OTP is valid for 5 minutes.</p>
    `;

      await sendEmail(email, "Password Reset OTP", htmlContent);

      return sendResponse(res, {}, messages.OTP.OTP_SEND, 200);
    } catch (error) {
      console.log("error", error.message);
      return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
    }
  },
};
