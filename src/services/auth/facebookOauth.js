import passport from "passport";

import FacebookStrategy from "passport-facebook";
import userSchema from "../user/userSchema.js";

const facebookStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `https://vacationstaxi.herokuapp.com/users/facebookRedirect`,
    // callbackURL: `https://vacationstaxi.herokuapp.com/users/facebookRedirect`,
  },
  async (accessToken, refreshToken, facebookProfile, passportNext) => {
    try {
      console.log("facebookPr", facebookProfile);
      //  const user = await userSchema.findOne({  facebookId:})

      passportNext(null, facebookProfile);
    } catch (error) {
      passportNext(error);
    }
  }
);

passport.serializeUser(function (data, nextPassport) {
  nextPassport(null, data);
});

passport.deserializeUser(function (data, nextPassport) {
  nextPassport(null, data);
});

export default facebookStrategy;
