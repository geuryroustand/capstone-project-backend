import express from "express";
import Stripe from "stripe";
import bookingSchema from "./bookingSchema.js";
import userModel from "../user/schema.js";
import privateTransfersSchema from "../airportPrivatePrices/privateTransfersSchema.js";
const bookingRouter = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
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

bookingRouter.post("/create-checkout-session", async (req, res, next) => {
  try {
    const domainUrl = process.env.FE_PROD_URL;

    // process.env.NODE_ENV === "production"
    //   ? process.env.FE_PROD_URL
    // : process.env.FE_DEV_URL;

    const {
      line_items,
      customer_email,
      // taxiSelected,
      // name,
      // surname,
      // email,
      // phoneNumber,
      // arrivalAirlineName,
      // arrivalFlightNumber,
      // arrivalDepartureAirport,
      // departureAirlineName,
      // departureFlightNumber,
      // departureDepartureAirport,
      // pickUpLocation,
      // dropLocation,
      // arrivalDate,
      // departureDate,
      // journey,
      // passengers,
      // taxiOption,
      // price,
    } = req.body;

    console.log("=================================", ...req.body);
    // client_reference_id
    // Check req body has line items and email

    if (!line_items || !customer_email) {
      res.status(400).send("missing required session ");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: [
        "card",
        "giropay",
        "ideal",
        "sofort",
        "sepa_debit",
      ],
      mode: "payment",
      // success?session_id={CHECKOUT_SESSION_ID}
      customer_email,
      success_url: `${domainUrl}`,
      cancel_url: `${domainUrl}/canceled`,
      line_items,
      // ...taxiSelected,
      // client_reference_id,

      // line_items: [
      //   {
      //     quantity: 1,
      //     price_data: {
      //       currency: "eur",
      //       unit_amount: price * 100,
      //       product_data: {
      //         name: `Private Airport Transfers`,
      //         description: `Transfer from ${pickUpLocation} To ${dropLocation}`,
      //       },
      //     },

      //     // name: `From: ${prices.pickupPlace.location} to ${prices.dropPlace.location} `,
      //     // description: `From: ${prices.pickupPlace.location} to ${prices.dropPlace.location} `,
      //     // amount: prices.oneWayPriceTex1,
      //     // quantity: 1,
      //     // currency: "eur",
      //   },
      // ],

      // name,
      // surname,
      // email,
      // phoneNumber,
      // arrivalAirlineName,
      // arrivalFlightNumber,
      // arrivalDepartureAirport,
      // departureAirlineName,
      // departureFlightNumber,
      // departureDepartureAirport,
      // arrivalDate,
      // departureDate,
      // journey,
      // passengers,
      // taxiOption,
      // price,
    });

    res.status(200).send({ sessionId: session.id });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ error: "An error occured, unable to create session" });
  }
});
export default bookingRouter;
