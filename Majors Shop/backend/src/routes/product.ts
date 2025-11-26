// src/routes/productRoutes.ts
import { Router } from "express";
import {
  getAllProducts,
  getProductById,
} from "../controllers/productController.js";

const router = Router();

router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);

export default router;
