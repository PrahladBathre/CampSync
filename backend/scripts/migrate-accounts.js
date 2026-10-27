/**
 * Read-only shared-account migration planner. It reports candidate records and
 * duplicate-email collisions without changing database state. Use staging only.
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Teacher } from "../src/models/teacher.model.js";
import { Student } from "../src/models/student.model.js";
import { Account } from "../src/models/account.model.js";

dotenv.config({ path: process.env.ENV_FILE || "./env" });
const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!uri) {
  console.error("Missing MONGODB_URI or MONGO_URI. No database was accessed.");
  process.exitCode = 1;
} else {
  try {
    await mongoose.connect(uri);
    const [teachers, students, accounts] = await Promise.all([
      Teacher.find({}, "_id teacherFullName teacherEmail teacherUsername teacherContactInfo isAuthenticated").lean(),
      Student.find({}, "_id studentFullName studentEmail studentContactNumber studentEnrollmentNumber").lean(),
      Account.find({}, "_id email username role teacherRecordId studentRecordId").lean(),
    ]);
    const normalize = (value) => String(value || "").trim().toLowerCase();
    const owners = new Map();
    for (const row of [...teachers.map((x) => ({ ...x, kind: "teacher", email: x.teacherEmail })), ...students.map((x) => ({ ...x, kind: "student", email: x.studentEmail }))]) {
      const email = normalize(row.email);
      if (email) owners.set(email, [...(owners.get(email) || []), { kind: row.kind, id: String(row._id) }]);
    }
    console.log(JSON.stringify({ mode: "READ_ONLY_DRY_RUN", counts: { teachers: teachers.length, students: students.length, accounts: accounts.length }, existingLinks: { teacher: accounts.filter((x) => x.teacherRecordId).length, student: accounts.filter((x) => x.studentRecordId).length }, candidates: { teacher: teachers.filter((x) => normalize(x.teacherEmail)).length, student: students.filter((x) => normalize(x.studentEmail)).length }, emailCollisions: [...owners.entries()].filter(([, rows]) => rows.length > 1).map(([email, records]) => ({ email, records })), notes: ["No writes were performed.", "Never auto-merge records on email alone.", "Legacy password hashes are not copied by this planner.", "Review orphaned records and identity ownership before designing a write migration."] }, null, 2));
  } catch (error) {
    console.error("Read-only migration planning failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}
