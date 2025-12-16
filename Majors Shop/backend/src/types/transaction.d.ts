export interface ITransaction {
  id: number;
  orderId: number;
  transactionReference: string;
  paymentMethod: string;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
