import type { IOrder } from "../types/order.js";
import Order from "../models/Order.js";
import Transaction from "../models/Transaction.js";
import OrderItem from "../models/Order-item.js";

export default class OrderRepository {
  private OrderModel: typeof Order;
  private OrderItemModel: typeof OrderItem;
  private TransactionModel: typeof Transaction;

  constructor(
    orderModel: typeof Order,
    orderItemModel: typeof OrderItem,
    transactionModel: typeof Transaction
  ) {
    this.OrderModel = orderModel;
    this.OrderItemModel = orderItemModel;
    this.TransactionModel = transactionModel;
  }
  async getAllOrders(): Promise<IOrder[]> {
    const orders = await this.OrderModel.findAll();
    return orders.map((order) => order.toJSON() as IOrder);
  }
  async getOrderById(orderId: number): Promise<IOrder | null> {
    const order = await this.OrderModel.findOne({
      where: { id: orderId },
    });
    return order ? (order.toJSON() as IOrder) : null;
  }

  async createOrder(data: any, transaction?: any): Promise<any> {
    return this.OrderModel.create(data, { transaction: transaction });
  }

  async createOrderItem(data: any, transaction?: any): Promise<any> {
    return this.OrderItemModel.create(data, { transaction: transaction });
  }

  async createTransaction(data: any, transaction?: any): Promise<any> {
    // 🚨 Usar el Modelo Transaction importado
    return this.TransactionModel.create(data, { transaction: transaction });
  }
}
