import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { config } from "../config";
import { verifyToken } from "../helpers/jwt";

export const authentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
      throw new ApiError(403, "Access forbidden!");
    }
    //   verify accessToken
    const payload = verifyToken(accessToken, config.accessTokenSecret) as {
      email: string;
      role: string;
    };
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorization = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Call authentication first
    authentication(req, res, (authError: any) => {
      if (authError) {
        return next(authError);
      }

      if (!req.user) {
        return next(new ApiError(401, "Unauthorized"));
      }

      // Check if req.user has the role property
      if (typeof req.user === "object" && "role" in req.user) {
        const user = req.user;
        if (!roles.includes(user.role)) {
          return next(new ApiError(403, "Access forbidden!"));
        }
      } else {
        return next(new ApiError(403, "Access forbidden!"));
      }

      next();
    });
  };
};
