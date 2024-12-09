import express, { Request, Response } from "express";

import TransactionController from "../controllers/transaction-controller";

import TransactionService from "../services/transaction-service";

import TransactionDataSource from "../datasources/transaction-datasource";

import { Auth, validator } from "../middlewares/index.middleware";

import ValidatorSchema from "../validators/transaction-validator-schema";

const router = express.Router();

const transactionService = new TransactionService(new TransactionDataSource());

const transactionController = new TransactionController(transactionService);

const createTransactionRoute = () => {
  router.post("/initiate-paystack-deposit", validator(ValidatorSchema.initiatePaystackDeposit), Auth(), (req: Request, res: Response) => {
    return transactionController.initiatePaystackDeposit(req, res);
  });

  return router;
};

export default createTransactionRoute();
