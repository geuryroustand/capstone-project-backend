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

      if (journey === "OneWay") {
        const createOneWayBooking = await bookingSchema.create({
          phoneNumber,
          arrivalAirlineName,
          arrivalFlightNumber,
          arrivalDepartureAirport,
          arrivalDate,
          journey,
          passengers,
          taxiOption,
          totalPrice: amount_total / 100,
          email: customer_email,
          passengersName: name,
          passengersSurname: surname,
        });

        res.status(200).send();
      }

      // else {
      //   const createBooking = await bookingSchema.create({
      //     phoneNumber,
      //     arrivalAirlineName,
      //     arrivalFlightNumber,
      //     arrivalDepartureAirport,
      //     arrivalDate,

      //     departureAirlineName,
      //     departureFlightNumber,
      //     departureDepartureAirport,
      //     departureDate,

      //     journey,
      //     passengers,
      //     taxiOption,

      //     totalPrice: 10.5,
      //     email: customer_email,
      //     passengersName: name,
      //     passengersSurname: surname,
      //   });

      //   res.status(200).send();
      // }
    }
  } catch (error) {
    return res.status(400).send(`Webhook error: ${error}`);
  }
});

export default webHooCheckoutRouter;
