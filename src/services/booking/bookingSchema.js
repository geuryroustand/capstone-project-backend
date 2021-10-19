import mongoose from "mongoose";

const { model, Schema } = mongoose;

const bookingSchema = new Schema(
  {
    arrivalDate: {
      type: String,
    },
    departureDate: {
      type: String,
    },

    arrivalAirlineName: {
      type: String,
    },
    departureAirlineName: {
      type: String,
    },
    arrivalFlightNo: {
      type: String,
    },
    departureFlightNo: {
      type: String,
    },

    passengers: {
      type: Number,
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
