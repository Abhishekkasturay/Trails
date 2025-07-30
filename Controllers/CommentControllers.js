const Comment = require("../Models/CommentSchema");
const Post = require("../Models/PostSchema");
const { sendResponse } = require("../Helper/ResponseHelper");

module.exports = {
  // 🔹 Create Comment
  createComment: async (req, res) => {
    try {
      const { postId, comment } = req.body;
      const userId = req.user.id; 

      if (!postId || !comment) {
        return sendResponse(res, {}, "Post ID and comment are required", 400);
      }

      const newComment = await Comment.create({ userId, postId, comment });
      return sendResponse(res, newComment, "Comment added", 201);
    } catch (err) {
      console.error(err);
      return sendResponse(res, {}, "Server error", 500);
    }
  },

  // 🔹 Get Comments for a Post
  getCommentsByPost: async (req, res) => {
    try {
      const postId = req.params.postId;

      const comments = await Comment.find({ postId })
        .populate("userId", "name _id") // return user's name and _id
        .sort({ createdAt: -1 });

      return sendResponse(res, comments, "Comments fetched", 200);
    } catch (err) {
      console.error(err);
      return sendResponse(res, {}, "Server error", 500);
    }
  },

  // 🔹 Update a Comment
  updateComment: async (req, res) => {
    try {
      const commentId = req.params.id;
      const { comment } = req.body;

      const existingComment = await Comment.findById(commentId);
      if (!existingComment) {
        return sendResponse(res, {}, "Comment not found", 404);
      }

      if (existingComment.userId.toString() !== req.user.id) {
        return sendResponse(res, {}, "Unauthorized", 403);
      }

      existingComment.comment = comment || existingComment.comment;
      await existingComment.save();

      return sendResponse(res, existingComment, "Comment updated", 200);
    } catch (err) {
      console.error(err);
      return sendResponse(res, {}, "Server error", 500);
    }
  },

  // 🔹 Delete a Comment
  deleteComment: async (req, res) => {
    try {
      const commentId = req.params.id;

      const existingComment = await Comment.findById(commentId);
      if (!existingComment) {
        return sendResponse(res, {}, "Comment not found", 404);
      }

      if (existingComment.userId.toString() !== req.user.id) {
        return sendResponse(res, {}, "Unauthorized", 403);
      }

      await Comment.findByIdAndDelete(commentId);
      return sendResponse(res, {}, "Comment deleted", 200);
    } catch (err) {
      console.error(err);
      return sendResponse(res, {}, "Server error", 500);
    }
  },
};
