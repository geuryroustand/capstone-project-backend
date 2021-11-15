import express from "express";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSessionRouter = express.Router();

createCheckoutSessionRouter.post("/", async (req, res, next) => {
  try {
    const domainUrl = process.env.FE_PROD_URL;

    // process.env.NODE_ENV === "production"
    //   ? process.env.FE_PROD_URL
    // : process.env.FE_DEV_URL;

    const { line_items, customer_email } = req.body;
    // taxiSelected
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
      // metadata: {
      //   name: `${taxiSelected.name}`,
      //   surname: `${taxiSelected.surname}`,
      //   phoneNumber: `${taxiSelected.phoneNumber}`,
      //   arrivalAirlineName: `${taxiSelected.arrivalAirlineName}`,
      //   arrivalFlightNumber: `${taxiSelected.arrivalFlightNumber}`,
      //   arrivalDepartureAirport: `${taxiSelected.arrivalDepartureAirport}`,
      //   departureAirlineName: `${taxiSelected.departureAirlineName}`,
      //   departureFlightNumber: `${taxiSelected.departureFlightNumber}`,
      //   departureDepartureAirport: `${taxiSelected.departureDepartureAirport}`,
      //   arrivalDate: `${taxiSelected.arrivalDate}`,
      //   departureDate: `${taxiSelected.departureDate}`,
      //   journey: `${taxiSelected.journey}`,
      //   passengers: `${taxiSelected.passengers}`,
      //   taxiOption: `${taxiSelected.taxiOption}`,
      // },
    });

    res.status(200).send({ sessionId: session.id });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ error: "An error occurred, unable to create session" });
  }
});

export default createCheckoutSessionRouter;
