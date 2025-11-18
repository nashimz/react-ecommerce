// src/utils/fetchApi.ts
import type { IProduct } from "../types/product.d.js"; // Usar .js en la ruta de importación de tipos en TS/ESM

export async function fetchProducts(): Promise<IProduct[]> {
  // ... (código similar al anterior, usando fetch nativo)
  try {
    const response = await fetch("https://dummyjson.com/products?limit=200");
    if (!response.ok) throw new Error("Failed to fetch products");

    const data = (await response.json()) as { products: any[] };

    return data.products.map((product) => ({
      // ... (mapeo de datos)
      id: product.id,
      brand: product.brand,
      title: product.title,
      price: product.price,
      images: product.images,
      description: product.description,
      discountPercentage: product.discountPercentage,
      category: product.category,
      thumbnail: product.thumbnail,
      rating: product.rating,
      stock: product.stock,
      warranty: product.warrantyInformation,
      shippingInfo: product.shippingInformation,
    }));
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error fetching products";
    throw new Error(errorMessage);
  }
}
