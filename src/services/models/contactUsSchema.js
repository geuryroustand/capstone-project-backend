import mongoose from "mongoose";

const { model, Schema } = mongoose;

const contactUs = new Schema({
  name: {
    type: String,
    required: ["Name is  required", true],
  },
  email: {
    type: String,
    required: ["Email is  required", true],
  },
  message: {
    type: String,
    required: ["Message is  required", true],
  },
});

export default model("contactUs", contactUs);
