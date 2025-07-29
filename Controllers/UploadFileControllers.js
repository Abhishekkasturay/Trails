// controllers/MediaController.js
const { uploadFile } = require("../Helper/UploadMediaHelper");

module.exports = {
  uploadMedia: async (req, res) => {
    try {
      if (!req.files || !req.files.media) {
        return res.status(400).json({ message: "Media file is required" });
      }

      const mediaFile = req.files.media;

      let mediaUrls = [];
      console.log(mediaUrls);

      for (let file of mediaFile) {
        const path = await uploadFile(file); // upload each file
        mediaUrls.push(path); // add uploaded path to array
      }

      return res.status(200).json({
        message: "Media uploaded successfully",
        mediaUrl: mediaUrls, // ✅ FIXED
      });
    } catch (error) {
      console.log("Upload error:", error);
      return res.status(500).json({ message: "Server error", error });
    }
  },
};
