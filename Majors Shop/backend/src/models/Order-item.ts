import { DataTypes, Optional, Sequelize, Model, Association } from "sequelize";
import type { IOrderItem } from "../types/order-item";
import Order from "./Order";

interface OrderItemCreationAttributes extends Optional<IOrderItem, "id"> {}

class OrderItem
  extends Model<IOrderItem, OrderItemCreationAttributes>
  implements IOrderItem
{
  declare id: number;
  declare orderId: number;
  declare productId: number;
  declare quantity: number;
  declare unitPrice: number;

  public static associate: (models: any) => void;
}

export function initializeOrderItem(sequelize: Sequelize): typeof OrderItem {
  OrderItem.init(
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
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
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "order_items",
      modelName: "OrderItem",
      timestamps: true,
    }
  );
  return OrderItem;
}
export default OrderItem;
