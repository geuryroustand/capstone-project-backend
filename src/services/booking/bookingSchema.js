import mongoose from "mongoose";

const { model, Schema } = mongoose;

const bookingSchema = new Schema(
  {
    name: {
      type: String,
    },

    surname: {
      type: String,
    },

    email: {
      type: String,
    },

    phoneNumber: {
      type: String,
    },

    user: {
      type: String,
    },

    pickLocation: {
      type: String,
    },
    arrivalAirlineName: {
      type: String,
    },
    arrivalFlightNumber: {
      type: String,
    },
    arrivalDepartureAirport: {
      type: String,
    },
    arrivalDate: {
      type: String,
    },

    dropLocation: {
      type: String,
    },
    departureAirlineName: {
      type: String,
    },

    departureFlightNumber: {
      type: String,
    },

    departureDepartureAirport: {
      type: String,
    },
    departureDate: {
      type: String,
    },

    journey: {
      type: String,
    },
    sharedRideYesOrNo: {
      type: String,
    },
    passengers: {
      type: Number,
    },
    taxiOption: {
      type: String,
    },

    specialRequest: {
      type: String,
    },
    totalPrice: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default model("booking", bookingSchema);
