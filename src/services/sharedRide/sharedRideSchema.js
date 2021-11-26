import mongoose from "mongoose";

const { model, Schema } = mongoose;

const sharedRideSchema = new Schema(
  {
    user: [
      {
        type: Schema.Types.ObjectId,
        required: [true, "User ID is required"],
        ref: "users",
      },
    ],
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
      type: String,
    },
    arrivalAirlineName: {
      type: String,
    },
    arrivalFlightNumber: {
      type: String,
    },
    pickupLocationName: {
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

    dropLocationName: {
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
