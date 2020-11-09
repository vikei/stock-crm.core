import {Service} from "typedi";
import {Resolver} from "type-graphql";
import {InjectRepository} from "typeorm-typedi-extensions";
import StockEntity from "./stock.entity";
import {FindConditions, In, Repository} from "typeorm/index";
import StockDto from "./stock.dto";
import StocksQuery from "./stocks.query";
import StockQuery from "./stock.query";

@Service()
@Resolver()
export default class StocksStorage {
  constructor(@InjectRepository(StockEntity) public stockRepository: Repository<StockEntity>) {}

  async findOne(query: StockQuery): Promise<StockEntity | undefined> {
    return this.stockRepository.findOne(query);
  }

  async find(query: StocksQuery = {}): Promise<StockEntity[]> {
    const where: FindConditions<StockEntity> = {};

    if (query.productIds) {
      where.productId = In(query.productIds);
    }

    return this.stockRepository.find({where});
  }

  async create(dto: StockDto): Promise<StockEntity> {
    return this.stockRepository.save(this.stockRepository.create(dto));
  }

  async saveMany(dtos: StockDto[]): Promise<StockEntity[]> {
    return this.stockRepository.save(dtos.map(dto => this.stockRepository.create(dto)));
  }

  async updateById(id: number, dto: StockDto): Promise<StockEntity | undefined> {
    await this.stockRepository.update({id}, dto);
    return this.findOne({id});
  }
}
