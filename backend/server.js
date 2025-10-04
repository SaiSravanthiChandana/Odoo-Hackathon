require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Expense API is running 🚀");
});

// connect DB + start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log("✅ Server running on port " + (process.env.PORT || 5000))
    );
  })
  .catch((err) => console.error("DB Error:", err));
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const expenseRoutes = require("./routes/expense");
app.use("/expenses", expenseRoutes);

const userRoutes = require("./routes/user");
app.use("/users", userRoutes);
