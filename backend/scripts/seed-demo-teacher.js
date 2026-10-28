import "dotenv/config";
import mongoose from "mongoose";
import { Teacher } from "../src/models/teacher.model.js";

// This is an explicit, one-time operator script. It never runs during app startup.
if (process.env.SEED_DEMO_TEACHER !== "true") {
  throw new Error("Refusing to seed: set SEED_DEMO_TEACHER=true explicitly.");
}
if (process.env.NODE_ENV === "production" && process.env.ALLOW_DEMO_TEACHER_IN_PRODUCTION !== "true") {
  throw new Error("Production seeding requires ALLOW_DEMO_TEACHER_IN_PRODUCTION=true.");
}
const password = process.env.DEMO_TEACHER_PASSWORD;
if (typeof password !== "string" || password.length < 12 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
  throw new Error("Set DEMO_TEACHER_PASSWORD to a unique password of at least 12 characters, including an uppercase letter and a number.");
}
if (!process.env.DATABASE || !process.env.DB_NAME) {
  throw new Error("DATABASE and DB_NAME are required to target the app database.");
}

const username = (process.env.DEMO_TEACHER_USERNAME || "demoteacher").trim().toLowerCase();
const email = (process.env.DEMO_TEACHER_EMAIL || "demo.teacher@example.com").trim().toLowerCase();
const teacherId = process.env.DEMO_TEACHER_ID || "UICSADEMO0001";
const contact = process.env.DEMO_TEACHER_CONTACT || "9000000001";

try {
  await mongoose.connect(`${process.env.DATABASE.replace(/\/$/, "")}/${process.env.DB_NAME}`, { serverSelectionTimeoutMS: 15000 });
  const existing = await Teacher.findOne({
    $or: [{ teacherUsername: username }, { teacherEmail: email }, { teacherId }, { teacherContactInfo: contact }],
  });
  if (existing) {
    throw new Error("A teacher already uses the demo username/email/ID/contact. No changes were made; inspect the existing record before retrying.");
  }

  const teacher = await Teacher.create({
    teacherFullName: "Demo Teacher",
    teacherGender: "Male",
    teacherEmail: email,
    teacherUsername: username,
    teacherPassword: password,
    teacherId,
    teacherContactInfo: contact,
    teacherAssignedSubjects: [],
    isAuthenticated: true,
    emailVerificationCode: "",
    emailCodeExpiresAt: 0,
  });
  console.log("Created demo teacher:", { username, email, id: teacher._id.toString() });
  console.log("Password was read from DEMO_TEACHER_PASSWORD and was not printed.");
} finally {
  await mongoose.disconnect();
}
