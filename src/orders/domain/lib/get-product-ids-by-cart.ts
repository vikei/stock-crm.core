import CartItem from "../cart-item";

export default function getProductIdsByCart(cart: CartItem[]): number[] {
  function getUniqueIds() {
    return [...new Set([...cart.map(cartItem => cartItem.productId)])];
  }

  return getUniqueIds();
}
