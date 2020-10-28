import {Service} from "typedi";
import {InjectRepository} from "typeorm-typedi-extensions";
import StockEntity from "../stocks/stock.entity";
import {In, Repository} from "typeorm/index";
import {OrderInventoryItem} from "./order.entity";
import {
  getUniqueProductIdsFromInventory,
  createStocksData,
  createDeletedInventoryStocksData,
} from "./inventory.lib";

@Service()
export default class InventoryService {
  constructor(@InjectRepository(StockEntity) private stockRepository: Repository<StockEntity>) {}

  async updateStock(
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
