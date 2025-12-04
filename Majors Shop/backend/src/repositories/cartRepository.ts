import Model from "sequelize";
import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";
import type { ICart } from "../types/cart.js";
import type { ICartItem } from "../types/cartItem.js";
import type { IProduct } from "../types/product.js";
import { Op } from "sequelize";

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

  async getCartByUserId(userId: number): Promise<ICart | null> {
    const cart = await this.CartModel.findOne({
      where: { userId },

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

    let item = await this.CartItemModel.findOne({
      where: { cartId: cart.id, productId: productId },
    });

    if (item) {
      const newQuantity = item.getDataValue("quantity") + quantity;
      await item.update({ quantity: newQuantity });
    } else {
      await this.CartItemModel.create({
        cartId: cart.id,
        productId: productId,
        quantity: quantity,
      });
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

  async clearCart(userId: number): Promise<ICart | null> {
    const cart = await this.CartModel.findOne({ where: { userId } });
    if (!cart) return null;

    await this.CartItemModel.destroy({ where: { cartId: cart.id } });
    return this.getCartByUserId(userId);
  }

  async updateItemQuantity(
    userId,
    itemId: number,
    quantity: number
  ): Promise<ICart | null> {
    const cart = await this.CartModel.findOne({ where: { userId } });
    if (!cart) return null;

    const item = await this.CartItemModel.findOne({
      where: { cartId: cart.id, id: itemId },
    });
    if (!item) return null;
    await item.update({ quantity });
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
