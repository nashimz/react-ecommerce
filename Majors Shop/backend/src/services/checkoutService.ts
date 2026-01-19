import { sequelize } from "../config/db.js";
import { MercadoPagoConfig, Preference } from "mercadopago";
import type { IOrder } from "../types/order.js";
import CartRepository from "../repositories/cartRepository.js";
import OrderRepository from "../repositories/orderRepository.js";
import ProductRepository from "../repositories/productRepository.js";
import OrderItem from "../models/Order-item.js";

interface CheckoutData {
  userId: number;
  shippingAddressId: number;
  paymentDetails: {
    method: string;
    token: string;
  };
}

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
});

export default class CheckoutService {
  private cartRepository: CartRepository;
  private productRepository: ProductRepository;
  private orderRepository: OrderRepository;

  constructor(
    cartRepository: CartRepository,
    productRepository: ProductRepository,
    orderRepository: OrderRepository
  ) {
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
    this.orderRepository = orderRepository;
  }
  public async processCheckout(
    data: CheckoutData
  ): Promise<{ orderId: number; initPoint: string }> {
    const t = await sequelize.transaction();

    try {
      const cart = await this.cartRepository.getCartByUserIdWithItems(
        data.userId,
        t
      );

      if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

      let totalAmount = 0;
      const itemsMP = cart.items.map((item) => {
        const unitPrice =
          item.product.discountedPrice || Number(item.product.price);
        totalAmount += unitPrice * item.quantity;

        // Formato para Mercado Pago
        return {
          id: item.productId.toString(),
          title: item.product.title,
          quantity: item.quantity,
          unit_price: unitPrice,
          currency_id: "ARS",
        };
      });

      const order = await this.orderRepository.createOrder(
        {
          userId: data.userId,
          shippingAddressId: data.shippingAddressId,
          totalAmount,
          orderDate: new Date(),
          status: "PENDING",
        },
        t
      );

      await Promise.all(
        cart.items.map((item) =>
          this.orderRepository.createOrderItem(
            {
              orderId: order.id,
              productId: item.productId,
              quantity: item.quantity,
              unitPrice:
                item.product.discountedPrice || Number(item.product.price),
            },
            t
          )
        )
      );

      const preference = new Preference(client);
      const mpResponse = await preference.create({
        body: {
          items: itemsMP,
          external_reference: order.id.toString(), // <--- IMPORTANTE: Vincula MP con tu DB
          back_urls: {
            success: `${process.env.FRONTEND_URL}/payment-success`,
            failure: `${process.env.FRONTEND_URL}/cart`,
          },
          auto_return: "approved",
          notification_url: `${process.env.BACKEND_URL}/api/payments/webhook`,
        },
      });

      await t.commit();
      return { orderId: order.id, initPoint: mpResponse.init_point! };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  public async confirmPayment(
    orderId: number,
    transactionId: string,
    method: string
  ) {
    const t = await sequelize.transaction();

    try {
      const order = await this.orderRepository.getOrderById(orderId);
      if (!order || order.status === "PAID" || order.status === "COMPLETED")
        return;

      for (const item of await OrderItem.findAll({ where: { orderId } })) {
        const product = await this.productRepository.findById(
          item.productId.toString()
        );
        if (product) {
          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for product ID ${product.id}`);
          }
          await this.productRepository.updateStock(
            product.id,
            product.stock - item.quantity,
            t
          );
        }

        const cart = await this.cartRepository.getCartByUserId(order.userId, t);
        await this.cartRepository.clearCartItems(cart.id, t);
        await this.orderRepository.updateOrderStatus(orderId, "PAID", t);
        await this.orderRepository.createTransaction(
          {
            orderId,
            transactionReference: transactionId,
            paymentMethod: method,
            amount: order.totalAmount,
            status: "COMPLETED",
          },
          t
        );

        await t.commit();
      }
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}
