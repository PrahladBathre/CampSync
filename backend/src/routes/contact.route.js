import { Router } from "express";
import { submitContactMessage } from "../controllers/contact.controller.js";

const contactRoutes = Router();
contactRoutes.post("/", submitContactMessage);
export { contactRoutes };
