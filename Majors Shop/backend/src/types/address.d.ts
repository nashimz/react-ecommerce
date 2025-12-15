export interface IAddress {
  id: number;
  userId: number;
  street: string;
  city: string;
  zipCode: string;
  country: string;
  isShipping: boolean;
  isBilling: boolean;
  createdAt: Date;
  updatedAt: Date;
}
