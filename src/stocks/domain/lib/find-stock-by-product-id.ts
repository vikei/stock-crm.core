import Stock from "../stock";

export default function findStockByProductId(
  stocks: Stock[],
  productId: number,
): Stock | undefined {
  return stocks.find(stock => stock.productId === productId);
}
