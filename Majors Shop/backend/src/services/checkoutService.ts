import { sequelize } from "../config/db.js";
import { MercadoPagoConfig, Preference } from "mercadopago";
import type { IOrder } from "../types/order.js";
import CartRepository from "../repositories/cartRepository.js";
import OrderRepository from "../repositories/orderRepository.js";
import ProductRepository from "../repositories/productRepository.js";
import OrderItem from "../models/Order-item.js";
import AddressRepository from "../repositories/adressRepository.js";

interface CheckoutData {
  userId: number;
  street: string;
  city: string;
  zipCode: string;
  phone: string;

  paymentDetails?: {
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
  private addressRepository: AddressRepository;

  constructor(
    cartRepository: CartRepository,
    productRepository: ProductRepository,
    orderRepository: OrderRepository,
    addressRepository: AddressRepository,
  ) {
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
    this.orderRepository = orderRepository;
    this.addressRepository = addressRepository;
  }
  public async processCheckout(
    data: CheckoutData,
  ): Promise<{ orderId: number; initPoint: string }> {
    const t = await sequelize.transaction();

    try {
      const newAddress = await this.addressRepository.createAddress(
        {
          userId: data.userId,
          street: data.street,
          city: data.city,
          zipCode: data.zipCode,
          phone: data.phone,
          isShipping: true,
          isBilling: false,
        },
        t,
      );
      const cart = await this.cartRepository.getCartByUserIdWithItems(
        data.userId,
        t,
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
          shippingAddressId: newAddress.id,
          totalAmount,
          orderDate: new Date(),
          status: "PENDING",
        },
        t,
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
            t,
          ),
        ),
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
    method: string,
  ) {
    const t = await sequelize.transaction();

    try {
      // 1. Validar la orden
      const order = await this.orderRepository.getOrderById(orderId);
      if (!order || order.status === "PAID" || order.status === "COMPLETED") {
        await t.rollback();
        return;
      }

      // 2. Obtener los items de la orden
      const items = await OrderItem.findAll({
        where: { orderId },
        transaction: t,
      });

      // 3. Actualizar Stock de cada producto
      for (const item of items) {
        const product = await this.productRepository.findById(
          item.productId.toString(),
        );

        if (product) {
          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for product: ${product.title}`);
          }

          await this.productRepository.updateStock(
            product.id,
            product.stock - item.quantity,
            t,
          );
        }
      }

      // 4. Limpiar el carrito del usuario
      const cart = await this.cartRepository.getCartByUserId(order.userId, t);
      if (cart) {
        await this.cartRepository.clearCartItems(cart.id, t);
      }

      // 5. Actualizar estado de la orden y crear registro de transacción
      await this.orderRepository.updateOrderStatus(orderId, "PAID", t);
      await this.orderRepository.createTransaction(
        {
          orderId,
          transactionReference: transactionId,
          paymentMethod: method,
          amount: order.totalAmount,
          status: "COMPLETED",
        },
        t,
      );

      // 6. FINALIZAR: Un solo commit para toda la operación
      await t.commit();
    } catch (error) {
      await t.rollback();
      console.error("Payment Confirmation Error:", error);
      throw error;
    }
  }
}
