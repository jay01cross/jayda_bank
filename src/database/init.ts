import Db from "./index";

import UserModel from "../model/user-model";

import TokenModel from "../model/token-model";

const DbInitialize = async () => {
  try {
    await Db.authenticate();
    UserModel.sync({ alter: false });
    TokenModel.sync({ alter: false });
  } catch (error) {
    console.error("Unable to connect to our database ====> ", error);
  }
};

export default DbInitialize;
