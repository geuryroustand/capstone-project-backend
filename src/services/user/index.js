import express from "express";
import createHttpError from "http-errors";
import { JWTAuthenticate } from "../auth/tools.js";
import userSchema from "./userSchema.js";

const usersRouter = express.Router();

usersRouter.post("/register", async (req, res, next) => {
  const user = await userSchema.findOne({ email: req.body.email });
  try {
    if (!user) {
      const newUser = await userSchema.create(req.body);
      const { accessToken, refreshToken } = await JWTAuthenticate(newUser);
      const { _id } = newUser;
      res.send({ accessToken, refreshToken, _id });
    } else {
      next(createHttpError(401), "User already exists");
    }
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
