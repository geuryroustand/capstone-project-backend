import mongoose from "mongoose";

const { model, Schema } = mongoose;

const privateTransferSchema = new Schema({
  // pickupPlace: {
  //   type: String,
  // },
  // dropPlace: {
  //   type: String,
  // },

  // location: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     required: ["Location name is required", true],
  //     ref: "location",
  //   },
  // ],

  // pickupPlace: {
  //   type: Schema.Types.ObjectId,
  //   required: ["pickupPlace is required", true],
  //   ref: "location",
  // },

  // dropPlace: {
  //   type: Schema.Types.ObjectId,
  //   required: ["dropPlace is  required", true],
  //   ref: "location",
  // },

  pickupPlace: [
    {
      type: Schema.Types.ObjectId,
      required: ["pickupPlace is required", true],
      ref: "location",
    },
  ],
  dropPlace: [
    {
      type: Schema.Types.ObjectId,
      required: ["dropPlace is  required", true],
      ref: "location",
    },
  ],
  oneWayPriceTex1: {
    type: Number,
  },
  roundTripPriceTaxi1: {
    type: Number,
  },

  oneWayPriceTex2: {
    type: Number,
  },
  roundTripPriceTaxi2: {
    type: Number,
  },
  oneWayPriceTex3: {
    type: Number,
  },
  roundTripPriceTaxi3: {
    type: Number,
  },
});

export default model("privatePrices", privateTransferSchema);
