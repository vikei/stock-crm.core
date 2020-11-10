import CartItem from "../../../orders/domain/cart-item";
import Stock from "../stock";
import diffCartItems from "../../../orders/domain/use-cases/diff-cart-items";
import findDeletedCartItems from "../../../orders/domain/use-cases/find-deleted-cart-items";

export function calculateStock({...stock}: Stock, cartItem: CartItem): Stock {
  stock.count = stock.count - cartItem.count;
  return stock;
}

export function updateStocks(stocks: Stock[], cart: CartItem[], oldCart?: CartItem[]): Stock[] {
  function findCartItem(productId: number, cart: CartItem[]): CartItem | undefined {
    return cart.find(cartItem => cartItem.productId === productId);
  }

  function findStock(productId: number, stocks: Stock[]): Stock | undefined {
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
    const stock = findStock(deletedCartItem.productId, stocks)!;

    const fakeCartItem = new CartItem({count: 0, productId: deletedCartItem.productId});
    return calculateStock(
      stock,
      // invert stock count, result = 0 - (-5) = 0 + 5
      diffCartItems(fakeCartItem, deletedCartItem),
    );
  }

  let updatedStocks = cart.map(cartItem => {
    const stock = findStock(cartItem.productId, stocks)!;
    const updatedCartItem = updateCartItem(cartItem);

    return calculateStock(stock, updatedCartItem);
  });

  if (oldCart) {
    const deletedCartItems = findDeletedCartItems(cart, oldCart);
    const revertedStocks = deletedCartItems.map(revertStock);

    updatedStocks = updatedStocks.concat(revertedStocks);
  }

  return updatedStocks;
}
