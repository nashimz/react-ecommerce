import { ICartItem } from "./cart-item";

export interface ICart {
  id: number;
  userId: number;
  status: "ACTIVE" | "COMPLETED" | "CANCELED";
  createdAt: Date;
  updatedAt: Date;
  items: ICartItem[];
}
