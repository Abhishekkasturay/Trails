const messages = require("../Constant/messages");
const { sendResponse } = require("../Helper/ResponseHelper");
const User = require("../Models/UserSchema");

module.exports = {

  // Get User Profile
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
    
      // Check User Exist in Database

      if (!user) {
        return sendResponse(res, {}, messages.USER.NOT_FOUND, 422);
      }
      console.log("user", user);
      return sendResponse(res, user, messages.USER.FETCHED_USER, 200);
    } catch (error) {
      return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
    }
  },

  //Update User Pofile
  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const { name, mobile, address, hobbies } = req.body;

      // Check if mobile number already used

      if (mobile) {
        const existingUser = await User.findOne({ mobile });

        console.log(existingUser);

        if (existingUser && existingUser._id.toString() !== userId.toString()) {
          return sendResponse(
            res,
            {},
            messages.AUTH.MOBILE_ALREADY_IN_USE,
            422
          );
        }
      }

      // Update user details

      const updateUser = await User.findByIdAndUpdate(
        userId,
        { name, mobile, address, hobbies },
        { new: true }
      );
      
      // failed to update User not found
      if (!updateUser) {
        return sendResponse(res, {}, messages.USER.NOT_FOUND, 422);
      }

      return sendResponse(res, updateUser, messages.USER.UPADATED_USER, 200);
    } catch (error) {
      return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
    }
  },
};
