import type { Request, Response } from "express";
import CheckoutService from "../services/checkoutService";
import OrderRepository from "../repositories/orderRepository";
import type { IOrder } from "../types/order.js";

export class OrderController {
  private orderRepository: OrderRepository;
  private checkoutService: CheckoutService;
  constructor(
    orderRepository: OrderRepository,
    checkoutService: CheckoutService,
  ) {
    this.orderRepository = orderRepository;
    this.checkoutService = checkoutService;
  }
  public async getAllOrders(req: Request, res: Response): Promise<Response> {
    try {
      const orders: IOrder[] = await this.orderRepository.getAllOrders();
      return res.json(orders);
    } catch (error) {
      console.error("Error retrieving orders:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  public async getOrderbyId(req: Request, res: Response): Promise<Response> {
    try {
      const orderId = parseInt(req.params.orderId, 10);
      const order: IOrder | null =
        await this.orderRepository.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      return res.json(order);
    } catch (error) {
      console.error("Error retrieving order:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
