import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import globalErrorHandler from "./middleware/globalError.middleware.js";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Render health check: confirms the API process and MongoDB are both ready.
app.get("/api/health", (_req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  res.status(databaseReady ? 200 : 503).json({
    success: databaseReady,
    status: databaseReady ? "healthy" : "database_unavailable",
    database: databaseReady ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

import { attendanceRoutes, courseRoutes, gradeRoutes, settingRoutes, studentRoutes, subjectRoutes, teacherRoutes } from "./routes/app.routes.js";
import { recentActivityRoute } from "./routes/recentActivity.route.js";
import { countDocuments } from "./routes/countDoc.js";
import { accountAuthRoutes } from "./routes/accountAuth.route.js";
import { contactRoutes } from "./routes/contact.route.js";

app.use((req, res, next) => {
  const allowed = "Department";
  if (!req.path.startsWith("/api") && !allowed.includes(req.path)) {
    return res.status(403).json({ success: false, message: "Access denied. Only API routes are allowed." });
  }
  next();
});

app.use("/api/auth", accountAuthRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/setting", settingRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api", recentActivityRoute);
app.use("/api", countDocuments);
app.use(globalErrorHandler);
export { app };
