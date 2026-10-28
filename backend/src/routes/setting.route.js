import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  getSettings,
  updateSettings,

} from "../controllers/setting.controller.js"; // Corrected import path and names

const settingRoutes = Router();
settingRoutes.use(verifyJWT); 


settingRoutes.route("/").get(getSettings).patch(updateSettings); 


// Export the router
export {settingRoutes};