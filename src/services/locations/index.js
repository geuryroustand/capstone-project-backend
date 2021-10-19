import locationSchema from "./locationSchema.js";

import express from "express";

const locationsRouter = express.Router();

locationsRouter.get("/", async (req, res, next) => {
  try {
    const getLocations = await locationSchema.find();
    // .populate("locationsPrices");
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

locationsRouter.put("/:locationId", async (req, res, next) => {
  try {
    const createNewLocation = await locationSchema.findByIdAndUpdate(
      req.params.locationId,
      req.body,
      {
        new: true,
      }
    );

    const { _id } = createNewLocation;

    res.send(_id);
  } catch (error) {
    next(error);
  }
});
export default locationsRouter;
