import { Model, Optional } from "sequelize";

export interface IToken {
  id: string;
  key: string;
  code: string;
  type: string;
  expires: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFindTokenQuery {
  where: { [key: string]: string };
  raw?: boolean;
  returning: boolean;
}

export interface ITokenCreationBody extends Optional<IToken, "id" | "createdAt" | "updatedAt"> {}

export interface ITokenModel extends Model<IToken, ITokenCreationBody>, IToken {}

export interface ITokenDataSource {
  create(record: ITokenCreationBody): Promise<IToken>;
  fetchOne(query: IFindTokenQuery): Promise<IToken | null>;
  updateOne(data: Partial<IToken>, query: IFindTokenQuery): Promise<void>;
}
