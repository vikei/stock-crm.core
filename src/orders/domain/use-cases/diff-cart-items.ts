import CartItem from "../cart-item";

export default function diffCartItems(newCartItem: CartItem, oldCartItem: CartItem): CartItem {
  return {
    ...newCartItem,
    count: newCartItem.count - oldCartItem.count,
  };
}
