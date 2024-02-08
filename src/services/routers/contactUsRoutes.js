// routes/contactUsRoutes.js
import express from "express";

import contactUsController from "../controllers/contactUsController.js";
import { contactUsInputValidationMiddleware } from "../validationMiddleware/validationMiddleware.js";

const contactUsRouter = express.Router();

contactUsRouter.post(
  "/",
  contactUsInputValidationMiddleware,
  contactUsController.sendContactMessage
);

export default contactUsRouter;
