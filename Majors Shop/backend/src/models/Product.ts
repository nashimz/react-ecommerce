// src/models/Product.ts
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.js";
import { IProduct } from "../types/product.d.js";

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

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

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
    },
    description: {
      type: DataTypes.TEXT,
    },
    discountPercentage: {
      type: DataTypes.DECIMAL(5, 2),
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
  },
  {
    sequelize,
    tableName: "products",
    timestamps: true,
  }
);

export default Product;
