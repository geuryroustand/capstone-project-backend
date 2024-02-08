import sgMail from "@sendgrid/mail";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import emailView from "../views/emailView.js";
import contactMessageModel from "../models/contactMessage.js";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendContactMessage = async (req, res, next) => {
  const errorsList = validationResult(req);
  const locale = req.body.locale || "en";

  if (!errorsList.isEmpty()) {
    return next(createHttpError(400, { errors: errorsList.errors }));
  }

  try {
    const messageId = await contactMessageModel.createContactMessage(req.body);
    const emailContent = emailView.generateEmailContent(locale, req.body);

    const msg = {
      to: req.body.email,
      from: "info@vacationstaxis.com",
      bcc: "vacationstaxis@gmail.com",
      ...emailContent,
    };

    sgMail
      .send(msg)
      .then(() => console.log("Email sent"))
      .catch((error) => console.error(error));

    res.send({ _id: messageId });
  } catch (error) {
    next(error);
  }
};

export default {
  sendContactMessage,
};
