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

class AccountController {
  private accountService: AccountService;

  constructor(_accountService: AccountService) {
    this.accountService = _accountService;
  }

  async createAccount(req: Request, res: Response) {
    try {
      const params = { ...req.body };

      const newAccount = {
        userId: params.user.id,
        type: params.type,
      };

      let account = await this.accountService.createAccount(newAccount);

      return Utility.handleSuccess(res, "Account created successfully", { account }, ResponseCode.SUCCESS);
    } catch (error) {
      return Utility.handleError(res, (error as TypeError).message, ResponseCode.SERVER_ERROR);
    }
  }

  async getAllUserAccounts(req: Request, res: Response) {
    try {
      const params = { ...req.body };

      let accounts = await this.accountService.getAccountsByUserId(params.user.id);

      return Utility.handleSuccess(res, "Account fetched successfully", { accounts }, ResponseCode.SUCCESS);
    } catch (error) {
      return Utility.handleError(res, (error as TypeError).message, ResponseCode.SERVER_ERROR);
    }
  }

  async getUserAccount(req: Request, res: Response) {
    try {
      const params = { ...req.params };

      let account = await this.accountService.getAccountByField({ id: Utility.escapeHtml(params.id) });

      if (!account) {
        return Utility.handleError(res, "Account does not exist", ResponseCode.NOT_FOUND);
      }

      return Utility.handleSuccess(res, "Account fetched successfully", { account }, ResponseCode.SUCCESS);
    } catch (error) {
      return Utility.handleError(res, (error as TypeError).message, ResponseCode.SERVER_ERROR);
    }
  }
}

export default AccountController;
