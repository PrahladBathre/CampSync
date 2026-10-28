import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addGrade,
  getAllGrades,
  getGradeById,
  gradeCount,
  updateGrade,
} from "../controllers/grade.controller.js";

const gradeRoutes = Router();
gradeRoutes.use(verifyJWT);

gradeRoutes.route("/count").get(gradeCount);
gradeRoutes.route("/").post(addGrade).get(getAllGrades);
gradeRoutes.route("/:id").get(getGradeById).patch(updateGrade);

// Export the router
export { gradeRoutes };
