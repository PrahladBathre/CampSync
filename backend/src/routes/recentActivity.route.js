import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { recentActivityController } from "../controllers/recentActivity.controller.js";

export const recentActivityRoute = Router();
recentActivityRoute.use(verifyJWT);

recentActivityRoute.get("/v1/recentactivity", recentActivityController);
