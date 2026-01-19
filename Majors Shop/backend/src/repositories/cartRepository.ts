import Cart from "../models/Cart.js";
import CartItem from "../models/Cart-item.js";
import Product from "../models/Product.js";
import type { ICart } from "../types/cart.js";

import { Op, Transaction } from "sequelize";

export default class CartRepository {
  private CartModel: typeof Cart;
  private CartItemModel: typeof CartItem;
  private ProductModel: typeof Product;

  constructor(
    cartModel: typeof Cart,
    cartItemModel: typeof CartItem,
    productModel: typeof Product
  ) {
    this.CartModel = cartModel;
    this.CartItemModel = cartItemModel;
    this.ProductModel = productModel;
  }

  async getCartByUserId(
    userId: number,
    transaction?: Transaction
  ): Promise<ICart | null> {
    const cart = await this.CartModel.findOne({
      where: { userId },
      include: [
        {
          model: this.CartItemModel,
          as: "items",
          include: [{ model: this.ProductModel, as: "product" }],
        },
      ],

      order: [[{ model: this.CartItemModel, as: "items" }, "id", "ASC"]],
    });

    return cart ? (cart.toJSON() as ICart) : null;
  }

  async getCartByUserIdWithItems(
    userId: number,
    transaction?: any
  ): Promise<ICart | null> {
    const cart = await this.CartModel.findOne({
      where: { userId, status: "ACTIVE" },
      include: [
        {
          model: this.CartItemModel,
          as: "items",
          include: [
            {
              model: this.ProductModel,
              as: "product",
            },
          ],
        },
      ],
      transaction: transaction,
    });
    return cart ? (cart.toJSON() as ICart) : null;
  }

  async getAllCarts(): Promise<ICart[]> {
    const carts = await this.CartModel.findAll({
      include: [{ model: this.CartItemModel, as: "items" }],
    });
    return carts.map((cart) => cart.toJSON() as ICart);
  }

  private async getOrCreateCart(userId: number): Promise<Cart> {
    const [cart] = await this.CartModel.findOrCreate({
      where: { userId },
      defaults: { userId, status: "ACTIVE" },
    });
    return cart;
  }

  async addItemToCart(
    userId: number,
    productId: number,
    quantity: number
  ): Promise<ICart | null> {
    const cart = await this.getOrCreateCart(userId);

    const [item, created] = await this.CartItemModel.findOrCreate({
      where: { cartId: cart.id, productId },
      defaults: { cartId: cart.id, productId, quantity },
    });

    if (!created) {
      await item.update({ quantity: item.quantity + quantity });
    }

    return this.getCartByUserId(userId);
  }

  async removeItemFromCart(
    userId: number,
    itemId: number
  ): Promise<ICart | null> {
    const cart = await this.CartModel.findOne({ where: { userId } });
    if (!cart) return null;

    await this.CartItemModel.destroy({
      where: { cartId: cart.id, id: itemId },
    });
    return this.getCartByUserId(userId);
  }

  async clearCartItems(
    cartId: number,
    transaction?: Transaction
  ): Promise<number> {
    return this.CartItemModel.destroy({
      where: { cartId: cartId },
      transaction: transaction,
    });
  }
  async updateItemQuantity(
    userId: number,
    itemId: number,
    quantity: number
  ): Promise<ICart | null> {
    const cart = await this.CartModel.findOne({ where: { userId } });
    if (!cart) return null;

    const [affectedCount] = await this.CartItemModel.update(
      { quantity },
      { where: { id: itemId, cartId: cart.id } }
    );

    if (affectedCount === 0) return null;

    return this.getCartByUserId(userId);
  }

  async deleteExpiredCarts(thresholdDate: Date): Promise<number> {
    return Cart.destroy({
      where: {
        status: "ACTIVE",
        updatedAt: {
          [Op.lt]: thresholdDate,
        },
      },
    });
  }
}
