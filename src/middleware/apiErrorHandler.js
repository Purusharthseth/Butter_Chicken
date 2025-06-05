import ApiError from "../utils/Apierror.js";

function apiErrorHandler(err, req, res, next) {
 
  if (!(err instanceof ApiError)) {
    err = new ApiError(
      err.statusCode || 500,
      err.message || "Internal Server Error",
      [],
      err.stack
    );
  }


  console.error(err.stack);

  res.status(err.statusCode).json({
    success: err.success,
    message: err.message,
    errors: err.errors,
    data: err.data,
  });
}

export default apiErrorHandler;
