const mongoose = require("mongoose");
const Counter = require("./Counter.model");
const Notification = require("./Notification.model");
const moment = require("moment");
const WorksheetRecords = require("../models/WorksheetRecord.model");
const Jobschema = new mongoose.Schema(
  {
    jobId: { type: String, required: true },
    testMethod: { type: String, required: true },
    testSpec: { type: String, required: true },
    acceptanceSpec: { type: String, required: true },
    toTable: { type: String, required: true },
    testProcedure: { type: String, required: true },
    tech: { type: String, required: true },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Completed", "In progress"],
    },
  },
  { timestamps: true }
);

const OHSSchema = new mongoose.Schema(
  {
    swms: { type: Boolean, required: false },
    jsa: { type: Boolean, required: false },
    safetyBoots: { type: Boolean, required: false },
  },
  { _id: false }
);

const PPESchema = new mongoose.Schema(
  {
    hardhat: { type: Boolean, required: false },
    bumpGap: { type: Boolean, required: false },
    highVis: { type: Boolean, required: false },
    longSleeve: { type: Boolean, required: false },
    safetyGlasses: { type: Boolean, required: false },
    safetyBoots: { type: Boolean, required: false },
    faceShield: { type: Boolean, required: false },
    weldGlass: { type: Boolean, required: false },
    hearingProtection: { type: Boolean, required: false },
    electricalProtection: { type: Boolean, required: false },
    respiratoryProtection: { type: Boolean, required: false },
  },
  { _id: false }
);

const EquipmentSchema = new mongoose.Schema(
  {
    value: { type: String, required: false },
  },
  { _id: false }
);

const HSEProcedureSchema = new mongoose.Schema(
  {
    value: { type: String, required: false },
  },
  { _id: false }
);

// Main schema
const JobRequestSchema = new mongoose.Schema(
  {
    jobId: { type: String, unique: true, required: false },
    createdAt: { type: Date, default: moment().toDate() },
    startDate: { type: Date, required: true },
    lastDate: { type: Date, required: true },
    clientId: { type: String, required: true },
    clientName: { type: String, required: true },
    clientAddress: { type: String, required: false },
    purchaseOrder: { type: String, default: "" },
    summary: { type: String, required: true },
    detailsProvided: { type: String, required: true },
    comment: { type: String, required: false },
    timeRequired: { type: String, required: true },
    requiredDocument: { type: String, required: false },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Completed", "Rejected"],
      default: "Pending",
    },
    /* ---------- safety fields---------- */
    ohsRequirements: { type: OHSSchema, required: false },
    safetyReference: { type: String, required: false },
    ppeRequired: { type: PPESchema, required: false },
    equipmentList: { type: [EquipmentSchema], default: [] },
    siteInduction: { type: String, required: false },
    hseProcedures: { type: [HSEProcedureSchema], default: [] },
    createdBy: { type: String, required: false },
  },
  { timestamps: true }
);

JobRequestSchema.pre("save", async function (next) {
  const job = this;
  if (job.jobId) return next();
  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "jobReqId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const seqNumber = counter.seq.toString().padStart(5, "0"); // "00001"
    job.jobId = `JOB${seqNumber}`;
    next();
  } catch (err) {
    console.log("error in JobRequestSchema pre save hook => ", error);
    next(err);
  }
});

Jobschema.pre("insertMany", function (next, docs) {
  const createdBy = this.$locals?.createdBy;
  const jobId = this.$locals?.jobId;

  if (createdBy || jobId) {
    docs.forEach((doc) => {
      if (createdBy) doc.createdBy = createdBy;
      if (jobId) doc.jobId = jobId;
    });
  }

  next();
});

Jobschema.post("insertMany", async function (docs) {
  try {
    let notifictionArray = [];
    let userIds = {};
    docs.forEach((d) => {
      let userId = d.tech;
      if (userIds[userId]) {
        userIds[userId].count++;
        notifictionArray[
          userIds[userId].index
        ].message = `You have ${userIds[userId].count} new job assignments.`;
      } else {
        userIds[userId] = {
          index: notifictionArray.length,
          count: 1,
        };
        notifictionArray = [
          ...notifictionArray,
          {
            userId,
            message: `You have a new job assignment.`,
            title: "New Job Schedules",
            type: "default",
            isRead: false,
          },
        ];
      }
    });

    await Notification.insertMany(notifictionArray);
  } catch (err) {
    console.error("Notification insert error:", err);
  }
});

Jobschema.post("updateOne", async function (result) {
  try {
    const query = this.getQuery();
    const update = this.getUpdate();

    // check if updateOne created a new doc (upsert)
    const wasUpserted = result?.upsertedCount > 0 || result?.upsertedId;

    // if no tech in update, skip
    const tech = update?.tech || query?.tech;
    if (!tech) return;

    // Prepare message
    let existingNotif = await Notification.findOne({
      userId: tech,
      isRead: false,
    });

    if (existingNotif) {
      // Update count message
      const updatedCount = (existingNotif.count || 1) + 1;

      await Notification.updateOne(
        { userId: tech },
        {
          $set: {
            message: `You have ${updatedCount} new job assignments.`,
            updatedAt: new Date(),
          },
          $inc: { count: 1 },
        }
      );
    } else {
      // Insert new notification
      await Notification.create({
        userId: tech,
        title: "New Job Schedules",
        message: "You have a new job assignment.",
        type: "default",
        isRead: false,
        count: 1,
      });
    }
  } catch (err) {
    console.error("Notification update error:", err);
  }
});

JobRequestSchema.pre("deleteMany", async function (next) {
  try {
    const filter = this.getFilter();
    const jobRequestsToDelete = await this.model
      .find(filter)
      .select("jobId")
      .exec();
    const jobIds = jobRequestsToDelete.map((doc) => doc.jobId);
    if (jobIds.length > 0) {
      const deletedItems = await JobModel.deleteMany({
        jobId: { $in: jobIds },
      });
      console.log(
        `Cascaded deletion: Deleted ${
          deletedItems.deletedCount
        } Job(s) for JobRequests with IDs: ${jobIds.join(", ")}.`
      );
    } else {
      console.log(
        "No JobRequests found matching the criteria, skipping cascade."
      );
    }

    next();
  } catch (error) {
    console.error("Error in JobRequestSchema pre deleteMany hook", error);
  }
});

JobRequestSchema.pre("findOneAndDelete", async function (next) {
  try {
    const filter = this.getFilter();
    const jobRequestsToDelete = await this.model
      .find(filter)
      .select("jobId")
      .exec();
    const jobIds = jobRequestsToDelete.map((doc) => doc.jobId);
    if (jobIds.length > 0) {
      const deletedItems = await JobModel.deleteMany({
        jobId: { $in: jobIds },
      });
      console.log(
        `Cascaded deletion: Deleted ${
          deletedItems.deletedCount
        } Job(s) for JobRequests with IDs: ${jobIds.join(", ")}.`
      );
    } else {
      console.log(
        "No JobRequests found matching the criteria, skipping cascade."
      );
    }

    next();
  } catch (error) {
    console.log("Error in JobRequestSchema pre deleteMany hook", error);
  }
});

Jobschema.pre("deleteMany", async function (next) {
  try {
    const filter = this.getFilter();
    const jobsToDelete = await this.model
      .find(filter)
      .select({ _id: 1, jobId: 1, testMethod: 1 })
      .lean();
    const recordsId = jobsToDelete.map(
      (doc) => `record_${doc.jobId}_${doc.testMethod}`
    );
    if (recordsId.length > 0) {
      const deletedItems = await WorksheetRecords.deleteMany({
        recordId: { $in: recordsId },
      });
      console.table({
        deletedItems,
        recordsId: recordsId.join(","),
      });
    } else {
      console.log(
        "No JobRequests found matching the criteria, skipping cascade."
      );
    }
  } catch (error) {
    console.log("Jobschema pre deleteMany error =>", error);
    next(error);
  }
});

const JobRequestModel = mongoose.model("JobRequest", JobRequestSchema);
const JobModel = mongoose.model("Job", Jobschema);

module.exports = {
  JobRequestSchema: JobRequestModel,
  Job: JobModel,
};
