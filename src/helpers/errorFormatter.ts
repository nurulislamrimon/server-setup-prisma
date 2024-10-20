// ------------------------------------------
// format prisma error
// ------------------------------------------

import { Prisma } from "@prisma/client";
import { IErrorMessages } from "../utils/sendResponse";
import { Request } from "express";
import { ZodError, ZodIssue } from "zod";

export const formatPrismaValidationError = (
  error: Prisma.PrismaClientValidationError
) => {
  // Match the argument (field name) in the error message
  const pathMatch = error.message.match(
    /Argument `(.+?)`: Invalid value provided/
  );
  const path = pathMatch ? pathMatch[1] : "Unknown path"; // Extract the field name

  // Extract the detailed error message
  const messageMatch = error.message.match(/Invalid value provided. (.*)/);
  const detailedMessage = messageMatch
    ? messageMatch[1].trim()
    : error.message || "Unknown error";

  // Check for enum mismatch in the error message
  const enumMatch = error.message.match(/Expected one of: (.*)/);
  const enumValues = enumMatch
    ? enumMatch[1].split(", ").map((value) => value.trim())
    : [];

  // Format the error into the desired structure
  const formattedError = {
    message: "Validation Error",
    errorMessages: [
      {
        path: path,
        message: `${detailedMessage}${
          enumValues.length > 0
            ? ` Expected values: ${enumValues.join(", ")}`
            : ""
        }`,
      },
    ],
  };

  return formattedError;
};

export function formatPrismaClientKnownError(
  error: Prisma.PrismaClientKnownRequestError,
  req: Request
): { message: string; errorMessages: IErrorMessages[] } {
  let errorMessages: IErrorMessages[] = [];
  let message: string = error.name;
  const meta = error.meta as Prisma.PrismaClientKnownRequestError["meta"];

  switch (error.code) {
    case "P2002": // Unique constraint violation
      const uniqueField = Array.isArray(meta?.target)
        ? meta.target.join(", ")
        : (meta?.target as string) || "unknown field";
      errorMessages.push({
        path: uniqueField,
        message: `Unique constraint failed on the field(s): ${uniqueField}.`,
      });
      break;

    case "P2003": // Foreign key constraint violation
      if (error.message.includes("delete() invocation:")) {
        message = "Delete failed";
        errorMessages = [
          {
            path: "",
            message,
          },
        ];
      } else {
        const foreignKeyField = (meta?.field_name as string) || "unknown field";
        errorMessages.push({
          path: foreignKeyField,
          message: `Foreign key constraint failed on the field: ${foreignKeyField}.`,
        });
      }
      break;

    case "P2025": // Record not found
      message = (meta?.cause as string) || "Record not found!"; // Use type assertion to ensure it's a string
      errorMessages = [
        {
          path: "",
          message,
        },
      ];
      break;

    default: // Catch-all for unknown errors
      errorMessages = [
        {
          path: req.originalUrl,
          message: error?.message || "An unknown error occurred", // Ensure this is a string
        },
      ];
      break;
  }

  return { message, errorMessages };
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
    message: "Validation Error",
    errorMessages: errors,
  };
};
