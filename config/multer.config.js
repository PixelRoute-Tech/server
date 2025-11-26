const multer = require('multer');
const path = require("path");
const fs = require("fs");
//multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'), // folder for files
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    const filename = `${req.body.userName || 'user'}-${Date.now()}.${ext}`;
    console.log(file)
    req.body.imageUrl = `/uploads/${filename}`;

    cb(null, filename);
  }, // unique filename
});


const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join("uploads", "reportImages");

    // Create folder if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    const filename = `${req.body.recordId || "user"}-${Date.now()}.${ext}`;

    req.body.imageUrl = `/uploads/reportImages/${filename}`;

    cb(null, filename);
  }
});


module.exports = {
  commonFiles:multer({ storage }),
  reportFiles:multer({ storage:fileStorage })
}