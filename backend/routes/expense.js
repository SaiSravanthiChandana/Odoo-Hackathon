const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// --- Auth middleware ---
function auth(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// --- Multer setup for file uploads ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// --- Submit new expense with optional receipt ---
router.post("/", auth, upload.single("receipt"), async (req, res) => {
  try {
    const { amount, currency, category, description, date } = req.body;

    const employee = await User.findById(req.user.id).populate("manager");

    if (!employee) return res.status(404).json({ error: "User not found" });

    // Build approvers list
    let approvers = [];
    if (employee.manager) approvers.push(employee.manager._id);

    const expense = new Expense({
      amount,
      currency,
      category,
      description,
      date,
      createdBy: employee._id,
      approversSequence: approvers,
      currentStep: 0,
      status: "Pending",
      receipt: req.file ? req.file.path : undefined
    });

    await expense.save();
    res.json({ message: "Expense submitted", expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit expense" });
  }
});

// --- Get my expenses (Employee) ---
router.get("/my", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ createdBy: req.user.id });
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

// --- Get pending approvals (Manager) ---
router.get("/pending", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({
      status: "Pending",
      [`approversSequence.${0}`]: req.user.id
    }).populate("createdBy", "name email");
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

// --- Approve or Reject an expense ---
router.post("/:id/approve", auth, async (req, res) => {
  try {
    const { action, comments } = req.body; // action = "approve" | "reject"
    const expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ error: "Expense not found" });

    expense.approvals.push({
      approver: req.user.id,
      status: action === "approve" ? "Approved" : "Rejected",
      comments,
      at: new Date()
    });

    if (action === "reject") {
      expense.status = "Rejected";
    } else {
      if (expense.currentStep < expense.approversSequence.length - 1) {
        expense.currentStep++;
      } else {
        expense.status = "Approved";
      }
    }

    await expense.save();
    res.json({ message: "Action recorded", expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process action" });
  }
});

module.exports = router;