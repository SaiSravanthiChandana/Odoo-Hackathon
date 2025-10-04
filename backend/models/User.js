const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // will be hashed
  role: { type: String, enum: ["Admin", "Manager", "Employee"], default: "Employee" },
  company: { type: mongoose.Types.ObjectId, ref: "Company" },
  manager: { type: mongoose.Types.ObjectId, ref: "User" }, // for Employee
  isManagerApprover: { type: Boolean, default: true }
});

module.exports = mongoose.model("User", UserSchema);