// Routes/UserRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware.js/VerifyToken");
const { updatePassword } = require("../Controllers/VerifyUserController");
const {
  getProfile,
  updateProfile,
} = require("../Controllers/SettingsControllers");
const {
  createPost,
  getAllPosts,
  updatePostMedia,
} = require("../Controllers/PostControllers");
const {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
} = require("../Controllers/CommentControllers");
const { toggleLike } = require("../Controllers/LikesControllers");
const { getPostStats } = require("../Controllers/TotalCounts");

//user route

router.post("/update-password", authMiddleware, updatePassword);
router.get("/user-profile", authMiddleware, getProfile);
router.put("/update-profile", authMiddleware, updateProfile);
router.post("/create-post", authMiddleware, createPost);
router.get("/get-post", authMiddleware, getAllPosts);
router.get("/get-post/:userId", authMiddleware, getAllPosts);
router.put("/posts/:id/media", authMiddleware, updatePostMedia);

//comments route

router.get("/comment/:postId", authMiddleware, getCommentsByPost);
router.post("/comment", authMiddleware, createComment);
router.put("/comment/:id", authMiddleware, updateComment);
router.delete("/comment/:id", authMiddleware, deleteComment);

//likes route

router.post("/like", authMiddleware, toggleLike);
router.get("/post-stats/:postId", getPostStats);

module.exports = router;
