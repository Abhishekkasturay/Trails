const Comment = require("../Models/CommentSchema");
const Like = require("../Models/LikesSchema");

exports.getPostStats = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const likeCount = await Like.countDocuments({ postId, isLiked: true });
    const commentCount = await Comment.countDocuments({ postId });

    return res.status(200).json({
      postId,
      likeCount,
      commentCount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
