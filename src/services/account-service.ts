import sequelize from "../database";
import { IFindAccountQuery, IAccount, IAccountCreationBody, IAccountDataSource } from "../interfaces/account-interface";

import { AccountStatus } from "../interfaces/enum/account-enum";

import { IUser } from "../interfaces/user-interface";

class AccountService {
  private accountDataSource: IAccountDataSource;

  constructor(_accountDataSource: IAccountDataSource) {
    this.accountDataSource = _accountDataSource;
  }

  private generateAccountNumber(): string {
    let accountNumber = "";

    for (let i = 0; i < 10; i++) {
      accountNumber += Math.floor(Math.random() * 10);
    }

    // console.log(accountNumber);
    return accountNumber;
  }

  private async createAccountNumber() {
    let accountNumber = "";

    while (accountNumber == "") {
      const result = this.generateAccountNumber();

      const exist = await this.accountDataSource.fetchOne({ where: { accountNumber: result }, raw: true });

      if (!exist) {
        accountNumber = result;
        break;
      }
    }
    // console.log(accountNumber);
    return accountNumber;
  }

  async createAccount(data: Partial<IAccountCreationBody>) {
    const record = {
      ...data,
      accountNumber: await this.createAccountNumber(),
      balance: 0.0,
      status: AccountStatus.ACTIVE,
    } as IAccountCreationBody;

    return this.accountDataSource.create(record);
  }

  async getAccountsByUserId(userId: string) {
    const query = { where: { userId }, raw: true };

    return this.accountDataSource.fetchAll(query);
  }

  async getAccountByField(record: Partial<IAccount>) {
    const query = { where: { ...record }, raw: true } as IFindAccountQuery;

    return this.accountDataSource.fetchOne(query);
  }

  async topUpBalance(accountId: string, amount: number, options: Partial<IFindAccountQuery> = {}) {
    const filter = { where: { id: accountId }, ...options };

    const update = { balance: sequelize.literal(`balance+${amount}`) };

    return await this.accountDataSource.updateOne(filter, update as any);
  }
}

export default AccountService;
