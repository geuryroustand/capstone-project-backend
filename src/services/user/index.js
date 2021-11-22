import express from "express";
import createHttpError from "http-errors";
import { JWTAuthMiddleware } from "../auth/middlewares.js";
import { JWTAuthenticate } from "../auth/tools.js";
import userSchema from "./userSchema.js";

const usersRouter = express.Router();

usersRouter.post("/register", async (req, res, next) => {
  try {
    const user = await userSchema.findOne({ email: req.body.email });
    if (!user) {
      const newUser = await userSchema.create(req.body);
      const { accessToken, refreshToken } = await JWTAuthenticate(newUser);
      const { name, surname, _id } = newUser;
      res.send({ accessToken, refreshToken, _id, name, surname });
    } else {
      next(createHttpError(401), "User already exists");
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userSchema.checkCredentials(email, password);

    if (user) {
      const { name, surname } = user;
      const { accessToken, refreshToken } = await JWTAuthenticate(user);
      res.send({ accessToken, refreshToken, name, surname });
    } else {
      next(createHttpError(401), "User already exists");
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    await JWTAuthenticate(req.user);
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
