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

    await this.UserModel.update(
      {
        name: userData.name,
        surname: userData.surname,
        phone: userData.phone,
      },
      { where: { id } },
    );

    if (userData.addresses && userData.addresses.length > 0) {
      const addressInfo = userData.addresses[0];

      const existingAddress = await Address.findOne({ where: { userId: id } });

      if (existingAddress) {
        await existingAddress.update({
          street: addressInfo.street,
          city: addressInfo.city,
          zipCode: addressInfo.zipCode,
          isShipping: true,
          isBilling: true,
        });
      } else {
        await Address.create({
          userId: id,
          street: addressInfo.street,
          city: addressInfo.city,
          zipCode: addressInfo.zipCode,
          isShipping: true,
          isBilling: true,
        });
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
