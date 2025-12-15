import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import type { ITransaction } from "../types/transaction";

interface TransactionCreationAttributes extends Optional<ITransaction, "id"> {}

class Transaction
  extends Model<ITransaction, TransactionCreationAttributes>
  implements ITransaction
{
  declare id: number;
  declare orderId: number;
  declare transactionReference: string;
  declare paymentMethod: string;
  declare amount: number;
  declare status: string;

  public static associate: (models: any) => void;
}

export function initializeTransaction(
  sequelize: Sequelize
): typeof Transaction {
  Transaction.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "orders",
          key: "id",
        },
      },
      transactionReference: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      paymentMethod: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "transactions",
      modelName: "Transaction",
      timestamps: true,
    }
  );
  return Transaction;
}
export default Transaction;
