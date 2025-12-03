import { CartController } from "../controllers/cartController.js";
import { Router } from "express";

export function createCartRouter(cartController: CartController): Router {
  const router = Router();
  router.get("/:userId", (req, res) =>
    cartController.getCartByUserId(req, res)
  );

  router.get("/", (req, res) => cartController.getAllCarts(req, res));
  return router;
}
