import { DataTypes, Model, Sequelize } from "sequelize";
import type { ICart } from "../types/cart";
import type { NonAttribute, Optional } from "sequelize";
import type { InferAttributes, InferCreationAttributes } from "sequelize";

import CartItem from "./Cart-item";

interface CartCreationAttributes extends Optional<ICart, "id" | "status"> {}

class Cart
  extends Model<
    InferAttributes<Cart, { omit: "items" }>,
    InferCreationAttributes<Cart, { omit: "items" }>
  >
  implements ICart
{
  declare id: number;
  declare userId: number;
  declare status: "ACTIVE" | "COMPLETED" | "CANCELED";
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  public declare items: NonAttribute<CartItem[]>;
  public static associate: (models: any) => void;
}

export function initializeCart(sequelize: Sequelize): typeof Cart {
  Cart.init(
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
        unique: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      status: {
        type: DataTypes.ENUM("ACTIVE", "COMPLETED", "CANCELED"),
        allowNull: false,
        defaultValue: "ACTIVE",
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
      tableName: "carts",
      modelName: "Cart",
      timestamps: true,
    }
  );
  return Cart;
}

export default Cart;
