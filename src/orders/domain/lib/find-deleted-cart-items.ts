import CartItem from "../cart-item";

export default function findDeletedCartItems(newCart: CartItem[], oldCart: CartItem[]): CartItem[] {
  function isProductIdRemoved(productId: number) {
    return !newCartProductIds.includes(productId);
  }

  function isCartDeleted(cartItem: CartItem) {
    return deletedProductsIds.includes(cartItem.productId);
  }

  const newCartProductIds = newCart.map(item => item.productId);
  const oldCartProductIds = oldCart.map(item => item.productId);

  const deletedProductsIds = oldCartProductIds.filter(isProductIdRemoved);

  return oldCart.filter(isCartDeleted);
}
