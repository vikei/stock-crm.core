import CartItem from "../cart-item";

export default function findDeletedCartItems(newCart: CartItem[], oldCart: CartItem[]): CartItem[] {
  function isProductIdRemoved(productId: number) {
    return !newCartByProductId.includes(productId);
  }

  const newCartByProductId = newCart.map(item => item.productId);
  const oldCartByProductId = oldCart.map(item => item.productId);

  const deletedCartIds = oldCartByProductId.filter(isProductIdRemoved);

  return oldCart.filter(({productId}) => deletedCartIds.includes(productId));
}
