import express from "express";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

import bookingSchema from "./bookingSchema.js";
// import userModel from "../user/schema.js";
import privateTransfersSchema from "../airportPrivatePrices/privateTransfersSchema.js";
import languageTemplates from "./languageContent.js";
const bookingRouter = express.Router();

// bookingRouter.get("/", async (req, res, next) => {
//   try {
//     const getLocations = await locationSchema.find();
//     res.send(getLocations);
//   } catch (error) {
//     next(error);
//   }
// });

// Define language templates for each supported language

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

    const emailContent =
      languageTemplates[req.body.locale] || languageTemplates.en;

    const isRoundTripOrOneWay = req.body.roundtrip
      ? `
      <ul>
        <strong>${emailContent.arrivalInfo}</strong>
        <li><strong>${emailContent.pickUp}</strong> ${req.body.pickUp}</li>
        <li><strong>${emailContent.dropOff}</strong> ${req.body.dropOff}</li>
        <li><strong>${emailContent.pickUpDate}</strong> ${req.body.pickUpDate}</li>
        <li><strong>${emailContent.arrivalTime}</strong> ${req.body.pickUpTime}</li>
        <hr>
        <strong>${emailContent.departureInfo}</strong>
        <li><strong>${emailContent.pickUpDeparture}</strong> ${req.body.pickUpReturn}</li>
        <li><strong>${emailContent.dropOffDeparture}</strong> ${req.body.dropOffReturn}</li>
        <li><strong>${emailContent.departureDate}</strong> ${req.body.dropOffDate}</li>
        <li><strong>${emailContent.departureTime}</strong> ${req.body.dropOffTime}</li>
        <li><strong>${emailContent.passengers}</strong> ${req.body.pickUpPassenger}</li>
        <hr>
        <strong>${emailContent.paymentInfo}</strong>
        <li><strong>${emailContent.totalPrice}</strong> $USD${req.body.totalPrice}</li>
        <li><strong>${emailContent.paymentMethod}</strong> ${req.body.paymentMethod}</li>
      </ul>
  
      <strong>${emailContent.returnPickUpNote}</strong>
    `
      : `
      <ul>
        <strong>${emailContent.arrivalInfo}</strong>
        <li><strong>${emailContent.pickUp}</strong> ${req.body.pickUp}</li>
        <li><strong>${emailContent.dropOff}</strong> ${req.body.dropOff}</li>
        <li><strong>${emailContent.pickUpDate}</strong> ${req.body.pickUpDate}</li>
        <li><strong>${emailContent.arrivalTime}</strong> ${req.body.pickUpTime}</li>
        <li><strong>${emailContent.passengers}</strong> ${req.body.pickUpPassenger}</li>
        <hr>
        <strong>${emailContent.paymentInfo}</strong>
        <li><strong>${emailContent.totalPrice}</strong> $USD${req.body.totalPrice}</li>
        <li><strong>${emailContent.paymentMethod}</strong> ${req.body.paymentMethod}</li>
      </ul>
    `;

    const msg = {
      to: `${req.body.email}`,
      from: "info@vacationstaxis.com",
      bcc: "vacationstaxis@gmail.com",
      subject: emailContent.subject,
      html: `
        <p>${emailContent.dear} ${req.body.firstName} ${req.body.lastName}</p>
        <p>${emailContent.bookingDetails}</p>
        ${isRoundTripOrOneWay}
        <p>${emailContent.professionalDriverNote}</p>
        <p>${emailContent.specialRequestsNote}</p>
        <p>${emailContent.contactUsNote}</p>
        <p>${emailContent.thankYouNote}</p>
        <p>${emailContent.sincerely},</p>
        <p>${emailContent.companyTeam}</p>
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
