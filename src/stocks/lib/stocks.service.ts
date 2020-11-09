import {Service} from "typedi";
import StockEntity from "../storage/stock.entity";
import CartItemColumn from "../../orders/storage/cart-item-column";
import getProductIdsFromCart from "../../orders/domain/lib/get-product-ids-from-cart";
import StocksStorage from "../storage/stock.storage";
import {updateStocksByCart} from "../domain/lib/update-stocks";

@Service()
export default class StocksService {
  constructor(public stocksStorage: StocksStorage) {}

  async update(cart: CartItemColumn[], oldCart?: CartItemColumn[]): Promise<StockEntity[]> {
    const stocks = await this.stocksStorage.find({
      productIds: getProductIdsFromCart([...cart, ...(oldCart ?? [])]),
    });

    return this.stocksStorage.saveMany(updateStocksByCart(stocks, cart, oldCart));
  }

  async revert(cart: CartItemColumn[]): Promise<StockEntity[]> {
    return this.update([], cart);
  }
}
