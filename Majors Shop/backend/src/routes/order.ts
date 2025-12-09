import { OrderController } from "../controllers/orderController";
import { Router } from "express";

export function createOrderRouter(orderController: OrderController): Router {
  const router = Router();

  router.get("/:orderId", (req, res) => orderController.getOrderbyId(req, res));
  return router;
}
