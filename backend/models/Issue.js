const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Roads", "Water", "Electricity", "Sanitation", "Parks", "Safety", "Infrastructure", "Other"],
    required: true,
  },
  photo: {
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    filename: String,
  },
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      default: "",
    },
  },
  city: {
    type: String,
    required: true,
  },
  ward: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Submitted", "Acknowledged", "Assigned", "In Progress", "Resolved", "Closed"],
    default: "Submitted",
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
  upvotedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  comments: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      userName: String,
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Issue", issueSchema);