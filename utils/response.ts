import { Response } from "express";

type ResponsePayload = {
  [key: string]: any;
};

export const sendSuccessResponse = (
  res: Response,
  message: string | ResponsePayload = "Success",
  status: number = 200,
  flag: boolean = true
): Response => {
  const response = typeof message === "object" ? message : { message };
  return res.status(status).json({
    ...(flag ? { success: true } : {}),
    ...response,
  });
};

export const sendErrorResponse = (
  res: Response,
  message: string | ResponsePayload = "Internal Server Error",
  status: number = 500,
  flag: boolean = true
): Response => {
  const response = typeof message === "object" ? message : { message };
  return res.status(status).json({
    ...(flag ? { success: false } : {}),
    ...response,
  });
};
