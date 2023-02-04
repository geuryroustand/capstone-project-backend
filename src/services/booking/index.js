import express from "express";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

import bookingSchema from "./bookingSchema.js";
// import userModel from "../user/schema.js";
import privateTransfersSchema from "../airportPrivatePrices/privateTransfersSchema.js";
const bookingRouter = express.Router();

// bookingRouter.get("/", async (req, res, next) => {
//   try {
//     const getLocations = await locationSchema.find();
//     res.send(getLocations);
//   } catch (error) {
//     next(error);
//   }
// });

bookingRouter.post("/", async (req, res, next) => {
  try {
    const createNewBooking = await bookingSchema.create(req.body);

    const { _id } = createNewBooking;

    // const createNewUser = await userModel.create({
    //   name: req.body.name,
    //   surname: req.body.surname,
    //   email: req.body.email,
    //   mobileNumber: req.body.mobileNumber,
    //   reservationsHistory: _id,
    // });

    const isRoundTripOrOneWay = req.body.roundtrip
      ? `
    <ul>
    <strong>Arrival Information</strong>
    <li><strong>pickUp:</strong>${req.body.pickUp}</li>
    <li><strong>dropOff:</strong> ${req.body.dropOff}</li>
    <li><strong>pickUpDate:</strong>${req.body.pickUpDate}</li>
    <li><strong>arrivalTime:</strong>${req.body.pickUpTime}</li>
    <hr>
    <strong>Departure Information</strong>
    <li><strong>pickUpReturn:</strong>${req.body.pickUpReturn}</li>
    <li><strong>dropOffReturn:</strong>${req.body.dropOffReturn}</li>
    <li><strong>departureDate:</strong>${req.body.dropOffDate}</li>
    <li><strong>departureTime:</strong>${req.body.dropOffTime}</li>
  </ul>
  <strong>Please note that we will send you the 
     return pick-up time 1 day before your departure.
  </strong>
    `
      : `
    <ul>
    <strong>Arrival Information</strong>
    <li><strong>pickUp:</strong>${req.body.pickUp}</li>
    <li><strong>dropOff:</strong>${req.body.dropOff}</li>
    <li><strong>pickUpDate:</strong>${req.body.pickUpDate}</li>
    <li><strong>arrivalTime:</strong>${req.body.pickUpTime}</li>
    </ul>
    `;

    const msg = {
      to: `${req.body.email}`, // Change to your recipient
      from: "vacationstaxis@gmail.com", // Change to your verified sender
      cc: "roustandgeury@gmail.com",
      subject:
        "Confirmation of your Airport Transfer Service with vacationstaxis.com",

      html: `
      <p>Dear ${req.body.firstName} ${req.body.lastName}</p>
      <p>We are writing to confirm your airport transfer service with VacationsTaxis 
      Your booking details are as follows:</p>
    
      ${isRoundTripOrOneWay}
      
  <p>A professional and experienced driver will be waiting for 
    you at the airport with a sign displaying your name. Our
    driver will assist with your luggage and transport you
    directly to your hotel in comfort and style.</p>

  <p>Please let us know if there are any changes to your
     itinerary or if you have any special requests. We will do our
    best to accommodate your needs.</p>

   <p>If you have any questions or concerns, please do not hesitate
     to contact us. We look forward to providing you with
    a smooth and stress-free airport transfer experience.</p>

    <p>Thank you for choosing VacationsTaxis for your transportation needs.</p>
    <p>Best regards,</p>
    <p>The Vacationstaxis.com Team</p>
      `,
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });

    res.send({ _id });
  } catch (error) {
    next(error);
  }
});

export default bookingRouter;
