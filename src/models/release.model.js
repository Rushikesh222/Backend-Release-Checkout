// backend/models/Release.js
import mongoose from "mongoose";

const stepSchema = new mongoose.Schema({
  name: String,
  completed: { type: Boolean, default: false },
});

const releaseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  additionalInfo: String,
  steps: [stepSchema],
}, { timestamps: true });

// Auto status
releaseSchema.methods.getStatus = function () {
  const completed = this.steps.filter(s => s.completed).length;

  if (completed === 0) return "planned";
  if (completed === this.steps.length) return "done";
  return "ongoing";
};

export default mongoose.models.Release || mongoose.model("Release", releaseSchema);