import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
import { environment } from "../utils/environment";
import { sendErrorResponse } from "../utils/response";

interface UserRequest extends Request {
  user: any;
}

const authMiddleware = async (
  req: any,
  res: any,
  next: any
): Promise<any> => {
  try {
    const authHeader = req.headers.authorization || "";
    const token =
      (authHeader && authHeader.split(" ")[1]) || req.cookies["token"] || "";

    if (!token) {
      return sendErrorResponse(res, "Unauthorized Access", 401);
    } else {
      const decoded = jwt.decode(token);
      jwt.verify(token, environment.jwt.secret, (err: any, user: any) => {
        if (err) {
          return sendErrorResponse(
            res,
            "You have been logged out, please login again",
            401
          );
        }

        req.user = decoded;
        next();
      });
    }
  } catch (error) {
    sendErrorResponse(res, "Unauthorized Access", 401);
  }
};

export default authMiddleware;
