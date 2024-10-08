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
  // if headers sended then return next(error);
  if (res.headersSent) return;
  let errorMessages = [{ path: req.originalUrl, message: error?.message }];
  if (
    error?.name === "PrismaClientValidationError" ||
    error?.name === "PrismaClientKnownRequestError" ||
    error?.name === "PrismaClientUnKnownRequestError"
  ) {
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
