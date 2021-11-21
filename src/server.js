import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";

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
import usersRouter from "./services/user/index.js";
const server = express();

const port = process.env.PORT;

const whiteList = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

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

//************************ROUTERS**************************
server.use("/locations", locationsRouter, addPrivatePriceRouter);
server.use("/bookings", bookingRouter);
// server.use("/users", userRouter);
server.use("/shared-ride", sharedRideRouter);
server.use("/create-checkout-session", createCheckoutSessionRouter);
server.use("/users", usersRouter);
//************************ERROR MIDDLEWARE***********************

server.use(notFoundErrHandler);
server.use(forbiddenErrHandler);
server.use(badReqErrHandler);
server.use(serverErrHandler);

mongoose.connect(process.env.MONGO_CONNECTION, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("😊Successfully connected to mongo!🥰 😎");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log("server listing on port " + port);
  });
});

mongoose.connection.on("error", (err) => {
  console.error("Mongo error : 🧨⛔🎇😬 :", err);
});
