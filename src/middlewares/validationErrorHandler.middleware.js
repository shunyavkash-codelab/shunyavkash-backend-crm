export const validationErrorHandler = (err, req, res, next) => {
  if (err && err.details) {
    const errorDetails =
      err.details.body ||
      err.details.query ||
      err.details.params ||
      err.details.headers ||
      [];

    return res.status(422).json({ errors: errorDetails });
  }
  return next();
};
