import createError from "http-errors";
import userSchema from "../../services/user/userSchema.js";

import { verifyJWT } from "./tools.js";

export const JWTAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(
      createError(
        403,
        "Please provide credentials in the Authorization header!"
      )
    );
  } else {
    try {
      const token = req.headers.authorization.replace("Bearer ", "");
      const decodedToken = await verifyJWT(token);

      const user = await userSchema.findById(decodedToken._id);
      if (user) {
        req.user = user;
        next();
      } else {
        next(createError(404, "User not found!"));
      }
    } catch (error) {
      next(createError(403, "Token Expired!"));
    }
  }
};
