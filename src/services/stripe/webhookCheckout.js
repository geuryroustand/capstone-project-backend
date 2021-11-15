import express from "express";
import Stripe from "stripe";
import bookingSchema from "../booking/bookingSchema.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const webHooCheckoutRouter = express.Router();

webHooCheckoutRouter.post("/", async (req, res, next) => {
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOKS_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook error: ${error}`);
  }

  if (event.type === "checkout.session.completed") {
    const { customer_email, amount_total } = event.data.object;
    const {
      name,
      surname,
      phoneNumber,
      arrivalAirlineName,
      arrivalFlightNumber,
      arrivalDepartureAirport,
      arrivalDate,

      departureAirlineName,
      departureFlightNumber,
      departureDepartureAirport,
      departureDate,

      journey,
      passengers,
      taxiOption,
    } = event.data.object.metadata;

    const createBooking = await bookingSchema.create({
      phoneNumber,
      arrivalAirlineName,
      arrivalFlightNumber,
      arrivalDepartureAirport,
      arrivalDate,

      departureAirlineName,
      departureFlightNumber,
      departureDepartureAirport,
      departureDate,

      journey,
      passengers,
      taxiOption,

      totalPrice: amount_total / 100,
      email: customer_email,
      passengersName: name,
      passengersSurname: surname,
    });

    console.log("======amount", amount_total / 100);
    // console.log("=================ddd", event.data.object);
    console.log(
      "=========dddd===========",
      event.data.object
      // event.data.object.customer_email
    );

    res.status(200).send({ received: true });
  }
});

export default webHooCheckoutRouter;
