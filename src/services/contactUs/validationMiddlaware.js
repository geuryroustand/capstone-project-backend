import { body } from "express-validator";

export const contactUsInputValidationMiddleware = [
  body("name")
    .exists()
    .withMessage("Name field is mandatory!! ")
    .notEmpty()
    .withMessage("Name cannot be empty!"),

  body("message")
    .exists()
    .withMessage("Message field is mandatory!!")
    .notEmpty()
    .withMessage("Message name cannot be empty!"),
  body("email")
    .exists()
    .withMessage("Email field is mandatory!!")
    .isEmail()
    .withMessage("Please provide a valid email!"),
];
