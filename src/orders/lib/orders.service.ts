import {Service} from "typedi";
import StockEntity from "../../stocks/storage/stock.entity";
import getProductIdsByCart from "../domain/use-cases/get-product-ids-by-cart";
import StocksStorage from "../../stocks/storage/stock.storage";
import OrderEntity from "../storage/order.entity";
import updateStocksByOrder from "../../stocks/domain/use-cases/update-stocks-by-order";
import OrdersStorage from "../storage/orders.storage";
import OrderDto from "../storage/order.dto";

@Service()
export default class OrdersService {
  constructor(public stocksStorage: StocksStorage, public ordersStorage: OrdersStorage) {}

  async create(dto: OrderDto): Promise<OrderEntity> {
    const order = await this.ordersStorage.create(dto);

    await this.updateStocks(order);

    return order;
  }

  async updateById(id: number, dto: OrderDto): Promise<OrderEntity> {
    const orderToUpdate = await this.ordersStorage.findOne({id});

    if (!orderToUpdate) {
      throw Error();
    }

    const order = (await this.ordersStorage.updateById(id, dto))!;

    await this.updateStocks(order, orderToUpdate);

    return order;
  }

  async updateStocks(order: OrderEntity, oldOrder?: OrderEntity): Promise<StockEntity[]> {
    const stocks = await this.stocksStorage.find({
      productIds: getProductIdsByCart([...order.cart, ...(oldOrder?.cart ?? [])]),
    });

    return this.stocksStorage.saveMany(updateStocksByOrder(order, stocks, oldOrder));
  }
}
