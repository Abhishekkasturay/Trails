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
  getPostByUser,
} = require("../Controllers/PostControllers");

router.post("/update-password", authMiddleware, updatePassword);
router.get("/user-profile", authMiddleware, getProfile);
router.put("/update-profile", authMiddleware, updateProfile);
router.post("/create-post", authMiddleware, createPost);
router.get("/get-post", getAllPosts);
router.get("/get-post/:userId", getPostByUser);

module.exports = router;
