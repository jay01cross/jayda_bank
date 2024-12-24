import { NextFunction, Request, Response } from "express";

import { Schema } from "yup";

import jwt from "jsonwebtoken";

import Utility from "../utils/index.utils";

import { ResponseCode } from "../interfaces/enum/code-enum";

import { IUser } from "../interfaces/user-interface";

import { userService } from "../router/user-router";

// validator middleware function
export const validator = (schema: Schema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (error: any) {
      console.error(error);
      return Utility.handleError(res, error.errors[0], ResponseCode.BAD_REQUEST);
    }
  };
};

// Authorization function
export const Auth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // get token from user browser
      let token: string = req.headers.authorization ?? "";

      // return error if it's empty
      if (Utility.isEmpty(token)) {
        throw new TypeError("Authorization Failed");
      }

      // split token and take the second value
      token = token.split(" ")[1];

      // verify token with jwt
      const decoded = jwt.verify(token, process.env.JWT_KEY as string) as IUser;

      if (decoded && decoded.id) {
        // if token verified, check if user still exists
        const user = await userService.getUserByField({ id: decoded.id });

        // if user does not exist, return error
        if (!user) {
          throw new TypeError("Authorization Failed");
        }

        // if user account status == "deleted", return error
        if (user.accountStatus == "DELETED") {
          throw new TypeError("Authorization Failed");
        }

        req.body.user = decoded;
        // console.log(req.body.user);

        next();
      } else {
        throw new TypeError("Authorization Failed");
      }
    } catch (error) {
      console.error(error);
      return Utility.handleError(res, (error as TypeError).message, ResponseCode.BAD_REQUEST);
    }
  };
};
