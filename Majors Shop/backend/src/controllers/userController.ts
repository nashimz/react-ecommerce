import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../repositories/userRepository.js";
import type { AuthRequest } from "../middlewares/auth.ts";
export class UserController {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  // REGISTER NEW USER
  public async register(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required." });
      }
      const existingUser = await this.userRepository.findByEmail(email);

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      const registrationData = { email, password };
      const newUser = await this.userRepository.register(registrationData);
      const { password: _, ...userWithoutPassword } = newUser;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Error en el registro:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  // LOGIN USER
  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = jwt.sign(
        { id: Number(user.id), email: user.email, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      return res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 3600000,
        })
        .status(200)
        .json({
          user: { id: Number(user.id), email: user.email, role: user.role },
        });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async logout(req: Request, res: Response): Promise<Response> {
    try {
      return res
        .clearCookie("access_token", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .status(200)
        .json({
          message: "Sesión cerrada exitosamente.",
        });
    } catch (error) {
      console.error("Error during logout:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await this.userRepository.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const rawId = req.params.id;
      const userId = parseInt(rawId, 10);

      const user = await this.userRepository.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async getMe(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const rawUserId = req.userId;
      const userId = parseInt(rawUserId as any, 10);

      if (!userId || isNaN(Number(userId))) {
        console.error(
          "Authentication Error: userId is not a valid number.",
          userId
        );

        return res
          .status(401)
          .json({ message: "Invalid session or user ID missing." });
      }

      const user = await this.userRepository.getUserById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Error fetching authenticated user:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async updateUser(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = parseInt(req.params.id, 10);
      const { name, surname, phone } = req.body;
      const updatedUser = await this.userRepository.updatedUser(userId, {
        name,
        surname,
        phone,
      });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = updatedUser;
      return res
        .status(200)
        .json({ message: "Profile updated", user: userWithoutPassword });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
