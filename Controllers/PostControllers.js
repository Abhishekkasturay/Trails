const messages = require("../Constant/messages");
const { sendResponse } = require("../Helper/ResponseHelper");
const PostSchema = require("../Models/PostSchema");
const mongoose = require("mongoose");

module.exports = {
  //Create Post
  createPost: async (req, res) => {
    try {
      const userId = req.user.id;
      const { title, description } = req.body;
      const newPost = new PostSchema({
        user: userId,
        title,
        description,
      });

      await newPost.save();

      return sendResponse(res, newPost, messages.POST.POST_CREATED, 200);
    } catch (error) {
      console.log("error", error);
      return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
    }
  },
  //Get All Post
  // getAllPosts: async (req, res) => {
  //   try {

  //     let filter  = {}
  //     if(search){
  //       filter.title = search
  //       filter.name = search
  //     }
  //     if(userId){
  //       filter.user = userId
  //     }
  //     const posts = await PostSchema.find(filter).populate(
  //       "user",
  //       "name _id"
  //     );

  //     return sendResponse(res, posts, messages.POST.POST_FETCHED, 200);
  //   } catch (error) {
  //     console.log("error", error);
  //     return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
  //   }
  // },

  getAllPosts: async (req, res) => {
    try {
      const { search, userId } = req.query;

      const filter = {};

      // Apply userId filter if passed
      if (userId) {
        filter.user = userId;
      }

      // Build regex filter for title or description
      if (search) {
        const searchRegex = new RegExp(search, "i"); // case-insensitive
        filter.$or = [
          { title: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
        ];
      }

      // Initial DB query with filters
      const posts = await PostSchema.find(filter).populate({
        path: "user",
        select: "name _id",
      });

      return sendResponse(res, posts, messages.POST.POST_FETCHED, 200);
    } catch (error) {
      console.log("error", error);
      return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
    }
  },
};
