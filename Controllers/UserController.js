const messages = require("../Constant/messages");
const { sendResponse } = require("../Helper/ResponseHelper");
const User = require("../Models/UserSchema");
const validate = require("../Helper/ValidationHelper");
const { generateToken } = require("../Helper/JwtHelper");

module.exports = {
  // Add user
  addUser: async (req, res) => {
    try {
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

      const newUser = new User({
        name,
        email,
        password,
        mobile,
        address,
        status,
        hobbies,
      });

      await newUser.save();

      const payload = {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      };

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

  //  Get user
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return sendResponse(res, {}, messages.USER.NOT_FOUND, 404);
      }

      return sendResponse(res, user, messages.USER.FETCHED_USER, 200);
    } catch (error) {
      return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
    }
  },

  // Update User
  updateUserById: async (req, res) => {
    const { id } = req.params;
    const updateUser = req.body;

    if (!updateUser) {
      return sendResponse(res, {}, messages.USER.NOT_FOUND, 404);
    }
    try {
      const user = await User.findByIdAndUpdate(id, updateUser, { new: true });
      return sendResponse(res, user, messages.USER.UPADATED_USER, 200);
    } catch (error) {
      return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
    }
  },

  // Delete User
  deleteUserById: async (req, res) => {
    const { id } = req.params;
    try {
      const deleteUser = await User.findByIdAndDelete(id);

      return sendResponse(res, deleteUser, messages.USER.DELETED_USER, 200);
    } catch (error) {
      return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
    }
  },
};
