import Order from "../../../orders/domain/order";
import becomeCanceled from "../../../orders/domain/use-cases/become-canceled";
import Stock from "../stock";
import {updateStocks} from "./update-stocks";

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
