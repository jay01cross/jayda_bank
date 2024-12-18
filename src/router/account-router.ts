import express, { Request, Response } from "express";

import AccountController from "../controllers/account-controller";

import AccountService from "../services/account-service";

import AccountDataSource from "../datasources/account-datasource";

import { Auth, validator } from "../middlewares/index.middleware";

import ValidatorSchema from "../validators/account-validator-schema";

const router = express.Router();

const accountService = new AccountService(new AccountDataSource());

const accountController = new AccountController(accountService);

const createAccountRoute = () => {
  router.post("/create-account", validator(ValidatorSchema.createAccountSchema), Auth(), (req: Request, res: Response) => {
    return accountController.createAccount(req, res);
  });

  router.get("/account-list", Auth(), (req: Request, res: Response) => {
    return accountController.getAllUserAccounts(req, res);
  });

  router.get("/:id", Auth(), (req: Request, res: Response) => {
    return accountController.getUserAccount(req, res);
  });

  return router;
};

export default createAccountRoute();
