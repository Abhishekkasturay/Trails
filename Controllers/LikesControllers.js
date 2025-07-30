// Controllers/LikeController.js

const Like = require("../Models/LikesSchema");

const toggleLike = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user.id;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const existingLike = await Like.findOne({ postId, userId });

    if (existingLike) {
      // Toggle the like
      existingLike.isLiked = !existingLike.isLiked;
      await existingLike.save();
      return res.status(200).json({
        message: existingLike.isLiked ? "Post liked" : "Post unliked",
        data: existingLike,
      });
    } else {
      // If like doesn't exist, create it
      const newLike = await Like.create({ postId, userId, isLiked: true });
      return res.status(201).json({ message: "Post liked", data: newLike });
    }
  } catch (err) {
    console.error("Toggle like error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { toggleLike };
