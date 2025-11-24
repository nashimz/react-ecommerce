import User from "../models/User.ts";
import type { IUser } from "../types/user.d.ts";
import * as bcrypt from "bcryptjs";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  register(userData: Omit<IUser, "id" | "role">): Promise<IUser>;
  getAllUsers(): Promise<IUser[] | []>;
  getUserById(id: number): Promise<IUser | null>;
}

export class UserRepository implements IUserRepository {
  private UserModel: typeof User;
  private readonly DEFAULT_ROLE = "customer";

  constructor(userModel: typeof User) {
    this.UserModel = userModel;
  }

  public async register(userData: Omit<IUser, "id" | "role">): Promise<IUser> {
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
    const user = await this.UserModel.findByPk(id);
    return user ? (user.toJSON() as IUser) : null;
  }
}

export default UserRepository;
