import express from "express";
import createHttpError from "http-errors";
import sharedRideSchema from "./sharedRideSchema.js";
import q2m from "query-to-mongo";
import { JWTAuthMiddleware } from "../auth/middlewares.js";

const sharedRideRouter = express.Router();

sharedRideRouter.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query);

    const findSharedRide = await sharedRideSchema
      .find(query.criteria, query.options.fields)
      .populate("user");

    res.send(findSharedRide);
  } catch (error) {
    next(error);
  }
});
sharedRideRouter.post("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const createPostSharedRide = await sharedRideSchema.create({
      ...req.body,
      user: req.body._id,
    });
    const { _id } = createPostSharedRide;
    res.status(201).send(_id);
  } catch (error) {
    next(error);
  }
});

export default sharedRideRouter;
