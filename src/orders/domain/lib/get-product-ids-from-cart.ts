import CartItem from "../cart-item";

export default function getProductIdsFromCart(cart: CartItem[]): number[] {
  function getUniqueIds() {
    return [...new Set([...cart.map(cartItem => cartItem.productId)])];
  }

  return getUniqueIds();
}
