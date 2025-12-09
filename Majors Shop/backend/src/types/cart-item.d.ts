export interface ICartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  product?: IProduct;
}
