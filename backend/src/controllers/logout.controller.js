import { asyncHandler } from "../utils/asyncHandler.js";
import Apiresponse from "../utils/Apiresponse.js";
import jwt from "jsonwebtoken";
import { Teacher } from "../models/teacher.model.js";

const cookieOptions = { httpOnly: true, secure: true, sameSite: "none", path: "/" };

export const logoutTeacherSession = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken && process.env.REFRESH_TOKEN_SECRET) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      if (decoded?._id) {
        await Teacher.updateOne({ _id: decoded._id }, { $pull: { teacherRefreshTokens: refreshToken } });
        await Teacher.updateOne(
          { _id: decoded._id, teacherRefreshToken: refreshToken },
          { $unset: { teacherRefreshToken: 1 } }
        );
      }
    } catch {
      // An expired/invalid refresh token should not prevent local sign-out.
    }
  }

  return res.clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .status(200)
    .json(new Apiresponse(200, {}, "Teacher logged out successfully."));
});
