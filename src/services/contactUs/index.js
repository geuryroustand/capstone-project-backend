import express from "express";
import createHttpError from "http-errors";
import sgMail from "@sendgrid/mail";
import contactUsSchema from "./contactUsSchema.js";
import { contactUsInputValidationMiddleware } from "./validationMiddlaware.js";
import { validationResult } from "express-validator";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const contactUsRouter = express.Router();

contactUsRouter.post(
  "/",
  contactUsInputValidationMiddleware,
  async (req, res, next) => {
    const errorsList = validationResult(req);

    const { errors } = errorsList;

    if (!errorsList.isEmpty()) return next(createHttpError(400, { errors }));

    try {
      const createMessage = await contactUsSchema.create(req.body);

      const { _id } = createMessage;

      const msg = {
        to: `${req.body.email}`, // Change to your recipient
        from: "vacationstaxis@gmail.com", // Change to your verified sender
        cc: "roustandgeury@gmail.com",
        subject: "Confirmation of Receipt your request vacationstaxis.com",

        html: `
    <p>Dear ${req.body.name}</p>
    <p>I hope this email finds you well. I am writing to confirm that we have received your [insert reason for contact] request via our website's contact form</p>
  
    <p>We appreciate your interest in our Dominican Republic Airport transfer/Tours services and we are glad to assist you with your inquiry. Our team will review your request as soon as possible and we will get back to you within 24 hours with a response.</p>

    <p>If you have any further questions or concerns, please do not hesitate to contact us. We are always happy to help!</p>

    <p>Thank you for contacting us and for considering our Airport transfer/Tours services. We look forward to speaking with you soon.</p>
  
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
  }
);

export default contactUsRouter;
