import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { Teacher } from "../models/teacher.model.js";

export const verifyJWT = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.accessToken || req.header("Authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) throw new ApiError(401, "Authentication required.");
  let decodedToken;
  try { decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); }
  catch { throw new ApiError(401, "Invalid or expired access token."); }
  const teacher = await Teacher.findById(decodedToken?._id).select(
    "-teacherPassword -teacherRefreshToken -emailVerificationCode -emailCodeExpiresAt -passwordVerificationCode -passCodeExpiresAt"
  );
  if (!teacher) throw new ApiError(401, "Invalid access token.");
  req.teacher = teacher;
  next();
});
