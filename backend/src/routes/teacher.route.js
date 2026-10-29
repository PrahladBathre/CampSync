import { Router } from "express";
import {
  registerTeacher, loginTeacher, refreshAccessToken,
  changePassword, getCurrentTeacher, updateTeacherDetails, updateTeacherAvatar,
  getTeacherById, getAllTeachers, teacherCount, confirmTeacherEmailVerification,
  resendEmailVerification,
} from "../controllers/teacher.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { logoutTeacherSession } from "../controllers/logout.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const teacherRoutes = Router();
teacherRoutes.route("/refresh-token").post(refreshAccessToken);
teacherRoutes.route("/count").get(teacherCount);
teacherRoutes.route("/").get(verifyJWT, getAllTeachers);
teacherRoutes.route("/register").post(upload.single("teacherAvatar"), registerTeacher);
teacherRoutes.route("/verifyTeacher").post(confirmTeacherEmailVerification);
teacherRoutes.route("/resend-code").post(resendEmailVerification);
teacherRoutes.route("/login").post(loginTeacher);
teacherRoutes.route("/logout").post(logoutTeacherSession);
teacherRoutes.route("/change-password").patch(verifyJWT, changePassword);
teacherRoutes.route("/user").get(verifyJWT, getCurrentTeacher);
teacherRoutes.route("/update-details").patch(verifyJWT, updateTeacherDetails);
teacherRoutes.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateTeacherAvatar);
teacherRoutes.route("/:teacherId").get(verifyJWT, getTeacherById);
export { teacherRoutes };
