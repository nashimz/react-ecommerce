// src/repositories/productRepository.ts (MODIFICADO)
import { Model } from "sequelize"; // Importamos Model para el tipado
import Product from "../models/Product.js";
import type { IProduct } from "../types/product.d.js";

type ProductCreationPayload = Omit<IProduct, "images"> & {
  images: string;
};

// 🚨 CAMBIO A: Clase estándar que recibe el modelo en el constructor
export default class ProductRepository {
  // 1. Definimos una propiedad privada para guardar el modelo
  private ProductModel: typeof Product;

  // 2. El constructor recibe el modelo YA INICIALIZADO de Sequelize
  constructor(productModel: typeof Product) {
    this.ProductModel = productModel;
  }

  async findAll(): Promise<IProduct[]> {
    // Usamos la propiedad privada
    const products = await this.ProductModel.findAll();
    return products.map((p) => p.toJSON()) as IProduct[];
  }

  async findById(id: string): Promise<IProduct | null> {
    // Usamos la propiedad privada
    const product = await this.ProductModel.findByPk(id);

    return product ? (product.toJSON() as IProduct) : null;
  }

  async count(): Promise<number> {
    // Usamos la propiedad privada
    return this.ProductModel.count();
  }

  async createBulk(products: IProduct[]): Promise<Model[]> {
    const productsToInsert: ProductCreationPayload[] = products.map((p) => ({
      ...p,
      images: JSON.stringify(p.images),
    }));

    // Usamos la propiedad privada
    return this.ProductModel.bulkCreate(productsToInsert as any);
  }
}
