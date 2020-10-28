import {OrderInventoryItem} from "./order.entity";
import StockEntity from "../stocks/stock.entity";
import {getRepository} from "typeorm/index";

export function getUniqueProductIdsFromInventory(inventory: OrderInventoryItem[]): number[] {
  return [
    // remove duplicated ids
    ...new Set([...inventory.map(inventory => inventory.productId)]),
  ];
}

export function findStockByProductId(
  stocks: StockEntity[],
  productId: number,
): StockEntity | undefined {
  return stocks.find(stock => stock.productId === productId);
}

export function findDeletedInventory(
  newInventory: OrderInventoryItem[],
  oldInventory: OrderInventoryItem[],
): OrderInventoryItem[] {
  return oldInventory.filter(
    oldInventoryItem =>
      newInventory.findIndex(
        newInventoryItem => newInventoryItem.productId === oldInventoryItem.productId,
      ) === -1,
  );
}

export function createStocksData(
  inventory: OrderInventoryItem[],
  stocks: StockEntity[],
  oldInventory: OrderInventoryItem[] = [],
): StockEntity[] {
  const stockRepository = getRepository<StockEntity>(StockEntity);
  return inventory.map(inventoryItem => {
    const stock = {...findStockByProductId(stocks, inventoryItem.productId)!};
    stock.count = stock.count - calculateCountDiff(inventoryItem, oldInventory);
    return stockRepository.create(stock);
  });
}

export function createDeletedInventoryStocksData(
  oldInventory: OrderInventoryItem[],
  newInventory: OrderInventoryItem[],
  stocks: StockEntity[],
): StockEntity[] {
  const stockRepository = getRepository<StockEntity>(StockEntity);
  return findDeletedInventory(newInventory, oldInventory).map(deletedInventoryItem => {
    const stock = {
      ...findStockByProductId(stocks, deletedInventoryItem.productId)!,
    };
    stock.count += deletedInventoryItem.count;
    return stockRepository.create(stock);
  });
}

export function calculateCountDiff(
  inventoryItem: OrderInventoryItem,
  oldInventory?: OrderInventoryItem[],
): number {
  let countDiff = inventoryItem.count;

  if (oldInventory?.length) {
    const prevInventoryItem = oldInventory.find(
      oldInventory => oldInventory.productId === inventoryItem.productId,
    ) ?? {count: 0};

    countDiff = countDiff - prevInventoryItem.count;
  }

  return countDiff;
}
