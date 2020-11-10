export default class CartItem {
  productId: number;
  count: number;

  constructor({productId, count}: {productId: number; count: number}) {
    this.productId = productId;
    this.count = count;
  }
}
