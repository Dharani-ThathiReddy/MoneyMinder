import express from "express";
import Goal from "../models/Goal.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const goals = await Goal.find();
  res.json(goals);
});

router.post("/", async (req, res) => {
  const goal = await Goal.create(req.body);
  res.json(goal);
});

export default router;
