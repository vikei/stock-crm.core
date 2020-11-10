import Stock from "../stock";
import CartItem from "../../../orders/domain/cart-item";

export default function recalculateStock(stock: Stock, cartItem: CartItem): Stock {
  return {
    ...stock,
    count: stock.count - cartItem.count,
  };
}
