import { ErrorRequestHandler, RequestHandler } from "express";
import { sendResponse } from "../utils/sendResponse";
import formatPrismaError from "../helpers/errorFormatter";

export const notFoundRouteHandler: RequestHandler = (req, res, next) => {
  next({ message: "Route not found", statusCode: 404 });
};

// global error handler
export const globalErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
) => {
  let errorMessages = [{ path: req.originalUrl, message: error?.message }];
  if (error?.name === "PrismaClientValidationError") {
    const simplifiedError = formatPrismaError(error, req);
    errorMessages = simplifiedError?.errorMessages;
  }

  sendResponse({
    res,
    success: false,
    message: error?.name || "Internal server error!",
    data: error?.data,
    statusCode: error?.statusCode || 500,
    errorMessages,
  });
};
