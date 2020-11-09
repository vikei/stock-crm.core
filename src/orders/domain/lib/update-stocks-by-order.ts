import Order from "../order";
import becomeCanceled from "./become-canceled";
import Stock from "../../../stocks/domain/stock";
import {updateStocks} from "../../../stocks/domain/lib/update-stocks";

export default function updateStocksByOrder(
  order: Order,
  stocks: Stock[],
  oldOrder?: Order,
): Stock[] {
  if (!oldOrder) {
    return updateStocks(stocks, order.cart);
  }

  if (becomeCanceled(order.deliveryStatus, oldOrder.deliveryStatus)) {
    return updateStocks(stocks, [], oldOrder.cart);
  }

  return updateStocks(stocks, order.cart, oldOrder.cart);
}
