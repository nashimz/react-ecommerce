import type { IOrder } from "../types/order.js";
import Order from "../models/Order.js";
import { Op } from "sequelize";

export default class OrderRepository {
  private OrderModel: typeof Order;

  constructor(orderModel: typeof Order) {
    this.OrderModel = orderModel;
  }

  async getOrderById(orderId: number): Promise<IOrder | null> {
    const order = await this.OrderModel.findOne({
      where: { id: orderId },
    });
    return order ? (order.toJSON() as IOrder) : null;
  }
}
