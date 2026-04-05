import express from "express";
import Budget from "../models/Budget.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const budgets = await Budget.find();
  res.json(budgets);
});

router.post("/", async (req, res) => {
  const budget = await Budget.create(req.body);
  res.json(budget);
});

export default router;
