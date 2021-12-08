import express from "express";
import createHttpError from "http-errors";
import sharedRideSchema from "./sharedRideSchema.js";
import q2m from "query-to-mongo";
import { JWTAuthMiddleware } from "../auth/middlewares.js";

const sharedRideRouter = express.Router();

sharedRideRouter.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query);

    // console.log("que", req.query.serviceDate);

    // const myDate = new Date("2022-12-30T00:30:00.000Z");

    // console.log(myDate);

    // console.log(new Date(`${req.query.serviceDate}`));

    // const findSharedRide = await sharedRideSchema.find({
    //   serviceDate: new ISODate(`${req.query.serviceDate}`),

    //   // const findSharedRide = await sharedRideSchema.find({
    //   //   serviceDate: {
    //   //     $gte: new Date(`${req.query.serviceDate}`),
    //   //   },

    //   // serviceDate: {
    //   //   $eq: new Date(`${req.query.serviceDate}`),
    //   // },
    // });

    // pickLocation: req.query.pickLocation,
    // dropLocation: req.query.dropLocation,

    // `${req.query.serviceDate}`

    // ISODate

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
      user: req.user._id,
      serviceDate: new Date(req.body.serviceDate),
      ...req.body,
    });
    // const { _id } = createPostSharedRide;
    res.status(201).send(createPostSharedRide);
  } catch (error) {
    next(error);
  }
});

sharedRideRouter.post(
  "/comments",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const addComment = await sharedRideSchema.findByIdAndUpdate(
        req.body.postId,
        {
          $push: {
            comments: {
              comment: req.body.comment,
              postDated: new Date(),
              user: req.user,
              // name: req.user.name,
              // surname: req.user.surname,
              // userId: req.user._id,
              // avatar: req.user.avatar,
            },
          },
        },
        {
          new: true,
        }
      );
      res.status(201).send(addComment);
    } catch (error) {
      next(error);
    }
  }
);

export default sharedRideRouter;
