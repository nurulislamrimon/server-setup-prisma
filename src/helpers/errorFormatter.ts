import { Prisma } from "@prisma/client";
import { Request } from "express";

function formatPrismaError(error: any, req: Request) {
  let messages = [];

  // Handle Known Prisma Errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle Missing Required Fields (like the one in your example)
    if (error.message.includes("Argument")) {
      const match = error.message.match(/Argument `(.*?)` is missing/);
      if (match) {
        const fieldName = match[1]; // Get the field name (e.g., "phone_number")
        messages.push({
          path: fieldName,
          message: `${fieldName.replace(/_/g, " ")} is required`,
        });
      }
    }

    // Handle Unique Constraint Violations (P2002)
    if (error.code === "P2002") {
      const fields = error.meta?.target || [];
      Array.isArray(fields) &&
        fields.forEach((field: string) => {
          messages.push({
            path: field,
            message: `${field.replace(/_/g, " ")} must be unique`,
          });
        });
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    const match = error.message.match(/Argument `(.*?)` is missing/);
    if (match) {
      const fieldName = match[1];
      messages.push({
        path: fieldName,
        message: `${fieldName.replace(/_/g, " ")} is required`,
      });
    } else {
      messages.push({
        path: req.originalUrl,
        message: "Invalid data provided to Prisma.",
      });
    }
  } else {
    // Fallback for general errors
    messages.push({
      path: req.originalUrl,
      message: error?.message || "An unknown error occurred",
    });
  }

  // Return formatted errors
  return { errorMessages: messages };
}

export default formatPrismaError;
