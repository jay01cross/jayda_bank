import { FindOptions, Model, Optional, Transaction } from "sequelize";

export interface IAccount {
  id: string;
  userId: string;
  accountNumber: string;
  balance: number;
  type: Date; // SAVING_ACCOUNT, CURRENT ACCOUNT, COOPERATE (mostly the type of account determines the withdraw amount, lower or higher transaction fee.)
  status: string; // ACTIVE, DORMANT, FROZEN, UNDER_REVIEW
  createdAt: Date;
  updatedAt: Date;
}

export interface IFindAccountQuery {
  where: { [key: string]: string };
  raw?: boolean;
  transaction?: Transaction;
  returning?: boolean;
}

export interface IAccountCreationBody extends Optional<IAccount, "id" | "createdAt" | "updatedAt"> {}

export interface IAccountModel extends Model<IAccount, IAccountCreationBody>, IAccount {}

export interface IAccountDataSource {
  create(record: IAccountCreationBody): Promise<IAccount>;

  fetchOne(query: IFindAccountQuery): Promise<IAccount | null>;

  updateOne(searchBy: IFindAccountQuery, data: Partial<IAccount>): Promise<void>;

  fetchAll(query: FindOptions<IAccount>): Promise<IAccount[]>;
}
