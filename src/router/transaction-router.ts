import express, { Request, Response } from "express";

import TransactionController from "../controllers/transaction-controller";

import TransactionService from "../services/transaction-service";

import TransactionDataSource from "../datasources/transaction-datasource";

import { Auth, validator } from "../middlewares/index.middleware";

import ValidatorSchema from "../validators/transaction-validator-schema";

import AccountDataSource from "../datasources/account-datasource";

import AccountService from "../services/account-service";

const router = express.Router();

const accountService = new AccountService(new AccountDataSource());

const transactionService = new TransactionService(new TransactionDataSource());

const transactionController = new TransactionController(transactionService, accountService);

const createTransactionRoute = () => {
  router.post("/initiate-paystack-deposit", validator(ValidatorSchema.initiatePaystackDeposit), Auth(), (req: Request, res: Response) => {
    return transactionController.initiatePaystackDeposit(req, res);
  });

  router.post("/verify-paystack-deposit", validator(ValidatorSchema.verifyPaystackDeposit), Auth(), (req: Request, res: Response) => {
    return transactionController.verifyPaystackDeposit(req, res);
  });

  return router;
};

export default createTransactionRoute();
