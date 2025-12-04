import { DataTypes, Model, Sequelize } from "sequelize";
import type { ICart } from "../types/cart";
import type { Optional } from "sequelize";

interface CartCreationAttributes extends Optional<ICart, "id" | "status"> {}

class Cart extends Model<ICart, CartCreationAttributes> implements ICart {
  declare id: number;
  declare userId: number;
  declare status: "ACTIVE" | "COMPLETED" | "CANCELED";
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

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
      tableName: "Carts",
      modelName: "Cart",
      timestamps: true,
    }
  );
  return Cart;
}

export default Cart;
