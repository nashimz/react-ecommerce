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

  public async processCheckout(req: Request, res: Response): Promise<Response> {
    const { userId, street, city, zipCode, phone } = req.body;

    if (!userId || !street || !city || !zipCode || !phone) {
      return res.status(400).json({
        message:
          "Missing checkout data: userId and full shipping address are required.",
      });
    }
    try {
      const order = await this.checkoutService.processCheckout({
        userId,
        street,
        city,
        zipCode,
        phone,
        shippingAddressId: req.body.shippingAddressId,
      });
      return res.status(201).json({
        message: "Order placed successfully!",
        orderId: order.orderId,
        order,
      });
    } catch (error) {
      console.error("Error during checkout:", error);
      if (error.message.includes("Insufficient stock")) {
        return res.status(409).json({ message: error.message });
      }
      return res.status(500).json({
        message: error.message || "Internal server error during checkout.",
      });
    }
  }
}
