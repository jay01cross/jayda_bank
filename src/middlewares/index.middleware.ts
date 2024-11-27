import { NextFunction, Request, Response } from "express";

import { Schema } from "yup";

import Utility from "../utils/index.utils";

import { ResponseCode } from "../interfaces/enum/code-enums";

// validator middleware function
export const validator = (schema: Schema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (error: any) {
      console.error(error);
      return Utility.handleError(
        res,
        error.errors[0],
        ResponseCode.BAD_REQUEST
      );
    }
  };
};
