// Models/LikeSchema.js

const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "PostSchema" },
    isLiked: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Like", likeSchema);
