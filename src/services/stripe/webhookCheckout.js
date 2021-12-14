import express from "express";
import Stripe from "stripe";
import bookingSchema from "../booking/bookingSchema.js";
import sharedRideSchema from "../sharedRide/sharedRideSchema.js";
import userSchema from "../user/userSchema.js";
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
    const { customer_email, amount_total, sharedRideYesOrNo } =
      event.data.object;

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

    if (sharedRideYesOrNo === "Yes") {
      const userFound = await userSchema.findOne({ email: customer_email });

      if (userFound) {
        await sharedRideSchema.create({
          user: userFound._id,
          pickLocation: arrivalAirlineName,
          dropLocation: departureAirlineName,
          serviceDate: arrivalDate,
          airlineName: arrivalAirlineName,
          flightNumber: arrivalFlightNumber,
          passenger: passengers,
          totalPrice: amount_total,
          // haveFlight:
        });
      }
    }

    if (journey === "OneWay") {
      const createOneWayBooking = await bookingSchema.create({
        phoneNumber,
        arrivalAirlineName,
        arrivalFlightNumber,
        arrivalDepartureAirport,
        arrivalDate,
        journey,
        sharedRideYesOrNo,
        passengers,
        taxiOption,
        totalPrice: amount_total / 100,
        email: customer_email,
        passengersName: name,
        passengersSurname: surname,
      });

      res.status(200).send({ received: true });
    } else {
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

      res.status(200).send();
    }
  }
});

export default webHooCheckoutRouter;
