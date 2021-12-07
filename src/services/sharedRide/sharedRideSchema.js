import mongoose from "mongoose";

const { model, Schema } = mongoose;

const sharedRideSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      ref: "users",
    },

    comments: [],

    email: {
      type: String,
    },

    phoneNumber: {
      type: String,
    },

    pickLocation: {
      type: String,
    },
    dropLocation: {
      type: String,
    },

    serviceDate: {
      type: Date,
    },

    airlineName: {
      type: String,
    },

    flightNumber: {
      type: String,
    },

    passenger: {
      type: String,
    },

    haveFlight: {
      type: String,
    },

    travelerCommentRequest: {
      type: String,
    },

    totalPrice: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default model("sharedRide", sharedRideSchema);
