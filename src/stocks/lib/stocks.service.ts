import {Service} from "typedi";
import StockEntity from "../storage/stock.entity";
import getProductIdsByCart from "../../orders/domain/lib/get-product-ids-by-cart";
import StocksStorage from "../storage/stock.storage";
import OrderEntity from "../../orders/storage/order.entity";
import updateStocksByOrder from "../../orders/domain/lib/update-stocks-by-order";

@Service()
export default class StocksService {
  constructor(public stocksStorage: StocksStorage) {}

  async update(order: OrderEntity, oldOrder?: OrderEntity): Promise<StockEntity[]> {
    const stocks = await this.stocksStorage.find({
      productIds: getProductIdsByCart([...order.cart, ...(oldOrder?.cart ?? [])]),
    });

    return this.stocksStorage.saveMany(updateStocksByOrder(order, stocks, oldOrder));
  }
}
