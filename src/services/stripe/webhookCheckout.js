import express from "express";
import Stripe from "stripe";
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
    const {
      line_items,
      customer_email,
      name,
      surname,
      email,
      phoneNumber,
      arrivalAirlineName,
      arrivalFlightNumber,
      arrivalDepartureAirport,
      departureAirlineName,
      departureFlightNumber,
      departureDepartureAirport,
      arrivalDate,
      departureDate,
      journey,
      passengers,
      taxiOption,
      price,
    } = event.data.object;

    console.log(
      "aasas",
      line_items,
      customer_email,
      name,
      surname,
      email,
      phoneNumber,
      arrivalAirlineName,
      arrivalFlightNumber,
      arrivalDepartureAirport,
      departureAirlineName,
      departureFlightNumber,
      departureDepartureAirport,
      arrivalDate,
      departureDate,
      journey,
      passengers,
      taxiOption,
      price
    );

    res.status(200).send({ received: true });
  }
});

export default webHooCheckoutRouter;
