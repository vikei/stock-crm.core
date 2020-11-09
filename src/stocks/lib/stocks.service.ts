import {Service} from "typedi";
import StockEntity from "../storage/stock.entity";
import CartItemColumn from "../../orders/storage/cart-item-column";
import getProductIdsFromCart from "../../orders/domain/lib/get-product-ids-from-cart";
import StocksStorage from "../storage/stock.storage";
import updateStockByCartItem from "../domain/lib/update-stock-by-cart-item";
import findStockByProductId from "../domain/lib/find-stock-by-product-id";
import findCartItemByProductId from "../../orders/domain/lib/find-cart-item-by-product-id";
import updateCartItem from "../../orders/domain/lib/update-cart-item";
import findDeletedCartItems from "../../orders/domain/lib/find-deleted-cart-items";

@Service()
export default class StocksService {
  constructor(public stocksStorage: StocksStorage) {}

  async updateByCart(cart: CartItemColumn[], oldCart?: CartItemColumn[]): Promise<StockEntity[]> {
    const stocks = await this.stocksStorage.find({
      productIds: getProductIdsFromCart([...cart, ...(oldCart ?? [])]),
    });

    // TODO: make helper: updateStocks
    let stocksData = cart.map(cartItem => {
      const stock = findStockByProductId(stocks, cartItem.productId)!;
      let newCartItem = cartItem;
      if (oldCart) {
        const oldCartItem = findCartItemByProductId(cartItem.productId, oldCart)!;
        newCartItem = updateCartItem(newCartItem, oldCartItem);
      }
      return updateStockByCartItem(stock, newCartItem);
    });

    // TODO: make helper: revertStocks
    if (oldCart) {
      const deleteCartItems = findDeletedCartItems(cart, oldCart);
      stocksData = [
        ...stocksData,
        ...deleteCartItems.map(deletedCartItem => {
          const deletedItemStock = findStockByProductId(stocks, deletedCartItem.productId)!;
          return updateStockByCartItem(
            deletedItemStock,
            updateCartItem({count: 0, productId: deletedCartItem.productId}, deletedCartItem),
          );
        }),
      ];
    }

    return this.stocksStorage.saveMany(stocksData);
  }
}
