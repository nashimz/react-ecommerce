// src/routes/productRoutes.ts
import { Router } from "express";
import {
  getAllProducts,
  getProductById,
} from "../controllers/productController.js"; // Importamos el controlador

const router = Router();

// Define la ruta principal para obtener todos los productos
// La URL completa será: /api/products
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);

export default router;
