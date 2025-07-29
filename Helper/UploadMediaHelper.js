const fs = require("fs");
const path = require("path"); 

const uploadFile = async (file) => {
  return new Promise((resolve, reject) => {
    try {
      if (!file) return reject("No file provided");

      const folderName = "uploads";

      // Create folder if it doesn't exist
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName, { recursive: true });
      }

      // Generate unique file name
      const timeStamp = Date.now();
      const ext = path.extname(file.name); // e.g. .jpg
      const baseName = path.basename(file.name, ext);
      const uniqueFileName = `${baseName}-${timeStamp}${ext}`;

      const uploadPath = path.join(folderName, uniqueFileName);

      // Move the file to uploads/
      file.mv(uploadPath, (err) => {
        if (err) return reject(err);
        resolve(`/uploads/${uniqueFileName}`); // relative URL to serve
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { uploadFile };
