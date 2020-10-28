import {Service} from "typedi";
import {InjectRepository} from "typeorm-typedi-extensions";
import StockEntity from "./stock.entity";
import {In, Repository} from "typeorm/index";
import {OrderInventoryItem} from "../orders/order.entity";
import {getUniqueProductIdsFromInventory} from "../orders/inventory.lib";
import {createDeletedInventoryStocksData, createStocksData} from "./stocks.lib";

@Service()
export default class StocksService {
  constructor(@InjectRepository(StockEntity) private stockRepository: Repository<StockEntity>) {}

  async updateByInventory(
    newInventory: OrderInventoryItem[],
    oldInventory: OrderInventoryItem[] = [],
  ): Promise<StockEntity[]> {
    const productIds = getUniqueProductIdsFromInventory([...newInventory, ...oldInventory]);
    const stocks = await this.stockRepository.find({where: {id: In(productIds)}});

    let stocksData: StockEntity[] = createStocksData(newInventory, stocks, oldInventory);

    if (oldInventory.length) {
      stocksData = [
        ...stocksData,
        ...createDeletedInventoryStocksData(oldInventory, newInventory, stocks),
      ];
    }

    return this.stockRepository.save(stocksData);
  }
}
