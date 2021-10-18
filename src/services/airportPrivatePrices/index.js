import express from "express";

const addPrivatePriceRouter = express.Router();

addPrivatePriceRouter.post("/addPrices", async (req, res, next) => {
  try {
    console.log("hi");
  } catch (error) {
    next(error);
  }
});

export default addPrivatePriceRouter;
