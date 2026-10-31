import { asyncHandler } from "../utils/asyncHandler.js";
import { Activity } from "../models/recentActivity.model.js";

export const recentActivityController = asyncHandler(async (_req, res) => {
  const activities = await Activity.find().sort({ date: -1 }).limit(4).lean().exec();
  return res.json(activities);
});
