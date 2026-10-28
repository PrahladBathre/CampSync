import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// This script intentionally does not read the app's DATABASE variable.
// Point TEST_MONGODB_URI at a dedicated disposable database, e.g. .../campsync_test.
const uri = process.env.TEST_MONGODB_URI;
if (process.env.SEED_DEMO_ACCOUNTS !== "true") {
  throw new Error("Refusing to seed: set SEED_DEMO_ACCOUNTS=true explicitly.");
}
if (!uri) throw new Error("TEST_MONGODB_URI is required.");
let parsed;
try { parsed = new URL(uri); } catch { throw new Error("TEST_MONGODB_URI is not a valid MongoDB URI."); }
const databaseName = parsed.pathname.replace(/^\//, "").split("/")[0];
if (!databaseName || !/(^test$|_test$|^campsync[-_]test$)/i.test(databaseName)) {
  throw new Error("Refusing to seed: database name must be test or end in _test (e.g. campsync_test).");
}
if (/prod|production|live/i.test(databaseName)) {
  throw new Error("Refusing to seed a production-like database.");
}

const demoAccounts = [
  { role: "superadmin", username: "demo.superadmin", email: "demo.superadmin@example.com", displayName: "Demo Super Admin", password: process.env.DEMO_SUPERADMIN_PASSWORD },
  { role: "admin", username: "demo.admin", email: "demo.admin@example.com", displayName: "Demo Admin", password: process.env.DEMO_ADMIN_PASSWORD },
  { role: "teacher", username: "demo.teacher", email: "demo.teacher@example.com", displayName: "Demo Teacher", password: process.env.DEMO_TEACHER_PASSWORD },
  { role: "student", username: "demo.student", email: "demo.student@example.com", displayName: "Demo Student", password: process.env.DEMO_STUDENT_PASSWORD },
];
if (demoAccounts.some(({ password }) => typeof password !== "string" || password.length < 12)) {
  throw new Error("Set all four DEMO_*_PASSWORD variables to unique passwords of at least 12 characters.");
}
if (new Set(demoAccounts.map(({ password }) => password)).size !== demoAccounts.length) {
  throw new Error("Each demo account must have a different password.");
}

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  const Account = mongoose.models.Account || mongoose.model("Account", new mongoose.Schema({
    displayName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    username: { type: String, lowercase: true, trim: true, sparse: true, unique: true },
    phone: { type: String, default: "" },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["student", "teacher", "admin", "superadmin"], required: true },
    status: { type: String, enum: ["active", "pending", "suspended"], default: "pending" },
    avatarUrl: { type: String, default: "" },
    teacherRecordId: { type: mongoose.Schema.Types.ObjectId, default: null },
    studentRecordId: { type: mongoose.Schema.Types.ObjectId, default: null },
    tokenVersion: { type: Number, default: 0, min: 0 },
    emailVerifiedAt: { type: Date, default: null },
    pendingEmail: { type: String, default: null },
  }, { timestamps: true }));
  for (const demo of demoAccounts) {
    const existing = await Account.findOne({ $or: [{ email: demo.email }, { username: demo.username }] });
    if (existing) {
      console.log("SKIPPED existing account:", demo.username, "(no password/role changes made)");
      continue;
    }
    const passwordHash = await bcrypt.hash(demo.password, 12);
    await Account.create({
      displayName: demo.displayName,
      email: demo.email,
      username: demo.username,
      passwordHash,
      role: demo.role,
      status: "active",
      emailVerifiedAt: new Date(),
    });
    console.log("CREATED:", demo.username, "| role:", demo.role, "| id:", (await Account.findOne({ username: demo.username }).select("_id"))._id.toString());
  }
  console.log("Demo seed finished for database:", databaseName);
} finally {
  await mongoose.disconnect();
}
