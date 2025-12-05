export interface ITransaction {
  id: number;
  orderId: number;
  transactionReference: number;
  paymentMethod: string;
  amount: number;
  status: string;
}
