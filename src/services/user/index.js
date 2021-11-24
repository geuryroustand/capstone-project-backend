import express from "express";
import createHttpError from "http-errors";
import passport from "passport";
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
      const { name, surname, _id, avatar } = newUser;
      res.send({ accessToken, refreshToken, _id, name, surname, avatar });
    } else {
      next(createHttpError(401), "User already exists");
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

usersRouter.get(
  "/googleRedirect",
  passport.authenticate("google"),
  async (req, res, next) => {
    try {
      // const { name, surname, _id, avatar, token } = req.user;

      // res.send({ name, surname, _id, avatar, token });
      const { accessToken, refreshToken } = req.user.tokens;

      res.redirect(
        `${process.env.FE_PROD_URL}/?accessToken=${accessToken}&refreshToken=${refreshToken}`
      );
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.get(
  "/facebookLogin",
  passport.authenticate("facebook", { scope: ["email"] })
);

usersRouter.get(
  "/facebookRedirect",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/register",
  })
);

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
    const { accessToken, refreshToken } = await JWTAuthenticate(req.user);
    const { name, surname, _id, email, avatar } = req.user;

    res.send({ name, surname, _id, email, accessToken, avatar });
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
