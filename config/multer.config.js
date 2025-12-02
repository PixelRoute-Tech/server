const multer = require("multer");
const path = require("path");
const fs = require("fs");
//multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"), // folder for files
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").pop();
    const filename = `${req.body.userName || "user"}-${Date.now()}.${ext}`;
    console.log(file);
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
    const ext = file.originalname.split(".").pop();
    const name = `${req.body.recordId || "report-image"}-${Date.now()}`;
    const filename = `${name}.${ext}`;
    if (!req.body.filename) {
      req.body.filename = name;
    }
    req.body.imageUrl = `/uploads/reportImages/${filename}`;
    cb(null, filename);
  },
});

const deleteExistFile = async (req, res, next) => {
  try {
    const oldImageUrl = req.body.previousPath; // e.g. "/uploads/reportImages/img-123.jpg"

    if (oldImageUrl) {
      // Convert URL path to actual server path
      const filePath = path.join(process.cwd(), oldImageUrl);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("Old image deleted:", filePath);
      }
    }

    next(); // continue to multer upload
  } catch (err) {
    console.error("Image delete error:", err);
    next();
  }
};

module.exports = {
  commonFiles: multer({ storage }),
  reportFiles: multer({ storage: fileStorage }),
  deleteExistFile,
};
