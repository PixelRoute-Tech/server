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

const createDiskStorage = (uploadDir, prefix = "uploaded") =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dirName = `${uploadDir}${req.params.id || ""}`;
      if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
      }
      cb(null, dirName);
    },

    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);

      const uniqueId =
        Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

      const cleanName = file.originalname
        .replace(ext, "")
        .replace(/\s+/g, "_")
        .toLowerCase();

      const finalName = `${prefix}-${cleanName}_${uniqueId}${ext}`;

      cb(null, finalName);
    },
  });

const attachFilePaths = (req, res, next) => {
  if (!req.files && !req.file) {
    return next();
  }
  if (req.body.previousFiles) {
    req.body.filePaths = JSON.parse(req.body.previousFiles);
  } else {
    req.body.filePaths = [];
  }
  if(req.body.deletedFiles){
    const deleted = JSON.parse(req.body.deletedFiles)
    deleted.forEach(i=>{
      deleteIfExists(i)
    })
  }
  if (req.files && Array.isArray(req.files)) {
    const newFilePaths = req.files.map((file) => ({
      fileName: file.filename,
      size: file.size || 0,
      url: `/${file.path.replace(/\\/g, "/")}`,
    }));
    req.body.filePaths = [...newFilePaths, ...req.body.filePaths];
  } else if (req.file) {
    req.body.filePaths = [
      ...req.body.filePaths,
      {
        fileName: req.file.filename,
        size: req.file.size || 0,
        url: `/${req.file.path.replace(/\\/g, "/")}`,
      },
    ];
  }

  next();
};

module.exports = {
  commonFiles: multer({ storage }),
  reportFiles: multer({ storage: fileStorage }),
  multiFiles: multer({
    storage: createDiskStorage("uploads/job-request/", "job-rquest"),
  }),
  attachFilePaths,
  deleteExistFile,
};
