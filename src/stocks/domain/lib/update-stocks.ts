import CartItem from "../../../orders/domain/cart-item";
import Stock from "../stock";
import updateCartItemCount from "../../../orders/domain/lib/update-cart-item-count";
import findDeletedCartItems from "../../../orders/domain/lib/find-deleted-cart-items";

export function updateStockCountByCartItem({...stock}: Stock, cartItem: CartItem): Stock {
  stock.count = stock.count - cartItem.count;
  return stock;
}

export function updateStocksByCart(
  stocks: Stock[],
  cart: CartItem[],
  oldCart?: CartItem[],
): Stock[] {
  function findCartItemByProductId(productId: number, cart: CartItem[]): CartItem | undefined {
    return cart.find(cartItem => cartItem.productId === productId);
  }

  function findStockByProductId(stocks: Stock[], productId: number): Stock | undefined {
    return stocks.find(stock => stock.productId === productId);
  }

  function revertStock(deletedCartItem: CartItem): Stock {
    const stock = findStockByProductId(stocks, deletedCartItem.productId)!;

    return updateStockCountByCartItem(
      stock,
      updateCartItemCount({count: 0, productId: deletedCartItem.productId}, deletedCartItem),
    );
  }

  function updateNewCartItemCount(cartItem: CartItem): CartItem {
    if (!oldCart) {
      return cartItem;
    }

    const oldCartItem = findCartItemByProductId(cartItem.productId, oldCart)!;
    return updateCartItemCount(cartItem, oldCartItem);
  }

  let revertedStocks: Stock[] = [];
  if (oldCart) {
    const deletedCartItems = findDeletedCartItems(cart, oldCart);
    revertedStocks = deletedCartItems.map(revertStock);
  }

  const updatedStocks = cart.map(cartItem => {
    const stock = findStockByProductId(stocks, cartItem.productId)!;
    const newCartItem = updateNewCartItemCount(cartItem);

    return updateStockCountByCartItem(stock, newCartItem);
  });

  return [...revertedStocks, ...updatedStocks];
}
