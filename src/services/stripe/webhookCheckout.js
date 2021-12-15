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
    const { customer_email, amount_total } = event.data.object;

    const {
      name,
      surname,
      phoneNumber,

      arrivalAirlineName,
      arrivalFlightNumber,
      arrivalDepartureAirport,
      arrivalDate,
      pickLocation,
      dropLocation,

      departureAirlineName,
      departureFlightNumber,
      departureDepartureAirport,
      departureDate,

      sharedRideYesOrNo,
      journey,
      passengers,
      taxiOption,
    } = event.data.object.metadata;

    if (sharedRideYesOrNo === "Yes") {
      // SEARCH FOR THE USER

      const userFound = await userSchema.findOne({ email: customer_email });

      if (userFound) {
        if (journey === "OneWay") {
          //+++++++++++++++++ ARRIVAL SHARE RIDE POST ONE WAY
          await sharedRideSchema.create({
            user: userFound._id,
            pickLocation,
            dropLocation,
            serviceDate: arrivalDate,
            airlineName: arrivalAirlineName,
            flightNumber: arrivalFlightNumber,
            passenger: passengers,
            totalPrice: amount_total / 100,
            // haveFlight:
          });

          // CREATE BOOKING FOR ONEWAY

          const createOneWayBooking = await bookingSchema.create({
            pickLocation,
            dropLocation,
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
            name,
            surname,
            phoneNumber,
          });

          res.status(200).send({ received: true });
        } else {
          //+++++++++++++++++ ARRIVAL SHARE RIDE POST
          await sharedRideSchema.create({
            user: userFound._id,
            pickLocation,
            dropLocation,
            serviceDate: arrivalDate,
            airlineName: arrivalAirlineName,
            flightNumber: arrivalFlightNumber,
            passenger: passengers,
            totalPrice: amount_total / 100,
            // haveFlight:
          });

          //+++++++++++++++++ RETURN SHARE RIDE POST
          await sharedRideSchema.create({
            user: userFound._id,
            pickLocation,
            dropLocation,

            airlineName: departureAirlineName,
            flightNumber: departureFlightNumber,
            serviceDate: departureDate,

            passenger: passengers,
            totalPrice: amount_total / 100,
            // haveFlight:
          });

          // CREATE BOOKING FOR ROUNDTRIP

          const createBooking = await bookingSchema.create({
            pickLocation,
            dropLocation,

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
            name,
            surname,
            phoneNumber,
          });

          res.status(200).send({ received: true });
        }
      } else {
        // CREATE USER ACCOUNT
        const createUser = await userSchema.create({
          name,
          surname,
          email: customer_email,
        });
        if (journey === "OneWay") {
          //+++++++++++++++++ ARRIVAL SHARE RIDE POST ONE WAY
          await sharedRideSchema.create({
            user: createUser._id,
            pickLocation,
            dropLocation,
            serviceDate: arrivalDate,
            airlineName: arrivalAirlineName,
            flightNumber: arrivalFlightNumber,
            passenger: passengers,
            totalPrice: amount_total / 100,
            // haveFlight:
          });

          // CREATE BOOKING FOR ONEWAY

          const createOneWayBooking = await bookingSchema.create({
            pickLocation,
            dropLocation,
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
            name,
            surname,
            phoneNumber,
            wantToSharedRide,
          });

          res.status(200).send({ received: true });
        } else {
          //+++++++++++++++++ ARRIVAL SHARE RIDE POST
          await sharedRideSchema.create({
            user: userFound._id,
            pickLocation,
            dropLocation,
            serviceDate: arrivalDate,
            airlineName: arrivalAirlineName,
            flightNumber: arrivalFlightNumber,
            passenger: passengers,
            totalPrice: amount_total / 100,
            // haveFlight:
          });

          //+++++++++++++++++ RETURN SHARE RIDE POST
          await sharedRideSchema.create({
            user: userFound._id,
            pickLocation,
            dropLocation,

            airlineName: departureAirlineName,
            flightNumber: departureFlightNumber,
            serviceDate: departureDate,

            passenger: passengers,
            totalPrice: amount_total / 100,
            // haveFlight:
          });

          // CREATE BOOKING FOR ROUNDTRIP

          const createBooking = await bookingSchema.create({
            pickLocation,
            dropLocation,
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
            name,
            surname,
            phoneNumber,
          });

          res.status(200).send({ received: true });
        }
      }
    } else {
      // USER PRIVATE RIDE

      if (journey === "OneWay") {
        const createOneWayBooking = await bookingSchema.create({
          pickLocation,
          dropLocation,

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
          name,
          surname,
          phoneNumber,
        });

        res.status(200).send({ received: true });
      } else {
        const createBooking = await bookingSchema.create({
          pickLocation,
          dropLocation,
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
          name,
          surname,
          phoneNumber,
        });

        res.status(200).send({ received: true });
      }
    }
  }
});

export default webHooCheckoutRouter;
