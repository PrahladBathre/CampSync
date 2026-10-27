import mongoose from "mongoose";
import bcrypt from "bcrypt";

const accountSchema = new mongoose.Schema({
  displayName: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  username: { type: String, lowercase: true, trim: true, sparse: true, unique: true },
  phone: { type: String, trim: true, default: "" },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ["student", "teacher", "admin", "superadmin"], required: true, immutable: true },
  status: { type: String, enum: ["active", "pending", "suspended"], default: "pending", index: true },
  avatarUrl: { type: String, default: "" },
  teacherRecordId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", default: null, index: true },
  studentRecordId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", default: null, index: true },
  tokenVersion: { type: Number, default: 0, min: 0 },
  emailVerifiedAt: { type: Date, default: null },
  pendingEmail: { type: String, lowercase: true, trim: true, default: null },
}, { timestamps: true, minimize: false });

accountSchema.pre("save", async function () {
  if (this.isModified("passwordHash") && !/^\\$2[aby]\\$/.test(this.passwordHash)) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  }
});

accountSchema.methods.verifyPassword = function (candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

accountSchema.set("toJSON", { transform(_doc, ret) {
  delete ret.passwordHash;
  delete ret.tokenVersion;
  delete ret.__v;
  return ret;
} });

export const Account = mongoose.model("Account", accountSchema);
