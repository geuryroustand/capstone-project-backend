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
    const domainUrl = process.env.FRONTEND_WEB_URL;

    const { line_items, customer_email } = req.body;
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
      line_items,
      customer_email,
      success_url: `${domainUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainUrl}/canceled`,
      // client_reference_id,

      // line_items: [
      //   {
      //     name: `From: ${prices.pickupPlace.location} to ${prices.dropPlace.location} `,
      //     description: `From: ${prices.pickupPlace.location} to ${prices.dropPlace.location} `,
      //     amount: prices.oneWayPriceTex1,
      //     quantity: 1,
      //     currency: "eur",
      //   },
      // ],
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
