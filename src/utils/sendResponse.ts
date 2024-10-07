import { Response } from "express";

interface ISendResponseProps<T> {
  res: Response;
  success: boolean;
  message: string;
  data?: T;
  meta?: IMeta;
  statusCode?: number;
  errorMessages?: IErrorMessages[];
}

interface IErrorMessages {
  path: string;
  message: string;
}

interface IMeta {
  total: number;
  page: number;
  limit: number;
}

export const sendResponse = <T>({
  res,
  success,
  message,
  data,
  meta,
  statusCode = 200,
  errorMessages,
}: ISendResponseProps<T>): void => {
  res.status(statusCode).json({
    success,
    message,
    meta,
    data,
    errorMessages,
  });
};
