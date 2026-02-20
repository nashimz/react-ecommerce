import Address from "../models/Address.js";
import User from "../models/User.js";
import type { IUser } from "../types/user.d.ts";
import * as bcrypt from "bcryptjs";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  register(
    userData: Omit<IUser, "id" | "role" | "name" | "surname" | "phone">,
  ): Promise<IUser>;
  getAllUsers(): Promise<IUser[] | []>;
  getUserById(id: number): Promise<IUser | null>;
  updatedUser(id: number, userData: Partial<IUser>): Promise<IUser | null>;
}

export class UserRepository implements IUserRepository {
  private UserModel: typeof User;
  private readonly DEFAULT_ROLE = "customer";

  constructor(userModel: typeof User) {
    this.UserModel = userModel;
  }

  public async updatedUser(
    id: number,
    userData: Partial<IUser>,
  ): Promise<IUser | null> {
    const user = await this.UserModel.findByPk(id);
    if (!user) {
      return null;
    }
    const { addresses, ...restOfData } = userData;

    await user.update(restOfData);
    if (addresses && addresses.length > 0) {
      const addressInfo = addresses[0];

      // Sequelize tiene un método llamado upsert, pero con asociaciones
      // a veces es más claro buscar y actualizar/crear manualmente
      const [address, created] = await Address.findOrCreate({
        where: { userId: id },
        defaults: {
          ...addressInfo,
          userId: id,
          isShipping: true,
          isBilling: true,
        },
      });

      if (!created) {
        await address.update(addressInfo);
      }
    }

    return this.getUserById(id);
  }
  public async register(
    userData: Omit<IUser, "id" | "role" | "name" | "surname" | "phone">,
  ): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await this.UserModel.create({
      email: userData.email,
      password: hashedPassword,
      role: this.DEFAULT_ROLE,
    });
    return newUser.toJSON() as IUser;
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.UserModel.findOne({ where: { email } });
    return user ? (user.toJSON() as IUser) : null;
  }

  public async getAllUsers(): Promise<IUser[] | []> {
    const users = await this.UserModel.findAll();
    return users.map((user) => user.toJSON() as IUser);
  }

  public async getUserById(id: number): Promise<IUser | null> {
    const user = await this.UserModel.findByPk(id, {
      include: [
        {
          model: Address,
          as: "addresses",
        },
      ],
    });

    return user ? (user.toJSON() as IUser) : null;
  }
}

export default UserRepository;
