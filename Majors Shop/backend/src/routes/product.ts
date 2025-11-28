import { ProductController } from "../controllers/productController.js";
import { Router } from "express";

/**
 * Función que recibe el controlador ya instanciado y devuelve el router.
@param productController La instancia de ProductController.
 */
export function createProductRouter(
  productController: ProductController
): Router {
  const router = Router();

  router.get("/", (req, res) => productController.getAllProducts(req, res));
  router.get("/:id", (req, res) => productController.getProductById(req, res));

  return router;
}
