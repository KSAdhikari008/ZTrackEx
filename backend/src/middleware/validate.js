import { validationResult } from "express-validator";

export function validate(req, res, next) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    // Keep only the field and msg properties. Oher properties are sensitive (val, location etc.)
    const errors = result.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return next(Object.assign(new Error("Validation failed"), {
            statusCode: 400,
            errors,
        }));
  }

  next();
}
