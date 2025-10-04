const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Create a user
router.post("/create", async (req, res) => {
  try {
    const { name, email, password, role, managerId } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      manager: managerId || null
    });

    await user.save();
    res.json({ message: "User created", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

module.exports = router;
