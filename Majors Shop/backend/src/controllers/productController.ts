// src/controllers/productController.ts (MODIFICADO)

import type { Request, Response } from "express";
import ProductRepository from "../repositories/productRepository.js"; // Importa la CLASE

// 🚨 Paso 1: Definir la CLASE del Controlador
export class ProductController {
  // Propiedad para guardar la instancia del repositorio
  private productRepository: ProductRepository;

  // Constructor que recibe la instancia del repositorio
  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  // Método para obtener todos los productos (usando arrow function para mantener 'this')
  public getAllProducts = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      // 🚨 Uso de la instancia
      const products = await this.productRepository.findAll();

      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({
        message: "Error interno del servidor al obtener productos.",
      });
    }
  };

  // Método para obtener un producto por ID
  public getProductById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const productId = req.params.id;
      // 🚨 Uso de la instancia
      const product = await this.productRepository.findById(productId);

      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: "Producto no encontrado." });
      }
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      res.status(500).json({
        message: "Error interno del servidor al obtener el producto.",
      });
    }
  };
}
