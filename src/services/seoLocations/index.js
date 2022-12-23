import express from "express";
import seoLocationsSchema from "./seoLocationsSchema.js";

const seoLocationsRouter = express.Router();

seoLocationsRouter
  .get("/", async (_, res, next) => {
    try {
      const findTheLocations = await seoLocationsSchema.find();

      res.send(findTheLocations);
    } catch (error) {
      next(error);
    }
  })
  .post("/", async (req, res, next) => {
    try {
      const createNewLocations = await seoLocationsSchema.create(req.body);
      res.send(createNewLocations);
    } catch (error) {
      next(error);
    }
  });

export default seoLocationsRouter;
