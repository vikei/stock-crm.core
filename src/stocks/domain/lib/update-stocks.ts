import CartItem from "../../../orders/domain/cart-item";
import Stock from "../stock";
import diffCartItems from "../../../orders/domain/lib/diff-cart-items";
import findDeletedCartItems from "../../../orders/domain/lib/find-deleted-cart-items";

export function updateStock({...stock}: Stock, cartItem: CartItem): Stock {
  stock.count = stock.count - cartItem.count;
  return stock;
}

export function updateStocks(stocks: Stock[], cart: CartItem[], oldCart?: CartItem[]): Stock[] {
  function findCartItem(productId: number, cart: CartItem[]): CartItem | undefined {
    return cart.find(cartItem => cartItem.productId === productId);
  }

  function findStock(stocks: Stock[], productId: number): Stock | undefined {
    return stocks.find(stock => stock.productId === productId);
  }

  function updateCartItem(cartItem: CartItem): CartItem {
    if (!oldCart) {
      return cartItem;
    }

    const oldCartItem = findCartItem(cartItem.productId, oldCart)!;
    return diffCartItems(cartItem, oldCartItem);
  }

  function revertStock(deletedCartItem: CartItem): Stock {
    const stock = findStock(stocks, deletedCartItem.productId)!;

    return updateStock(
      stock,
      // invert stock count, result = 0 - (-5) = 0 + 5
      diffCartItems({count: 0, productId: deletedCartItem.productId}, deletedCartItem),
    );
  }

  let revertedStocks: Stock[] = [];
  if (oldCart) {
    const deletedCartItems = findDeletedCartItems(cart, oldCart);
    revertedStocks = deletedCartItems.map(revertStock);
  }

  const updatedStocks = cart.map(cartItem => {
    const stock = findStock(stocks, cartItem.productId)!;
    const updatedCartItem = updateCartItem(cartItem);

    return updateStock(stock, updatedCartItem);
  });

  return [...revertedStocks, ...updatedStocks];
}
