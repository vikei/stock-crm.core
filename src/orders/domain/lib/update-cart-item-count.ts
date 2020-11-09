import CartItem from "../cart-item";

export default function updateCartItemCount(
  newCartItem: CartItem,
  oldCartItem: CartItem,
): CartItem {
  return {
    ...newCartItem,
    count: newCartItem.count - oldCartItem.count,
  };
}
