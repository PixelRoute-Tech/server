const mongoose = require("mongoose");
const {deleteIfExists} = require("../utils/files")
const path = require("path");
const RecordImageSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
    },
    recordId: {
      type: String,
      required: true,
    },
    worksheetId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
      default: "",
    },
    preview:{
      type: String,
      required: true,
      default: "",
    },
    type: {
      type: String,
      default: "Photo",
    },
    description: {
      type: String,
      default: "",
    },
    fileName: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

RecordImageSchema.pre("deleteMany", async function (next) {
  const filter = this.getQuery();
  if (Object.keys(filter).length === 0) {
    console.warn("Attempted to call deleteMany without a filter. Aborting file deletion.");
    return next();
  }
  const docsToDelete = await this.model.find(filter, 'url preview fileName');
  if (docsToDelete.length > 0) {
    console.log(`Found ${docsToDelete.length} documents for deletion. Deleting files...`);
    docsToDelete.forEach(doc => {
      deleteIfExists(doc.url);
      deleteIfExists(doc.preview);
      if (doc.fileName) {
        const jsonFilePath = path.join('/uploads/imagepath/', `${doc.fileName}.json`);
        deleteIfExists(jsonFilePath);
      }
    });
  }
  next();
});

module.exports = mongoose.model("RecordImage", RecordImageSchema);
