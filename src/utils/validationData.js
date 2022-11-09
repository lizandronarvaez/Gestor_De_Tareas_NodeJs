import { body } from "express-validator";

const validatorInputData = body("nombre").not().isEmpty().trim().escape();

export { validatorInputData };
