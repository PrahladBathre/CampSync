import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

activitySchema.index({ date: -1 });

export const Activity = mongoose.model("Activity", activitySchema);
