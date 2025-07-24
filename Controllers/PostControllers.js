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
  getAllPosts: async (req, res) => {
    try {
      const posts = await PostSchema.find({}, { _id: 0, __v: 0 }).populate(
        "user",
        "name _id"
      );

      return sendResponse(res, posts, messages.POST.POST_FETCHED, 200);
    } catch (error) {
      console.log("error", error);
      return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
    }
  },

  // Get Post by User
  getPostByUser: async (req, res) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.params.userId);
      const { title, name } = req.query;

      const filter = { user: userId };

      if (title) {
        filter.title = title; // exact match
      }

      const posts = await PostSchema.find(filter, { _id: 0, __v: 0 }).populate({
        path: "user",
        select: "name _id",
        match: name ? { name: name } : {}, // match user.name if provided
      });

      const filteredPosts = posts.filter((post) => post.user !== null);

      return sendResponse(res, filteredPosts, "data fetched", 200);
    } catch (error) {
      console.log("error", error);
      return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
    }
  },
};
