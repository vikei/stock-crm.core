import CartItem from "../cart-item";

export default function getProductIdsFromCart(cart: CartItem[]): number[] {
  // remove duplicated ids
  const productIdsSet = new Set([...cart.map(cartItem => cartItem.productId)]);
  return [...productIdsSet];
}
