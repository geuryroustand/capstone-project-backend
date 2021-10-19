import express from "express";
import q2m from "query-to-mongo";
import privateTransfersSchema from "./privateTransfersSchema.js";

const addPrivatePriceRouter = express.Router();

addPrivatePriceRouter.get("/addPrices", async (req, res, next) => {
  try {
    const query = q2m(req.query);

    console.log(query.criteria);

    const getBookingDetails = await privateTransfersSchema
      .find(query ? query.criteria : "", query ? query.options.fields : "")
      .limit(query.options.limit)
      .skip(query.options.skip)
      .sort(query.options.sort)
      .populate("pickupPlace")
      .populate("dropPlace");

    res.send(getBookingDetails);
  } catch (error) {
    next(error);
  }
});

addPrivatePriceRouter.get("/addPrices/:priceId", async (req, res, next) => {
  try {
    const addPrices = await privateTransfersSchema.findById(req.params.priceId);

    res.send(addPrices);
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
