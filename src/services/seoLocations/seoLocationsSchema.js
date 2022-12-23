import mongoose from "mongoose";

const { model, Schema } = mongoose;

const seoLocationsSchema = new Schema({
  heading1: {
    type: String,
  },

  heading2: {
    type: String,
  },

  article1: {
    title: {
      type: String,
      required: ["Location`s title is required", true],
      unique: ["Location`s title must be unique", true],
    },

    paragraph: {
      type: String,
    },
  },
  article2: {
    title: {
      type: String,
      required: ["Location`s title is required", true],
      unique: ["Location`s title must be unique", true],
    },

    paragraph: {
      type: String,
    },
  },

  desc: {
    type: String,
  },
  keywords: {
    type: String,
  },
});

export default model("seoLocation", seoLocationsSchema);
