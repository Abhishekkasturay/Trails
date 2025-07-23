// Routes/UserRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware.js/VerifyToken");
const { updatePassword } = require("../Controllers/VerifyUserController");
const { getProfile, updateProfile } = require("../Controllers/SettingsControllers");

router.post("/update-password", authMiddleware, updatePassword);
router.get("/user-profile", authMiddleware, getProfile);
router.put("/update-profile", authMiddleware, updateProfile);

module.exports = router;
