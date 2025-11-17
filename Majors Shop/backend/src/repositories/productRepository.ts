// src/repositories/productRepository.ts
import Product from "../models/Product.js";
import type { IProduct } from "../types/product.d.js";
type ProductCreationPayload = Omit<IProduct, "images"> & {
  images: string;
};
class ProductRepository {
  async findAll(): Promise<IProduct[]> {
    const products = await Product.findAll();
    return products.map((p) => p.toJSON()) as IProduct[];
  }

  async findById(id: string): Promise<IProduct | null> {
    const product = await Product.findByPk(id);
    return product ? (product.toJSON() as IProduct) : null;
  }

  async count(): Promise<number> {
    return Product.count();
  }

  async createBulk(products: IProduct[]): Promise<Product[]> {
    // 1. Mapear y transformar los datos al tipo de payload
    const productsToInsert: ProductCreationPayload[] = products.map((p) => ({
      ...p,
      // Convertimos el array de strings (IProduct) a un string JSON (Payload)
      images: JSON.stringify(p.images),
    }));

    // 2. Usar el tipo correcto al llamar a bulkCreate
    // Sequelize maneja la asignación de tipos con ProductCreationPayload
    return Product.bulkCreate(productsToInsert as any); // Usamos 'as any' para forzar, si el nuevo tipo no es suficiente
  }
}

export default new ProductRepository(); // Exportación por defecto
