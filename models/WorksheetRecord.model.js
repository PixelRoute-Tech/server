const mongoose = require("mongoose");
const {Job} = require("./Job.model");
const WorksheetRecordSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
      unique: true,
    },
    recordId: {
      type: String,
      required: true,
      unique: true,
    },
    clientId: {
      type: String,
      required: true,
      unique: false,
    },
    worksheetId: {
      type: String,
      required: true,
    },
    // 👇 Dynamic data field
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

WorksheetRecordSchema.post("save", async function (doc) {
  try {
    const jobId = doc.jobId;
    const testMethod = doc.worksheetId;
    const updatedDoc = await Job.findOneAndUpdate(
      { jobId, testMethod },
      { $set: { status: "Completed" } },
      { new: true }
    );
    console.log(updatedDoc)
  } catch (err) {
    console.log(err);
  }
});

module.exports = mongoose.model("WorksheetRecord", WorksheetRecordSchema);
