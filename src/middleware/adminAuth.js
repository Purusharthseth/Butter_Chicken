import ApiError from "../utils/Apierror.js";

export const adminAuth = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    throw new ApiError(403, "Admin access required");
  }
  next();
};