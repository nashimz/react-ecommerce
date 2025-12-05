import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import type { IOrder } from "../types/order";

interface OrderCreationAttributes extends Optional<IOrder, "id" | "status"> {}

class Order extends Model<IOrder, OrderCreationAttributes> implements IOrder {
  declare id: number;
  declare userId: number;
  declare orderDate: Date;
  declare status: string;
  declare totalAmount: number;
  declare shippingAddressId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  public static associate: (models: any) => void;
}

export function initializeOrder(sequelize: Sequelize): typeof Order {
  Order.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      orderDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("COMPLETED", "PENDING"),
        allowNull: false,
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      shippingAddressId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "addresses",
          key: "id",
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "orders",
      modelName: "Order",
      timestamps: true,
    }
  );
  return Order;
}

export default Order;
