import { sequelize } from "../config/db.js";
import Cart from "../models/Cart.js";
import CartItem from "../models/Cart-item.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import OrderItem from "../models/Order-item.js";
import Transaction from "../models/Transaction.js";
import type { IOrder } from "../types/order.js";
import CartRepository from "../repositories/cartRepository.js";
import OrderRepository from "../repositories/orderRepository.js";
import ProductRepository from "../repositories/productRepository.js";

interface CheckoutData {
  userId: number;
  shippingAddressId: number;
  paymentDetails: {
    method: string;
    token: string;
  };
}

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
  public async processCheckout(data: CheckoutData): Promise<IOrder> {
    const t = await sequelize.transaction();

    try {
      // --------------------------------------------------------
      // 1. OBTENER Y VALIDAR EL CARRITO
      // --------------------------------------------------------
      const cart = await Cart.findOne({
        where: { userId: data.userId, status: "ACTIVE" },
        include: [
          {
            model: CartItem,
            as: "items",
            include: [{ model: Product, as: "product" }],
          },
        ],
        transaction: t,
      });

      if (!cart) {
        throw new Error("Cart not found for user.");
      }

      if (!cart.items || cart.items.length === 0) {
        throw new Error("Cart is empty or invalid.");
      }

      let totalAmount = 0;
      for (const item of cart.items) {
        const product = item.product;
        // Validación de stock
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.title}`);
        }
        totalAmount += Number(product.price) * item.quantity;
      }

      // --------------------------------------------------------
      // 2. PROCESAR PAGO (Simulación)
      // --------------------------------------------------------

      // 🚨 Aquí iría la llamada a Stripe/PayPal
      // const paymentResult = await PaymentGateway.charge(totalAmount, data.paymentDetails.token);
      // if (!paymentResult.success) { throw new Error('Payment failed'); }

      // --------------------------------------------------------
      // 3. CREAR ORDEN (Order)
      // --------------------------------------------------------
      const order = await Order.create(
        {
          userId: data.userId,
          shippingAddressId: data.shippingAddressId,
          totalAmount,
          orderDate: new Date(),
          status: "PAID",
        },
        { transaction: t }
      );

      // --------------------------------------------------------
      // 4. CREAR ITEMS DE ORDEN (OrderItem) y ACTUALIZAR STOCK
      // --------------------------------------------------------
      const itemPromises = cart.items.map(async (item) => {
        // Congelar precio y crear OrderItem
        await OrderItem.create(
          {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.product.price,
          },
          { transaction: t }
        );

        // Actualizar Stock del Producto
        await Product.update(
          { stock: item.product.stock - item.quantity },
          { where: { id: item.productId }, transaction: t }
        );
      });

      // --------------------------------------------------------
      // 5. CREAR TRANSACCIÓN (Transaction) y LIMPIAR CARRITO
      // --------------------------------------------------------
      await Transaction.create(
        {
          orderId: order.id,
          transactionReference: "TXN-" + Date.now(), // ID de transacción simulada
          paymentMethod: data.paymentDetails.method,
          amount: totalAmount,
          status: "COMPLETED",
        },
        { transaction: t }
      );

      // Limpiar Carrito
      await CartItem.destroy({
        where: { cartId: cart.id },
        transaction: t,
      });

      await t.commit(); // 🚨 Confirmar todos los cambios

      return order; // Devolver la orden creada
    } catch (error) {
      await t.rollback(); // 🚨 Revertir si algo falla
      // Relanzar el error para que el controlador lo maneje
      throw error;
    }
  }
}
