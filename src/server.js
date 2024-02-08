import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import {
  notFoundErrHandler,
  forbiddenErrHandler,
  badReqErrHandler,
  serverErrHandler,
} from "./errorHandlers.js";
import locationsRouter from "./services/locations/index.js";
import addPrivatePriceRouter from "./services/airportPrivatePrices/index.js";
import bookingRouter from "./services/booking/index.js";
import webHooCheckoutRouter from "./services/stripe/webhookCheckout.js";
import createCheckoutSessionRouter from "./services/stripe/create-checkout-session.js";
import sharedRideRouter from "./services/sharedRide/index.js";
import {
  usersRouterFacebookLogin,
  usersRouterFacebookRedirect,
  usersRouterGoogleLogin,
  usersRouterGoogleRedirect,
  usersRouterLogin,
  usersRouterProfile,
  usersRouterRegister,
} from "./services/user/index.js";
import passport from "passport";
import googleStrategy from "./services/auth/googleOauth.js";
import facebookStrategy from "./services/auth/facebookOauth.js";

import commentsRouter from "./services/comments/index.js";
import seoLocationsRouter from "./services/seoLocations/index.js";
import contactUsRouter from "./services/routers/contactUsRoutes.js";

const server = express();

const port = process.env.PORT;

const whiteList = [
  process.env.FE_DEV_URL,
  process.env.FE_PROD_URL,
  process.env.FE_PROD_DEV_URL,
];

const corsOpts = {
  origin: function (origin, next) {
    if (!origin || whiteList.indexOf(origin) !== -1) {
      next(null, true);
    } else {
      next(new Error(`Origin ${origin} not allowed!`));
    }
  },
};

//************************STRIPE WEBHOOK ROUTER**************************
server.use(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webHooCheckoutRouter
);

//************************MIDDLEWARE***********************

server.use(cors(corsOpts));
server.use(express.json());
server.use(cookieParser());
server.use(passport.initialize());
// server.use(passport.session());

//************************ROUTERS**************************

server.use("/seoLocations", seoLocationsRouter);
server.use("/contact-us", contactUsRouter);
server.use("/locations", locationsRouter, addPrivatePriceRouter);
server.use("/bookings", bookingRouter);
server.use("/shared-ride", sharedRideRouter);
server.use("/comments", commentsRouter);
server.use("/create-checkout-session", createCheckoutSessionRouter);

server.use("/register", usersRouterRegister);
server.use("/login", usersRouterLogin);
server.use("/me", usersRouterProfile);

server.use("/googleLogin", usersRouterGoogleLogin);
server.use("/googleRedirect", usersRouterGoogleRedirect);
server.use("/facebookLogin", usersRouterFacebookLogin);
server.use("/facebookRedirect", usersRouterFacebookRedirect);

passport.use("google", googleStrategy);
passport.use("facebook", facebookStrategy);

//************************ERROR MIDDLEWARE***********************

server.use(notFoundErrHandler);
server.use(forbiddenErrHandler);
server.use(badReqErrHandler);
server.use(serverErrHandler);

// useNewUrlParser: true,
// useCreateIndex: true,
// useUnifiedTopology: true,

server.listen(port, async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION, {
      useNewUrlParser: true,

      useUnifiedTopology: true,
    });

    console.table(listEndpoints(server));
    console.log("😊Successfully connected to mongo!🥰 😎" + port);

    // newLocation.filter((lo) => {
    //   const { location, region } = lo;

    //   console.log({
    //     location,
    //     region,
    //   });

    //   console.log(newLocation.length);
    //   if (location && region) {
    //     locationSchema.insertMany([
    //       {
    //         location,
    //         region,
    //       },
    //     ]);
    //   }
    // });
  } catch (error) {
    console.error("Db connection is failed ", error);
  }
});

server.on("error", (err) => {
  console.error("Mongo error : 🧨⛔🎇😬 :", err);
});
