import {OrderInventoryItem} from "./order.entity";

export function getUniqueProductIdsFromInventory(inventory: OrderInventoryItem[]): number[] {
  return [
    // remove duplicated ids
    ...new Set([...inventory.map(inventory => inventory.productId)]),
  ];
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
