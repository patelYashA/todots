import { Request, Response } from "express";
const jwt = require("jsonwebtoken");
import UserModel from "../models/user.model";
import { sendSuccessResponse, sendErrorResponse } from "../utils/response";
import { environment } from "../utils/environment"; 

export const signup = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, fullName } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      const user = new UserModel({
        fullName,
        email,
        password,
      });
      const savedUser = await user.save();

      return sendSuccessResponse(res, { data: savedUser });
    } else {
      return sendErrorResponse(
        res,
        "Account with that email address already exists.",
        400
      );
    }
  } catch (error: any) {
    sendErrorResponse(res, error.message);
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    res.clearCookie("token", { domain: `.${environment.domain}` });

    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
      return sendErrorResponse(res, "We are not aware of this user.", 403);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendErrorResponse(res, "Invalid email or password.", 401);
    }

    const token = jwt.sign({ _id: user._id }, environment.jwt.secret, {
      expiresIn: environment.jwt.expiredIn,
    });

    const { password: hash, ...data } = user.toObject();

    res.cookie("token", token, { domain: `.${environment.domain}` });

    sendSuccessResponse(res, {
      message: "Success! You are logged in.",
      token,
      data,
    });
  } catch (error: any) {
    sendErrorResponse(res, error.message);
  }
};
