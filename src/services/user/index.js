import express from "express";
import createHttpError from "http-errors";
import passport from "passport";
import { JWTAuthMiddleware } from "../auth/middlewares.js";
import { JWTAuthenticate } from "../auth/tools.js";
import userSchema from "./userSchema.js";
import { userInputValidationMiddleware } from "./validationMiddlaware.js";

import { validationResult } from "express-validator";
export const usersRouterRegister = express
  .Router()
  .post("/", userInputValidationMiddleware, async (req, res, next) => {
    const errorsList = validationResult(req);

    const { errors } = errorsList;

    if (!errorsList.isEmpty()) return next(createHttpError(400, { errors }));
    try {
      const user = await userSchema.findOne({ email: req.body.email });

      if (!user) {
        const newUser = await userSchema.create(req.body);
        const { accessToken, refreshToken } = await JWTAuthenticate(newUser);
        const { firstName, lastName, _id, avatar } = newUser;

        res.send({
          accessToken,
          refreshToken,
          _id,
          firstName,
          lastName,
          avatar,
        });
      } else {
        next(
          createHttpError(
            403,
            "This email address is already associated with an account"
          )
        );
      }
    } catch (error) {
      next(error);
    }
  });

export const usersRouterGoogleLogin = express
  .Router()
  .get("/", passport.authenticate("google", { scope: ["profile", "email"] }));

export const usersRouterGoogleRedirect = express
  .Router()
  .get("/", passport.authenticate("google"), async (req, res, next) => {
    try {
      // const { firstName, lastName, _id, avatar, token } = req.user;

      // res.send({ firstName, lastName, _id, avatar, token });
      const { accessToken, refreshToken } = req.user.tokens;

      res.redirect(
        `${process.env.FE_PROD_URL}/?accessToken=${accessToken}&refreshToken=${refreshToken}`
      );
    } catch (error) {
      next(error);
    }
  });

export const usersRouterFacebookLogin = express
  .Router()
  .get("/", passport.authenticate("facebook", { scope: ["email"] }));

export const usersRouterFacebookRedirect = express
  .Router()
  .get("/", passport.authenticate("facebook"), async (req, res, next) => {
    try {
      // const { firstName, lastName, _id, avatar, token } = req.user;
      // res.send({ firstName, lastName, _id, avatar, token });
      const { accessToken, refreshToken } = req.user.tokens;
      res.redirect(
        `${process.env.FE_PROD_URL}/?accessToken=${accessToken}&refreshToken=${refreshToken}`
      );
    } catch (error) {
      next(error);
    }
  });

export const usersRouterLogin = express
  .Router()
  .post("/", async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await userSchema.checkCredentials(email, password);

      if (user) {
        const { firstName, lastName } = user;
        const { accessToken, refreshToken } = await JWTAuthenticate(user);

        res.send({ accessToken, refreshToken, firstName, lastName });
      } else {
        next(
          createHttpError(
            403,
            "The password or email that you've entered is incorrect."
          )
        );
      }
    } catch (error) {
      next(error);
    }
  });

export const usersRouterProfile = express
  .Router()
  .get("/", JWTAuthMiddleware, async (req, res, next) => {
    try {
      const { accessToken, refreshToken } = await JWTAuthenticate(req.user);
      const { firstName, lastName, _id, email, avatar } = req.user;

      res.send({
        firstName,
        lastName,
        _id,
        email,
        accessToken,
        refreshToken,
        avatar,
      });
    } catch (error) {
      next(error);
    }
  })
  .patch("/", JWTAuthMiddleware, async (req, res, next) => {
    try {
      const { firstName, lastName, email } = req.body;

      req.user.firstName = `${firstName ? firstName : req.user.firstName}`;
      req.user.lastName = `${lastName ? lastName : req.user.lastName}`;
      req.user.email = `${email ? email : req.user.email}`;

      await req.user.save();
      res.send(req.user);
    } catch (error) {
      next(error);
    }
  });
