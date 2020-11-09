import CartItem from "../../../orders/domain/cart-item";
import Stock from "../stock";

export default function updateStockByCartItem({...stock}: Stock, cartItem: CartItem): Stock {
  stock.count = stock.count - cartItem.count;
  return stock;
}
