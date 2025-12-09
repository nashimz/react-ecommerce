import type { Request, Response } from "express";
import CartRepository from "../repositories/cartRepository";

export class CartController {
  private cartRepository: CartRepository;

  constructor(cartRepository: CartRepository) {
    this.cartRepository = cartRepository;
  }

  public async getCartByUserId(req: Request, res: Response): Promise<Response> {
    try {
      const userId = parseInt(req.params.userId, 10);
      const cart = await this.cartRepository.getCartByUserId(userId);
      console.log("Cart retrieved:", cart);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      return res.json(cart);
    } catch (error) {
      return res.status(500).json({ message: "Internal server errorr" });
    }
  }

  public async getCartByUserIdWithItems(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const userId = parseInt(req.params.userId, 10);
      const cart = await this.cartRepository.getCartByUserIdWithItems(userId);
      console.log("Cart with items retrieved:", cart);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      return res.status(200).json(cart);
    } catch (error) {
      console.error("Error retrieving cart with items:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public async getAllCarts(req: Request, res: Response): Promise<Response> {
    try {
      const carts = await this.cartRepository.getAllCarts();
      if (carts.length === 0) {
        return res.status(404).json({ message: "No carts found" });
      }
      return res.json(carts);
    } catch (error) {
      console.error("Error al obtener todos los carritos:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public async addItemToCart(req: Request, res: Response): Promise<Response> {
    try {
      const userId = parseInt(req.params.userId, 10);
      const { productId, quantity } = req.body;

      if (!productId || typeof quantity !== "number" || quantity < 1) {
        return res.status(400).json({
          message: "Missing or invalid product data (productId, quantity)",
        });
      }
      const updatedCart = await this.cartRepository.addItemToCart(
        userId,
        productId,
        quantity
      );
      if (!updatedCart) {
        return res.status(404).json({ message: "User or cart not found" });
      }
      return res.status(200).json(updatedCart);
    } catch (error) {
      console.error("Error al añadir CartItem:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public async updateCartItemQuantity(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const userId = parseInt(req.params.userId, 10);
      const itemId = parseInt(req.params.itemId, 10);
      const { quantity } = req.body;
      if (typeof quantity !== "number" || quantity < 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      const updatedCart = await this.cartRepository.updateItemQuantity(
        userId,
        itemId,
        quantity
      );
      if (!updatedCart) {
        return res
          .status(404)
          .json({ message: "User, cart or item not found" });
      }
      return res.status(200).json(updatedCart);
    } catch (error) {
      console.error("Error al actualizar la cantidad del CartItem:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public async removeItemFromCart(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const userId = parseInt(req.params.userId, 10);

      const itemId = parseInt(req.params.itemId, 10);

      const updatedCart = await this.cartRepository.removeItemFromCart(
        userId,
        itemId
      );

      if (!updatedCart) {
        return res.status(404).json({ message: "Cart or CartItem not found" });
      }

      return res.status(200).json(updatedCart);
    } catch (error) {
      console.error("Error al eliminar CartItem:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public async clearCart(req: Request, res: Response): Promise<Response> {
    try {
      const userId = parseInt(req.params.userId, 10);
      const updatedCart = await this.cartRepository.clearCartItems(userId);
      if (!updatedCart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      return res.status(200).json(updatedCart);
    } catch (error) {
      console.error("Error al limpiar el carrito:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
