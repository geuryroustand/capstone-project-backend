import express from "express";
import commentsSchema from "./commentsSchema.js";

const commentsRouter = express.Router();

commentsRouter.get("/", async (req, res, next) => {
  try {
    const getComments = await commentsSchema.find().populate("user");

    res.send(getComments);
  } catch (error) {
    next(error);
  }
});

commentsRouter.post("/", async (req, res, next) => {
  try {
    const postComments = await commentsSchema.create(req.body);

    res.send(postComments);
  } catch (error) {
    next(error);
  }
});

export default commentsRouter;
