import {Service} from "typedi";
import {Arg, FieldResolver, Mutation, Resolver, Root} from "type-graphql";
import {InjectRepository} from "typeorm-typedi-extensions";
import OrderEntity from "./order.entity";
import {In, Repository} from "typeorm/index";
import {OrderInput} from "./orders.args";
import ProductEntity from "../products/product.entity";
import StockEntity from "../stocks/stock.entity";

@Service()
@Resolver(() => OrderEntity)
export default class OrdersResolver {
  constructor(
    @InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>,
    @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
    @InjectRepository(StockEntity) private stockRepository: Repository<StockEntity>,
  ) {}

  @Mutation(() => OrderEntity)
  async createOrder(@Arg("input") input: OrderInput) {
    const order = await this.orderRepository.save(this.orderRepository.create(input));

    const productIds = order.inventory.map(inventory => inventory.productId);
    const stocks = await this.stockRepository.find({where: {id: In(productIds)}});
    const newStocksData = order.inventory.map(inventory => {
      const stock = {...stocks.find(stock => stock.productId === inventory.productId)!};
      stock.count = stock.count - inventory.count;
      return stock;
    });
    await this.stockRepository.save(newStocksData);

    return order;
  }

  @FieldResolver()
  products(@Root() order: OrderEntity) {
    const productIds = order.inventory.map(inventory => inventory.productId);
    return this.productRepository.find({where: {id: In(productIds)}});
  }
}
