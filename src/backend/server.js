import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import xml2js from "xml2js";
import csv from "csv-parser";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// --------------------
// MongoDB Connection
// --------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// --------------------
// Schemas
// --------------------

// User Schema
const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  income: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
});

const User = mongoose.model("User", userSchema);

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  category: String,
  date: { type: Date, default: Date.now },
  description: String,
});

const Transaction = mongoose.model("Transaction", transactionSchema);

// --------------------
// Routes
// --------------------

// Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const user = new User({ fullName, email, password });
    await user.save();
    res.json({ message: "Signup successful", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update Dashboard (income/balance)
app.put("/api/dashboard/:id", async (req, res) => {
  try {
    const { income, balance } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { income, balance },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Add single transaction
app.post("/api/transactions/:userId", async (req, res) => {
  try {
    const { amount, category, date, description } = req.body;
    const transaction = new Transaction({
      userId: req.params.userId,
      amount,
      category,
      date,
      description,
    });
    await transaction.save();
    res.json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get transactions for a user
app.get("/api/transactions/:userId", async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Upload CSV or XML transactions
app.post("/api/transactions/upload/:userId", upload.single("file"), async (req, res) => {
  try {
    const userId = req.params.userId;
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const ext = file.originalname.split(".").pop();
    let transactions = [];

    if (ext === "xml") {
      const data = fs.readFileSync(file.path, "utf8");
      await xml2js.parseStringPromise(data).then(result => {
        transactions = result.transactions.transaction.map(t => ({
          userId,
          amount: Number(t.amount[0]),
          category: t.category[0],
          date: t.date ? new Date(t.date[0]) : new Date(),
          description: t.description ? t.description[0] : "",
        }));
      });
    } else if (ext === "csv") {
      const results = [];
      fs.createReadStream(file.path)
        .pipe(csv())
        .on("data", data => results.push(data))
        .on("end", async () => {
          transactions = results.map(t => ({
            userId,
            amount: Number(t.amount),
            category: t.category,
            date: t.date ? new Date(t.date) : new Date(),
            description: t.description || "",
          }));
          await Transaction.insertMany(transactions);
          fs.unlinkSync(file.path);
          return res.json({ message: "Transactions uploaded", count: transactions.length });
        });
      return; // CSV handled asynchronously
    } else {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    await Transaction.insertMany(transactions);
    fs.unlinkSync(file.path);
    res.json({ message: "Transactions uploaded", count: transactions.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// --------------------
// Start Server
// --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
