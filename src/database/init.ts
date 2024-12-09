import Db from "./index";

import UserModel from "../model/user-model";

import TokenModel from "../model/token-model";

import AccountModel from "../model/account-model";

import TransactionModel from "../model/transaction-model";

const DbInitialize = async () => {
  try {
    await Db.authenticate();
    UserModel.sync({ alter: false });
    TokenModel.sync({ alter: false });
    AccountModel.sync({ alter: false });
    TransactionModel.sync({ alter: false });
  } catch (error) {
    console.error("Unable to connect to our database ====> ", error);
  }
};

export default DbInitialize;
