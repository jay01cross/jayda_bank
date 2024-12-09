import express, { Request, Response } from "express";

import bcrypt from "bcryptjs";

import JWT from "jsonwebtoken";

import AccountService from "../services/account-service";

import { AccountStatus, EmailStatus, UserRoles } from "../interfaces/enum/user-enum";

import { IUserCreationBody } from "../interfaces/user-interface";

import Utility from "../utils/index.utils";

import { ResponseCode } from "../interfaces/enum/code-enum";

import TokenService from "../services/token-service ";

import { IToken } from "../interfaces/token-interface";

import EmailService from "../services/email-service";

import moment from "moment";

import PaymentService from "../services/payment-service ";

import TransactionService from "../services/transaction-service";

class TransactionController {
  private transactionService: TransactionService;

  constructor(_transactionService: TransactionService) {
    this.transactionService = _transactionService;
  }

  async initiatePaystackDeposit(req: Request, res: Response) {
    try {
      const params = { ...req.body };

      const depositInfo = await PaymentService.generatePaystackPaymentUrl(params.user.email, params.amount);

      if (!depositInfo) {
        return Utility.handleError(res, "Paystack payment not available, try again in few seconds", ResponseCode.NOT_FOUND);
      }

      const newTransaction = {
        userId: params.user.id,
        accountId: params.accountId,
        amount: params.amount,
        reference: depositInfo.reference,
        detail: {},
      };

      let deposit = await this.transactionService.depositByPaystack(newTransaction);

      return Utility.handleSuccess(
        res,
        "Transaction created successfully",
        { transaction: deposit, url: depositInfo.authorization_url },
        ResponseCode.SUCCESS
      );
    } catch (error) {
      return Utility.handleError(res, (error as TypeError).message, ResponseCode.SERVER_ERROR);
    }
  }
}

export default TransactionController;
