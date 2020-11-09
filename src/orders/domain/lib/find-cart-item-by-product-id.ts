import CartItem from "../cart-item";

export default function findCartItemByProductId(
  productId: number,
  cart: CartItem[],
): CartItem | undefined {
  return cart.find(cartItem => cartItem.productId === productId);
}
