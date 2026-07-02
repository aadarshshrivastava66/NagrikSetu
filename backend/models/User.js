const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  ward: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["citizen", "gov", "admin"],
    default: "citizen",
  },
  department:{
    type:String,
    enum:["Roads", "Water", "Electricity", "Sanitation", "Parks", "Safety", "Infrastructure"]
  },
  civicPoints: {
    type: Number,
    default: 0,
  },
  badges: {
    type: [String],
    default: [],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);