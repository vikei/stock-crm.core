import CartItem from "../cart-item";

export default function findDeletedCartItems(newCart: CartItem[], oldCart: CartItem[]): CartItem[] {
  const newCartByProductId = newCart.map(item => item.productId);
  const oldCartByProductId = oldCart.map(item => item.productId);
  const deletedCartIds = oldCartByProductId.filter(
    oldItemProductId => !newCartByProductId.includes(oldItemProductId),
  );

  return oldCart.filter(({productId}) => deletedCartIds.includes(productId));
}
