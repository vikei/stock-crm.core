import Order from "../../../orders/domain/order";
import becomeCanceled from "../../../orders/domain/use-cases/become-canceled";
import Stock from "../stock";
import {recalculateStocks} from "./recalculate-stocks";

export default function updateStocksByOrder(
  order: Order,
  stocks: Stock[],
  oldOrder?: Order,
): Stock[] {
  if (!oldOrder) {
    return recalculateStocks(stocks, order.cart);
  }

  if (becomeCanceled(order.deliveryStatus, oldOrder.deliveryStatus)) {
    const EMPTY_CART = [];
    return recalculateStocks(stocks, EMPTY_CART, oldOrder.cart);
  }

  return recalculateStocks(stocks, order.cart, oldOrder.cart);
}
