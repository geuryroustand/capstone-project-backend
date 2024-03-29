import mongoose from "mongoose";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";

const { model, Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,

      // required: [true, "First Name is required"],
    },
    lastName: {
      type: String,
      // required: [true, "Last Name is required"],
    },

    isLogin: {
      type: Boolean,
      default: false,
    },

    email: {
      type: String,
      // required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !Boolean(this.googleId || this.facebookId);
      },
    },
    googleId: {
      type: String,
      required: function () {
        return !Boolean(this.password || this.facebookId);
      },
    },
    facebookId: {
      type: String,
      required: function () {
        return !Boolean(this.password || this.googleId);
      },
    },
    userBookingShared: {
      type: String,
      // required: function () {
      //   return !Boolean(
      //     this.password || this.googleId || this.userBookingShared
      //   );
      // },
    },
    avatar: {
      type: String,
      default: "https://ui-avatars.com/api/?name=Unnamed+User",
    },

    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.password || this.userBookingShared) {
    this.avatar = `https://ui-avatars.com/api/?name=${this.firstName}+${this.lastName}`;
  }

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
export default model("users", userSchema);
