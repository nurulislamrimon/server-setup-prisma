import { Request, Response, NextFunction } from "express";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const catchAsync = (fn: AsyncRequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    return await fn(req, res, next).catch(next);
  };
};
