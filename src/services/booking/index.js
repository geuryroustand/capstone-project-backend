import express from "express";

import bookingSchema from "./bookingSchema.js";
import userModel from "../user/schema.js";
import privateTransfersSchema from "../airportPrivatePrices/privateTransfersSchema.js";
const bookingRouter = express.Router();

// bookingRouter.get("/", async (req, res, next) => {
//   try {
//     const getLocations = await locationSchema.find();
//     res.send(getLocations);
//   } catch (error) {
//     next(error);
//   }
// });

bookingRouter.post("/", async (req, res, next) => {
  try {
    // console.log({
    //   ...req.body,
    //   pickupPlace: req.query.pickupPlace,
    //   dropPlace: req.query.dropPlace,
    //   arrivalDate: req.query.arrivalDate,
    //   departureDate: req.query.departureDate,
    //   passengers: req.query.passengers,
    // });

    const createNewBooking = await bookingSchema.create({
      ...req.body,
      pickupPlace: req.query.pickupPlace,
      dropPlace: req.query.dropPlace,
      arrivalDate: req.query.arrivalDate,
      departureDate: req.query.departureDate,
      passengers: req.query.passengers,
    });

    const { _id } = createNewBooking;

    const createNewUser = await userModel.create({
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber,
      reservationsHistory: _id,
    });

    res.send(_id);
  } catch (error) {
    next(error);
  }
});

export default bookingRouter;
