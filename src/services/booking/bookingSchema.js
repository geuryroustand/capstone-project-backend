import mongoose from "mongoose";

const { model, Schema } = mongoose;

const bookingSchema = new Schema(
  {
    firstName: {
      type: String,
    },

    lastName: {
      type: String,
    },

    email: {
      type: String,
    },

    mobileNumber: {
      type: String,
    },

    pickUp: {
      type: String,
    },
    pickUpDate: {
      type: String,
    },
    pickUpPassenger: {
      type: String,
    },
    pickUpReturn: {
      type: String,
    },

    pickUpTime: {
      type: String,
    },

    arrivalAirlineName: {
      type: String,
    },

    arrivalFlightNumber: {
      type: String,
    },

    dropOff: {
      type: String,
    },
    dropOffDate: {
      type: String,
    },

    dropOffPassenger: {
      type: String,
    },
    dropOffReturn: {
      type: String,
    },
    dropOffTime: {
      type: String,
    },
    departureAirlineName: {
      type: String,
    },
    departureFlightNumber: {
      type: String,
    },
    requests: {
      type: String,
    },
    roundtrip: {
      type: String,
    },
    paymentMethod: {
      type: String,
    },
    totalPrice: {
      type: String,
    },
    locale: {
      type: String,
    },
  },
  { timestamps: true }
);

export default model("booking", bookingSchema);
