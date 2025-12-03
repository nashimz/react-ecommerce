import { CartController } from "../controllers/cartController.js";
import { Router } from "express";

export function createCartRouter(cartController: CartController): Router {
  const router = Router();
  router.get("/:userId", (req, res) =>
    cartController.getCartByUserId(req, res)
  );

  router.get("/", (req, res) => cartController.getAllCarts(req, res));

  router.post("/:userId/items", (req, res) =>
    cartController.addItemToCart(req, res)
  );

  router.put("/:userId/items/:itemId", (req, res) =>
    cartController.updateCartItemQuantity(req, res)
  );

  router.delete("/:userId/items/:itemId", (req, res) =>
    cartController.removeItemFromCart(req, res)
  );

  router.delete("/:userId/items", (req, res) =>
    cartController.clearCart(req, res)
  );
  return router;
}
