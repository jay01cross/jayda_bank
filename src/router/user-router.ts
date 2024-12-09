import express, { Request, Response } from "express";

import UserController from "../controllers/user-controller";

import UserService from "../services/user-service";

import { validator } from "../middlewares/index.middleware";

import ValidatorSchema from "../validators/user-validator-schema";

import UserDataSource from "../datasources/user-datasource";

import TokenService from "../services/token-service ";

import TokenDataSource from "../datasources/token-datasource";

const router = express.Router();

const tokenService = new TokenService(new TokenDataSource());

export const userService = new UserService(new UserDataSource());

const userController = new UserController(userService, tokenService);

const createUserRoute = () => {
  // Utility.printRed("POST: /api/user/register");
  router.post("/register", validator(ValidatorSchema.registerSchema), (req: Request, res: Response) => {
    return userController.register(req, res);
  });

  // Utility.printRed("POST: /api/user/login");
  router.post("/login", validator(ValidatorSchema.loginSchema), (req: Request, res: Response) => {
    return userController.login(req, res);
  });

  // Utility.printRed("POST: /api/user/forgot-password");
  router.post("/forgot-password", validator(ValidatorSchema.forgotPasswordSchema), (req: Request, res: Response) => {
    return userController.forgotPassword(req, res);
  });

  // Utility.printRed("POST: /api/user/reset-password");
  router.post("/reset-password", validator(ValidatorSchema.resetPasswordSchema), (req: Request, res: Response) => {
    return userController.resetPassword(req, res);
  });

  return router;
};

export default createUserRoute();
