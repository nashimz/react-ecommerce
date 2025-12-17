// src/models/Product.ts
import { DataTypes, Model } from "sequelize";
import type { Optional, Sequelize } from "sequelize";

import type { IProduct } from "../types/product.d.ts";

// Extendemos IProduct para incluir los campos opcionales al crear
interface ProductCreationAttributes extends Optional<IProduct, "id"> {}

class Product
  extends Model<IProduct, ProductCreationAttributes>
  implements IProduct
{
  declare id: number;
  declare brand: string;
  declare title: string;
  declare price: number;
  declare images: string[];
  declare description: string;
  declare discountPercentage: number;
  declare category: string;
  declare thumbnail: string;
  declare rating: number;
  declare stock: number;
  declare warranty: string;
  declare shippingInfo: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly discountedPrice: number;

  public static associate: (models: any) => void;
}

export function initializeProduct(sequelize: Sequelize): typeof Product {
  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      brand: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      images: {
        type: DataTypes.JSON,
        get() {
          const raw = this.getDataValue("images");
          try {
            return typeof raw === "string" ? JSON.parse(raw) : raw;
          } catch {
            return [];
          }
        },
      },
      description: {
        type: DataTypes.TEXT,
      },
      discountPercentage: {
        type: DataTypes.DECIMAL(5, 2),
      },
      discountedPrice: {
        type: DataTypes.VIRTUAL,
        get() {
          const basePrice = Number(this.getDataValue("price"));
          const discount = Number(this.getDataValue("discountPercentage")) || 0;

          const finalPrice = basePrice * (1 - discount / 100);

          // Retornamos con 2 decimales
          return parseFloat(finalPrice.toFixed(2));
        },
      },
      category: {
        type: DataTypes.STRING,
      },
      thumbnail: {
        type: DataTypes.STRING,
      },
      rating: {
        type: DataTypes.DECIMAL(3, 2),
      },
      stock: {
        type: DataTypes.INTEGER,
      },
      warranty: {
        type: DataTypes.STRING,
      },
      shippingInfo: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      tableName: "products",
      modelName: "Product",
      timestamps: true,
    }
  );
  return Product;
}

export default Product;
