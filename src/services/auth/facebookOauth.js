import passport from "passport";

import FacebookStrategy from "passport-facebook";
import userSchema from "../user/userSchema.js";
import { JWTAuthenticate } from "./tools.js";

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
      const user = await userSchema.findOne({ facebookId: profile.id });
      if (user) {
        const tokens = await JWTAuthenticate(user);
        passportNext(null, { tokens });
      } else {
        const newUser = {
          name: profile.displayName.split(" ")[0],
          surname: profile.displayName.split(" ")[1],
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
          facebookId: profile.id,
        };

        const createNewUser = await userSchema.create(newUser);

        const tokens = await JWTAuthenticate(createNewUser);
        passportNext(null, {
          tokens,
        });
      }
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
