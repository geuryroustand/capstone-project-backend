import mongoose from "mongoose";

const { model, Schema } = mongoose;

const locationSchema = new Schema({
  location: {
    type: String,
    required: ["Location`s name is required", true],
    unique: ["Location`s name must be unique", true],
  },
  region: {
    type: String,
  },
  // locationsPrices: [{ type: Schema.Types.ObjectId, ref: "privatePrices" }],
});

export default model("location", locationSchema);
