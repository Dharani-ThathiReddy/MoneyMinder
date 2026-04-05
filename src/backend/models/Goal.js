import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  targetAmount: Number,
  progress: Number,
});

export default mongoose.model("Goal", goalSchema);
