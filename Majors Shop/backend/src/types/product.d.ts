// src/types/product.d.ts

export interface IProduct {
  id: number;
  brand: string;
  title: string;
  price: number;
  images: string[];
  description: string;
  discountPercentage: number;
  category: string;
  thumbnail: string;
  rating: number;
  stock: number;
  warranty: string;
  shippingInfo: string;
}
