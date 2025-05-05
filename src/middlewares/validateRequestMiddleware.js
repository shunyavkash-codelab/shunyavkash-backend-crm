const validateRequest = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // report all validation errors
      allowUnknown: false, // prevent extra unexpected fields
      stripUnknown: true, // remove unknown fields
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        message: "Validation failed",
        errors: errorMessages,
      });
    }

    req[property] = value; // overwrite with sanitized values
    next();
  };
};

export default validateRequest;
