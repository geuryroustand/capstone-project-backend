import mongoose from "mongoose";

const { model, Schema } = mongoose;

const sharedRideSchema = new Schema(
  {
    passengersName: {
      type: String,
    },
    passengersSurname: {
      type: String,
    },
    email: {
      type: String,
    },

    phoneNumber: {
      type: Number,
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

export default model("sharedRide", sharedRideSchema);
