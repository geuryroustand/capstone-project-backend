import mongoose from "mongoose";
const { Schema, model } = mongoose;
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    mobileNumber: { type: Number },
    password: { type: String },
    reservationsHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "booking",
      },
    ],
    // role: {
    //   type: String,
    //   required: true,
    //   enum: ["host", "guest"],
    //   default: "guest",
    // },

    facebookId: { type: String },
  },
  { timestamps: true }
);

// const plainPW = "abc";

// console.time("a");

// const hast = bcrypt.hashSync(plainPW, 12);
// console.log(hast);
// console.timeEnd("a");

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
};

userSchema.statics.checkUser = async function (email, userPassword) {
  const findUser = await this.findOne({ email });

  if (await bcrypt.compare(userPassword, findUser.password)) {
    return findUser;
  } else {
    return null;
  }
};
export default model("User", userSchema);
