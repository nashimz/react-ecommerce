import { OrderController } from "../controllers/orderController";
import { Router } from "express";

export function createOrderRouter(orderController: OrderController): Router {
  const router = Router();
  router.get("/", (req, res) => orderController.getAllOrders(req, res));
  router.get("/:orderId", (req, res) => orderController.getOrderbyId(req, res));
  router.post("/", (req, res) => orderController.processCheckout(req, res));
  return router;
}
