import mongoose from "mongoose";

const { model, Schema } = mongoose;

const locationSchema = new Schema({
  location: {
    type: String,
    required: ["Location`s name is required", true],
    unique: ["Location`s name must be unique", true],
  },
});

export default model("location", locationSchema);
