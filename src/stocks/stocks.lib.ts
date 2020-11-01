import StockEntity from "./stock.entity";
import {OrderInventoryItem} from "../orders/order.entity";
import {calculateCountDiff, findDeletedInventory} from "../orders/inventory.lib";

export function findStockByProductId(
  stocks: StockEntity[],
  productId: number,
): StockEntity | undefined {
  return stocks.find(stock => stock.productId === productId);
}

export function createStocksData(
  inventory: OrderInventoryItem[],
  stocks: StockEntity[],
  oldInventory: OrderInventoryItem[] = [],
): StockEntity[] {
  // TODO: handle if product was deleted
  return inventory.map(inventoryItem => {
    const stock = {...findStockByProductId(stocks, inventoryItem.productId)!};
    stock.count = stock.count - calculateCountDiff(inventoryItem, oldInventory);
    return stock;
  });
}

export function createDeletedInventoryStocksData(
  oldInventory: OrderInventoryItem[],
  newInventory: OrderInventoryItem[],
  stocks: StockEntity[],
): StockEntity[] {
  return findDeletedInventory(newInventory, oldInventory).map(deletedInventoryItem => {
    const stock = {
      ...findStockByProductId(stocks, deletedInventoryItem.productId)!,
    };
    stock.count += deletedInventoryItem.count;
    return stock;
  });
}
