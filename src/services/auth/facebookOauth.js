import passport from "passport";

import FacebookStrategy from "passport-facebook";
import userSchema from "../user/userSchema.js";

const facebookStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `https://vacationstaxi.herokuapp.com/users/facebookRedirect`,
    // callbackURL: `http://localhost:3000/users/facebookRedirect`,
    profileFields: ["id", "displayName", "photos", "email"],
  },
  async (accessToken, refreshToken, profile, passportNext) => {
    try {
      console.log("facebookPr", profile);
      const user = await userSchema.findOne({ facebookId: profile.id });

      if (user) {
      }

      passportNext(null, profile);
    } catch (error) {
      passportNext(error);
    }
  }
);

passport.serializeUser(function (data, passportNext) {
  passportNext(null, data);
});
// passport.deserializeUser(function (data, nextPassport) {
//   nextPassport(null, data);
// });

export default facebookStrategy;
