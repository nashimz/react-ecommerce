import type { Request, Response } from "express";
import ProductRepository from "../repositories/productRepository.js";

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await ProductRepository.findAll();

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor al obtener productos." });
  }
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productId = req.params.id;
    const product = await ProductRepository.findById(productId);

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
