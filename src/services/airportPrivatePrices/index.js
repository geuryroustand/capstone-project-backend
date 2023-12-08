import express from "express";
import q2m from "query-to-mongo";
import locationSchema from "../locations/locationSchema.js";
import { getPrice } from "./getPrice.js";
import privateTransfersSchema from "./privateTransfersSchema.js";

const addPrivatePriceRouter = express.Router();

addPrivatePriceRouter.get("/addPrices", async (req, res, next) => {
  try {
    let query = q2m(req.query);

    const getPickupPlace = await locationSchema.findById(req.query.pickUp);

    const getDropLocation = await locationSchema.findById(req.query.dropOff);

    const roundtrip = req.query.roundtrip;

    const result = getPrice(getPickupPlace, getDropLocation, roundtrip, next);
    res.send({
      priceTaxi1: result,
      priceTaxi2: result + 15,
      priceTaxi3: result + 25,
      priceTaxi4: result + 65,

      pickUp: getPickupPlace.location,
      dropOff: getDropLocation.location,
    });
  } catch (error) {
    next(error);
  }
});

addPrivatePriceRouter.post("/addPrices", async (req, res, next) => {
  try {
    const addPrices = await privateTransfersSchema.create(req.body);

    const { _id } = addPrices;

    res.send(_id);
  } catch (error) {
    next(error);
  }
});

export default addPrivatePriceRouter;
