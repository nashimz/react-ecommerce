export interface IOrder {
  id: number;
  userId: number;
  orderDate: Date;
  status: string;
  totalAmount: number;
  shippingAddressId: number;
  createdAt: Date;
  updatedAt: Date;
}
