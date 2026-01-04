const mongoose = require("mongoose");
const moment = require("moment");
const Counter = require("./Counter.model");
const Settings = require("./Settings.model")
const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    required: false,
    unique: false,
  },
  userId: {
    type: String,
    required: false,
    unique: true,
  },
  companyId: {
    type: String,
    required: false,
    unique: false,
  },
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  shortName: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    required: false,
    default:"user"
  },
  designation: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: false,
  },
  qualification: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    default: moment().format("DD-MM-YYYY hh:mm A"),
  },
});

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.id) return next();
  try {
    const counter = await Counter.findByIdAndUpdate(
      "userId",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const seqNumber = counter.seq.toString().padStart(5, "0"); // "00001"
    user.userId = `ERP${seqNumber}`;
    user.id = `ERP${seqNumber}`;
    const settings = new Settings({
      userId: `ERP${seqNumber}`,
      primaryColor: "174 77% 56%",
      fontFamily: "Montserrat, system-ui, sans-serif",
      fontSize: "small",
      borderRadius: "small",
    });
    settings.save();
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("User", UserSchema);
