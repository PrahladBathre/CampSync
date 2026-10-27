import jwt from "jsonwebtoken";
import { Account } from "../models/account.model.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const requireAccount = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.accessToken || req.header("Authorization")?.match(/^Bearer\\s+(.+)$/i)?.[1];
  if (!token) throw new ApiError(401, "Authentication required.");
  let payload;
  try { payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); }
  catch { throw new ApiError(401, "Invalid or expired session."); }
  if (!payload?.sub || !Number.isInteger(payload?.tokenVersion)) throw new ApiError(401, "Invalid session.");
  const account = await Account.findById(payload.sub).select("+passwordHash");
  if (!account || account.status !== "active" || account.tokenVersion !== payload.tokenVersion) {
    throw new ApiError(401, "Session is no longer valid.");
  }
  req.account = account;
  next();
});

export const allowRoles = (...roles) => (req, _res, next) => {
  if (!req.account || !roles.includes(req.account.role)) return next(new ApiError(403, "You do not have permission to perform this action."));
  next();
};
