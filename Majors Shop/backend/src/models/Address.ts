import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import type { IAddress } from "../types/address";

interface AddressCreationAttritubes extends Optional<IAddress, "id"> {}

class Address
  extends Model<IAddress, AddressCreationAttritubes>
  implements IAddress
{
  declare id: number;
  declare userId: number;
  declare street: string;
  declare city: string;
  declare zipCode: string;
  declare country: string;
  declare isShipping: boolean;
  declare isBilling: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  public static associate: (models: any) => void;
}

export function initializeAddress(sequelize: Sequelize): typeof Address {
  Address.init(
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      street: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      zipCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isShipping: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      isBilling: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
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
      tableName: "addresses",
      modelName: "Address",
      timestamps: true,
    }
  );
  return Address;
}
export default Address;
