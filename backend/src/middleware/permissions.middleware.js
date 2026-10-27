import ApiError from "../utils/ApiError.js";

export const ROLE_PERMISSIONS = Object.freeze({
  student: Object.freeze([
    "profile:read:self",
    "profile:update:self",
    "notes:download",
  ]),
  teacher: Object.freeze([
    "profile:read:self",
    "profile:update:self",
    "notes:download",
    "student:create",
    "student:read:directory",
    "academic:manage:assigned",
  ]),
  admin: Object.freeze([
    "profile:read:self",
    "profile:update:self",
    "notes:download",
    "student:create",
    "student:read:directory",
    "student:update:personal",
    "student:delete",
    "academic:manage:all",
    "teacher:manage",
  ]),
  superadmin: Object.freeze([
    "profile:read:self",
    "profile:update:self",
    "notes:download",
    "student:create",
    "student:read:directory",
    "student:update:personal",
    "student:delete",
    "academic:manage:all",
    "teacher:manage",
    "admin:manage",
    "system:permissions",
  ]),
});

/**
 * Route-level permission guard. Resource ownership and teacher subject/course
 * assignment must additionally be checked in the controller/service that knows
 * the target resource; this guard alone is not an object-level authorization.
 */
export const requirePermission = (permission) => (req, _res, next) => {
  const role = req.account?.role;
  if (!role || !ROLE_PERMISSIONS[role]?.includes(permission)) {
    return next(new ApiError(403, "You do not have permission to perform this action."));
  }
  return next();
};
