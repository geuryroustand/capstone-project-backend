import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { model, Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "User name is required"],
  },
  surname: {
    type: String,
    required: [true, " Surname is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, " Password is required"],
  },
  refreshToken: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.statics.checkCredentials = async function (email, password) {
  const user = await this.findOne({ email });
  if (await bcrypt.compare(password, user.password)) {
    return user;
  } else {
    return null;
  }
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;

  return user;
};
export default model("user", userSchema);
