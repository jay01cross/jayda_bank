import express, { Request, Response } from "express";

import bcrypt from "bcryptjs";

import JWT from "jsonwebtoken";

import UserService from "../services/user-service";

import { AccountStatus, EmailStatus, UserRoles } from "../interfaces/enum/user-enum";

import { IUserCreationBody } from "../interfaces/user-interface";

import Utility from "../utils/index.utils";

import { ResponseCode } from "../interfaces/enum/code-enum";

import TokenService from "../services/token-service ";

import { IToken } from "../interfaces/token-interface";

import EmailService from "../services/email-service";

import moment from "moment";

class UserController {
  private userService: UserService;

  private tokenService: TokenService;

  constructor(_userService: UserService, _tokenService: TokenService) {
    this.userService = _userService;
    this.tokenService = _tokenService;
  }

  async register(req: Request, res: Response) {
    try {
      //-- Structure the data
      const params = { ...req.body };

      const newUser = {
        firstname: params.firstname,
        lastname: params.lastname,
        email: params.email,
        username: params.email.split("@")[0],
        password: params.password,
        role: UserRoles.CUSTOMER,
        isEmailVerified: EmailStatus.NOT_VERIFIED,
        accountStatus: AccountStatus.ACTIVE,
      } as IUserCreationBody;

      //-- Hash the password
      newUser.password = bcrypt.hashSync(newUser.password, 10);

      //-- Check if user exist
      let userExists = await this.userService.getUserByField({
        email: newUser.email,
      });

      if (userExists) {
        return Utility.handleError(res, "Email already exists", ResponseCode.ALREADY_EXIST);
      }

      //-- Create the User
      let user = await this.userService.createUser(newUser);

      user.password = "";
      //-- Generate a token for verification
      //-- Sending the welcome/verification email
      return Utility.handleSuccess(res, "User registered successfully", { user }, ResponseCode.SUCCESS);
    } catch (error) {
      return Utility.handleError(res, (error as TypeError).message, ResponseCode.SERVER_ERROR);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const params = { ...req.body };

      // check if user exist
      let user = await this.userService.getUserByField({ email: params.email });

      if (!user) {
        return Utility.handleError(res, "Invalid login details", ResponseCode.NOT_FOUND);
      }

      let isPasswordMatch = await bcrypt.compare(params.password, user.password);

      if (!isPasswordMatch) {
        return Utility.handleError(res, "Invalid login details", ResponseCode.NOT_FOUND);
      }

      const token = JWT.sign(
        {
          firstname: user.firstname,
          lastname: user.lastname,
          id: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_KEY as string,
        { expiresIn: "30d" }
      );

      return Utility.handleSuccess(res, "Login Successful", { user, token }, ResponseCode.SUCCESS);
    } catch (error) {
      return Utility.handleError(res, (error as TypeError).message, ResponseCode.SERVER_ERROR);
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const params = { ...req.body };

      // check if user exist
      let user = await this.userService.getUserByField({ email: params.email });

      if (!user) {
        return Utility.handleError(res, "Account does not exist", ResponseCode.NOT_FOUND);
      }

      const token = (await this.tokenService.createForgotPasswordToken(params.email)) as IToken;

      await EmailService.sendForgotPasswordMail(params.email, token.code);

      return Utility.handleSuccess(res, "Password reset code has been sent to your email", { user, token }, ResponseCode.SUCCESS);
    } catch (error) {
      return Utility.handleError(res, (error as TypeError).message, ResponseCode.SERVER_ERROR);
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const params = { ...req.body };

      let isValidToken = await this.tokenService.getTokenByField({
        key: params.email,
        code: params.code,
        type: this.tokenService.TokenTypes.FORGOT_PASSWORD,
        status: this.tokenService.TokenStatus.NOT_USED,
      });

      if (!isValidToken) {
        return Utility.handleError(res, "Token has expired", ResponseCode.NOT_FOUND);
      }

      if (isValidToken && moment(isValidToken.expires).diff(moment(), "minute") <= 0) {
        return Utility.handleError(res, "Token has expired", ResponseCode.NOT_FOUND);
      }

      let user = await this.userService.getUserByField({ email: params.email });

      if (!user) {
        return Utility.handleError(res, "Invalid user record", ResponseCode.NOT_FOUND);
      }

      const _password = bcrypt.hashSync(params.password, 10);

      await this.userService.updateRecord({ id: user.id }, { password: _password });

      await this.tokenService.updateRecord({ id: isValidToken.id }, { status: this.tokenService.TokenStatus.USED });

      return Utility.handleSuccess(res, "Password reset successful", {}, ResponseCode.SUCCESS);
    } catch (error) {
      return Utility.handleError(res, (error as TypeError).message, ResponseCode.SERVER_ERROR);
    }
  }
}

export default UserController;
