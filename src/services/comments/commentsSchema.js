import mongoose from "mongoose";

const { model, Schema } = mongoose;

const commentsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: [true, "User ID is required"],
    ref: "users",
  },

  comments: {
    type: String,
    required: [true, "Comment is required "],
  },
});

export default model("comments", commentsSchema);
