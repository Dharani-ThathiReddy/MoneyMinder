import express from "express";
import Investment from "../models/Investment.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const investments = await Investment.find();
  res.json(investments);
});

router.post("/", async (req, res) => {
  const investment = await Investment.create(req.body);
  res.json(investment);
});

export default router;
