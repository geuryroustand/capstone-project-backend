import mongoose from "mongoose";

const { model, Schema } = mongoose;

const privateTransferSchema = new Schema({
  pickupPlace: {
    type: String,
  },
  dropPlace: {
    type: String,
  },
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
