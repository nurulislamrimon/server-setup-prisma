import { Prisma } from "@prisma/client";
import { Request } from "express";
import { ZodError, ZodIssue } from "zod";

// ------------------------------------------
// format prisma error
// ------------------------------------------
export function formatPrismaError(error: any, req: Request) {
  console.log("Full Prisma Error:", error);

  let messages = [];
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.message.includes("Argument")) {
      const matches = [
        ...error.message.matchAll(/Argument `(.*?)` is missing/g),
      ];
      if (matches.length > 0) {
        matches.forEach((match) => {
          const fieldName = match[1];
          messages.push({
            path: fieldName,
            message: `${fieldName.replace(/_/g, " ")} is required`,
          });
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
    const matches = [...error.message.matchAll(/Argument `(.*?)` is missing/g)];
    if (matches.length > 0) {
      matches.forEach((match) => {
        const fieldName = match[1];
        messages.push({
          path: fieldName,
          message: `${fieldName.replace(/_/g, " ")} is required`,
        });
      });
    } else {
      messages.push({
        path: req.originalUrl,
        message: "Invalid data provided to Prisma.",
      });
    }
  } else {
    messages.push({
      path: req.originalUrl,
      message: error?.message || "An unknown error occurred",
    });
  }
  return { errorMessages: messages };
}

// ------------------------------------------
// format zod error
// ------------------------------------------
export const formatZodError = (error: ZodError) => {
  const errors = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });

  return {
    errorMessages: errors,
  };
};
