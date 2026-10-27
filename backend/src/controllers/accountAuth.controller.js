import jwt from "jsonwebtoken";
import { Account } from "../models/account.model.js";
import ApiError from "../utils/ApiError.js";
import Apiresponse from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const cookieOptions = () => ({ httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 30 * 60 * 1000 });
const createToken = (account) => {
  if (!process.env.ACCESS_TOKEN_SECRET) throw new Error("ACCESS_TOKEN_SECRET is not configured");
  return jwt.sign({ sub: account._id.toString(), role: account.role, tokenVersion: account.tokenVersion }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "30m" });
};
const publicAccount = (account) => ({ id: account._id, displayName: account.displayName, email: account.email, username: account.username || "", phone: account.phone || "", avatarUrl: account.avatarUrl || "", role: account.role, status: account.status, studentRecordId: account.studentRecordId || null, teacherRecordId: account.teacherRecordId || null });

export const loginAccount = asyncHandler(async (req, res) => {
  const identifier = String(req.body?.identifier || "").trim().toLowerCase();
  const password = req.body?.password;
  if (!identifier || typeof password !== "string" || !password) throw new ApiError(400, "Enter your username or email and password.");
  const account = await Account.findOne({ $or: [{ email: identifier }, { username: identifier }] }).select("+passwordHash");
  const valid = account && account.status === "active" && await account.verifyPassword(password);
  if (!valid) throw new ApiError(401, "Invalid credentials or account unavailable.");
  return res.status(200).cookie("accessToken", createToken(account), cookieOptions()).json(new Apiresponse(200, publicAccount(account), "Signed in successfully."));
});
export const getAccountSession = asyncHandler(async (req, res) => res.status(200).json(new Apiresponse(200, publicAccount(req.account), "Session restored.")));
export const logoutAccount = asyncHandler(async (req, res) => {
  await Account.updateOne({ _id: req.account._id }, { $inc: { tokenVersion: 1 } });
  const options = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" };
  return res.clearCookie("accessToken", options).clearCookie("refreshToken", options).status(200).json(new Apiresponse(200, {}, "Signed out successfully."));
});
export const updateOwnProfile = asyncHandler(async (req, res) => {
  const updates = {};
  for (const key of ["displayName", "phone"]) {
    if (!Object.hasOwn(req.body || {}, key)) continue;
    if (typeof req.body[key] !== "string") throw new ApiError(400, key + " must be a string.");
    const value = req.body[key].trim();
    if (key === "displayName" && (!value || value.length > 120)) throw new ApiError(400, "Display name must be between 1 and 120 characters.");
    if (key === "phone" && value.length > 32) throw new ApiError(400, "Phone number is too long.");
    updates[key] = value;
  }
  if (!Object.keys(updates).length) throw new ApiError(400, "No supported profile fields were supplied.");
  const account = await Account.findByIdAndUpdate(req.account._id, { $set: updates }, { new: true, runValidators: true });
  return res.status(200).json(new Apiresponse(200, publicAccount(account), "Profile updated."));
});
export const changeOwnPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (typeof currentPassword !== "string" || typeof newPassword !== "string") throw new ApiError(400, "Current password and new password are required.");
  if (newPassword.length < 10 || newPassword.length > 128 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/\d/.test(newPassword)) throw new ApiError(400, "New password must be 10–128 characters and include uppercase, lowercase, and a number.");
  const account = await Account.findById(req.account._id).select("+passwordHash");
  if (!(await account.verifyPassword(currentPassword))) throw new ApiError(401, "Current password is incorrect.");
  account.passwordHash = newPassword;
  account.tokenVersion += 1;
  await account.save();
  const options = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" };
  return res.clearCookie("accessToken", options).clearCookie("refreshToken", options).status(200).json(new Apiresponse(200, {}, "Password changed. Sign in again with your new password."));
});
