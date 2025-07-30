const messages = require("../Constant/messages");
const { sendResponse } = require("../Helper/ResponseHelper");
const { uploadFile } = require("../Helper/UploadMediaHelper");
const PostSchema = require("../Models/PostSchema");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

module.exports = {
  //Create Post
  createPost: async (req, res) => {
    try {
      const userId = req.user.id;
      const { title, description } = req.body;

      const mediaFiles = Array.isArray(req.files?.media)
        ? req.files.media
        : req.files?.media
        ? [req.files.media]
        : [];

      let uploadedPaths = [];

      for (let i = 0; i < mediaFiles.length; i++) {
        const uploadedPath = await uploadFile(mediaFiles[i]);
        uploadedPaths.push(uploadedPath); // this is a string like '/uploads/image.png'
      }

      const newPost = new PostSchema({
        user: userId,
        title,
        description,
        media: uploadedPaths.map((path) => ({ media: path })), // ✅ convert to objects
      });

      await newPost.save();

      return sendResponse(res, newPost, messages.POST.POST_CREATED, 200);
    } catch (error) {
      console.log("error", error);
      return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
    }
  },
  getAllPosts: async (req, res) => {
    try {
      const { userId, search, sort } = req.query;
      const searchRegex = search ? new RegExp(search, "i") : null;

      const matchFilter = {};

      if (userId) {
        matchFilter.user = new mongoose.Types.ObjectId(userId);
      }

      if (search) {
        matchFilter.$or = [
          { title: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { "user.name": { $regex: searchRegex } },
        ];
      }

      // Default sort is latest first (descending)
      const sortOrder = sort === "old" ? 1 : -1;

      const posts = await PostSchema.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        { $match: matchFilter },
        {
          $project: {
            title: 1,
            description: 1,
            createdAt: 1,
            media: 1,
            "user._id": 1,
            "user.name": 1,
          },
        },
        { $sort: { createdAt: sortOrder } },
      ]);
      console.log("posts", posts);

      return sendResponse(res, posts, messages.POST.POST_FETCHED, 200);
    } catch (error) {
      console.log("error", error);
      return sendResponse(res, {}, messages.GENERAL.SERVER_ERROR, 500);
    }
  },
  updatePostMedia: async (req, res) => {
    try {
      const postId = req.params.id;
      const { title, description, removeMediaIds } = req.body;

      const post = await PostSchema.findById(postId);
      if (!post) return sendResponse(res, {}, "Post not found", 404);

      // ✅ Find media objects to delete by _id match
      const filesToDelete = post.media.filter((file) =>
        removeMediaIds.includes(file._id.toString())
      );

      // ✅ Delete those files from disk
      await Promise.all(
        filesToDelete.map((file) => {
          const fullPath = path.join(__dirname, "..", file.media);
          return fs.promises.unlink(fullPath).catch((err) => {
            console.error("Failed to delete file:", file.media, err);
          });
        })
      );

      // ✅ Keep only media not being removed
      const remainingMedia = post.media.filter(
        (file) => !removeMediaIds.includes(file._id.toString())
      );

      // ✅ Upload new files (if any)
      const newMedia = [];
      const files = Array.isArray(req.files?.media)
        ? req.files.media
        : req.files?.media
        ? [req.files.media]
        : [];

      for (const file of files) {
        const uploadedPath = await uploadFile(file);
        newMedia.push({ media: uploadedPath });
      }

      // ✅ Save final media array
      post.media = [...remainingMedia, ...newMedia];
      if (title) post.title = title;
      if (description) post.description = description;
      await post.save();

      return sendResponse(res, post, "Media updated successfully", 200);
    } catch (err) {
      console.error(err);
      return sendResponse(res, {}, "Server error", 500);
    }
  },
};
