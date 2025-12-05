const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { deleteIfExists } = require("../utils/files");
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

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    // Keep filename same for both file & preview
    if (!req.body.filename) {
      const baseName = req.body.recordId || "report-image";
      const timestamp = Date.now();
      req.body.filename = `${baseName}-${timestamp}`;
    }

    // Create final file name based on the field
    let finalFileName = "";

    if (file.fieldname === "file") {
      finalFileName = `${req.body.filename}-file.${ext}`;
      req.body.fileUrl = `/uploads/reportImages/${finalFileName}`;
    }

    if (file.fieldname === "preview") {
      finalFileName = `${req.body.filename}-preview.${ext}`;
      req.body.previewUrl = `/uploads/reportImages/${finalFileName}`;
    }

    cb(null, finalFileName);
  },
});

const deleteExistFile = async (req, res, next) => {
  try {
    const oldFile = req.query.previousfilepath; // old file path
    const oldPreview = req.query.previouspreviewpath; // old preview path
    console.table(req.query);
    if (req.method == "DELETE") {
      if (oldFile || oldPreview) {
        deleteIfExists(oldFile);
        deleteIfExists(oldPreview);
      }
    } else {
      if (oldPreview) {
        deleteIfExists(oldPreview);
      }
    }
    next();
  } catch (err) {
    console.error("Delete error:", err);
    next();
  }
};

module.exports = {
  commonFiles: multer({ storage }),
  reportFiles: multer({ storage: fileStorage }),
  deleteExistFile,
};
