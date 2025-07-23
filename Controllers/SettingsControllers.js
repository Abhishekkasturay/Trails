const messages = require("../Constant/messages");
const { sendResponse } = require("../Helper/ResponseHelper");
const User = require("../Models/UserSchema");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return sendResponse(res, {}, messages.USER.NOT_FOUND, 422);
      }
      console.log("user", user);
      return sendResponse(res, user, messages.USER.FETCHED_USER, 200);
    } catch (error) {
      return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
    }
  },
  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const { name, mobile, address, hobbies } = req.body;

      if (mobile) {
        const existingUser = await User.findOne({ mobile });

        console.log(existingUser);

        if (existingUser && existingUser._id.toString() !== userId.toString()) {
          return sendResponse(res, {}, "Mobile number already in use", 422);
        }
      }

      const updateUser = await User.findByIdAndUpdate(
        userId,
        { name, mobile, address, hobbies },
        { new: true }
      );

      if (!updateUser) {
        return sendResponse(res, {}, messages.USER.NOT_FOUND, 422);
      }

      return sendResponse(res, updateUser, messages.USER.UPADATED_USER, 200);
    } catch (error) {
      return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
    }
  },
};
