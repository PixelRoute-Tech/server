const mongoose = require("mongoose");
const { Job } = require("./Job.model");
const RecordImages = require("./RecordImage.model");
const WorksheetRecordSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
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
    console.log(updatedDoc);
  } catch (err) {
    console.log(err);
  }
});

WorksheetRecordSchema.pre("deleteMany", async function (next) {
  try {
    const filter = this.getFilter();
    const deletedRecords = await this.model
      .find(filter)
      .select({ recordId: 1 })
      .lean();
    if (deletedRecords.length > 0) {
      const recordIds = deletedRecords.map((record) => record.recordId);
      const deleteImages = await RecordImages.deleteMany({
        recordId: { $in: recordIds },
      });
      console.table(deleteImages);
      next();
    } else {
      next();
    }
  } catch (error) {
    console.log(
      "Error in WorksheetRecordSchema pre deleteMany hook => ",
      error
    );
    next(error);
  }
});

module.exports = mongoose.model("WorksheetRecord", WorksheetRecordSchema);
