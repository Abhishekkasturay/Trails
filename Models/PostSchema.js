const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: String,
    title: String,
    description: String,
    //media
    status: Boolean,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PostSchema", postSchema);
