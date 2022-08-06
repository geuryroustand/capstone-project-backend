import { body } from "express-validator";

export const userInputValidationMiddleware = [
  body("firstName")
    .exists()
    .withMessage("First name field is mandatory!! ")
    .notEmpty()
    .withMessage("First name cannot be empty!"),
  body("lastName")
    .exists()
    .withMessage("Last name field is mandatory !! ")
    .notEmpty()
    .withMessage("Last name cannot be empty"),
  body("email")
    .exists()
    .withMessage("Email field is mandatory !! ")
    .isEmail()
    .withMessage("Please send a valid email!"),
];
