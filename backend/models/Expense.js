const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  category: String,
  description: String,
  date: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  approversSequence: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  currentStep: { type: Number, default: 0 },
  approvals: [
    {
      approver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: String,
      comments: String,
      at: Date
    }
  ],
  receipt: { type: String } // store file path
});

module.exports = mongoose.model("Expense", ExpenseSchema);