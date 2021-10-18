import locationSchema from "./locationSchema.js";

import express from "express";

const locationsRouter = express.Router();

locationsRouter.get("/", async (req, res, next) => {
  try {
    const getLocations = await locationSchema.find();
    res.send(getLocations);
  } catch (error) {
    next(error);
  }
});

locationsRouter.post("/", async (req, res, next) => {
  try {
    const createNewLocation = await locationSchema.create(req.body);

    const { _id } = createNewLocation;

    res.send(_id);
  } catch (error) {
    next(error);
  }
});

export default locationsRouter;
