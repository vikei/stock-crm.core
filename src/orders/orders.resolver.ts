import {Service} from "typedi";
import {Arg, FieldResolver, ID, Mutation, Resolver, Root} from "type-graphql";
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
  async createOrder(@Arg("input") input: OrderInput): Promise<OrderEntity> {
    const order = await this.orderRepository.save(this.orderRepository.create(input));

    const productIds = order.inventory.map(inventory => inventory.productId);
    const stocks = await this.stockRepository.find({where: {id: In(productIds)}});
    const newStocksData = order.inventory.map(inventory => {
      const stock = {...stocks.find(stock => stock.productId === inventory.productId)!};
      stock.count = stock.count - inventory.count;
      return this.stockRepository.create(stock);
    });
    await this.stockRepository.save(newStocksData);

    return order;
  }

  @Mutation(() => OrderEntity, {nullable: true})
  async updateOrder(
    @Arg("id", () => ID) id: string,
    @Arg("input") input: OrderInput,
  ): Promise<OrderEntity | null> {
    const orderToUpdate = await this.orderRepository.findOne(id);

    if (!orderToUpdate) {
      return null;
    }

    await this.orderRepository.update(id, input);
    const updatedOrder = (await this.orderRepository.findOne(id))!;

    const productIds = [
      ...new Set([
        ...updatedOrder.inventory.map(inventory => inventory.productId),
        ...orderToUpdate.inventory.map(inventory => inventory.productId),
      ]),
    ];
    const stocks = await this.stockRepository.find({where: {id: In(productIds)}});

    // increase stock(productId) if it was removed from order
    const deletedInventory = orderToUpdate.inventory.filter(
      prevInventory =>
        updatedOrder.inventory.findIndex(
          currentInventory => currentInventory.productId === prevInventory.productId,
        ) === -1,
    );
    const deletedInventoryStocksData = deletedInventory.map(inventory => {
      const stock = {...stocks.find(stock => stock.productId === inventory.productId)!};
      stock.count += inventory.count;
      return this.stockRepository.create(stock);
    });

    // product can be increased or decreased so you need calculate diff to updated stock
    const updatedStocksData = updatedOrder.inventory.map(inventory => {
      const stock = {...stocks.find(stock => stock.productId === inventory.productId)!};
      // product from updatedOrder can be new and not exist in orderToUpdate
      const prevInventory = orderToUpdate.inventory.find(
        prevInventory => prevInventory.productId === inventory.productId,
      ) ?? {count: 0};
      const inventoryCountDiff = inventory.count - prevInventory.count;
      stock.count = stock.count - inventoryCountDiff;
      return this.stockRepository.create(stock);
    });
    await this.stockRepository.save([...updatedStocksData, ...deletedInventoryStocksData]);

    return updatedOrder;
  }

  @FieldResolver()
  products(@Root() order: OrderEntity) {
    const productIds = order.inventory.map(inventory => inventory.productId);
    return this.productRepository.find({where: {id: In(productIds)}});
  }
}
