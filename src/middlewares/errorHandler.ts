import { ErrorRequestHandler, RequestHandler } from "express";
import { sendResponse } from "../utils/sendResponse";

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
  console.error(error?.message);
  sendResponse({
    res,
    success: false,
    message: error?.message || "Something went wrong",
    data: error?.data,
    statusCode: error?.statusCode || 500,
    errorMessages: [{ path: req.originalUrl, message: error?.message }],
  });
};
