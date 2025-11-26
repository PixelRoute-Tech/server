const mongoose = require("mongoose");
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
    type:{
      type:String,
      default:"Photo"
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("RecordImage", RecordImageSchema);
