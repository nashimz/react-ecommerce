import { DataTypes, Model, Sequelize } from "sequelize";
import type { Optional } from "sequelize";
import type { ICartItem } from "../types/cart-item";
import Product from "./Product";

interface CartItemCreationAttributes extends Optional<ICartItem, "id"> {}
class CartItem
  extends Model<ICartItem, CartItemCreationAttributes>
  implements ICartItem
{
  declare id: number;
  declare cartId: number;
  declare productId: number;
  declare quantity: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  public static associate: (models: any) => void;
  public product?: Product;
}

export function initializeCartItem(sequelize: Sequelize): typeof CartItem {
  CartItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },

      cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "carts",
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
        defaultValue: 1,
      },
    },
    {
      sequelize,
      tableName: "cart_items",
      modelName: "CartItem",
      timestamps: true,
    }
  );
  return CartItem;
}

export default CartItem;
