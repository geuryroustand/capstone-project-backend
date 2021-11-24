import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import userSchema from "../user/userSchema.js";
import { JWTAuthenticate } from "./tools.js";

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_OAUTH_ID,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: `https://vacationstaxi.herokuapp.com/users/googleRedirect`,
  },
  async (accessToken, refreshToken, googleProfile, passportNext) => {
    try {
      const user = await userSchema.findOne({ googleId: googleProfile.id });

      if (user) {
        const tokens = await JWTAuthenticate(user);
        passportNext(null, { tokens });
      } else {
        const newUser = {
          name: googleProfile.name.givenName,
          surname: googleProfile.name.familyName,
          email: googleProfile.emails[0].value,
          avatar: googleProfile.photos[0].value,
          googleId: googleProfile.id,
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

export default googleStrategy;
