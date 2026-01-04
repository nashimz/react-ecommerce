import { DataTypes, Model, Sequelize } from "sequelize";

import type { IUser } from "../types/user.d.ts";
import type { Optional } from "sequelize";

interface UserCreationAttributes extends Optional<IUser, "id" | "role"> {}

class User extends Model<IUser, UserCreationAttributes> implements IUser {
  declare id: number;
  declare email: string;
  declare password: string;
  declare role: "admin" | "customer";
  declare name: string;
  declare surname: string;
  declare phone: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

export function initializeUser(sequelize: Sequelize): typeof User {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      role: {
        type: DataTypes.ENUM("admin", "customer"),
        allowNull: false,
        defaultValue: "customer",
      },
      name: { type: DataTypes.STRING, allowNull: false },
      surname: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      tableName: "users",
      timestamps: true,
      modelName: "User",
    }
  );
  return User;
}
export default User;
