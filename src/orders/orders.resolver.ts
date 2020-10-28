import {Service} from "typedi";
import {Arg, FieldResolver, ID, Mutation, Resolver, Root} from "type-graphql";
import {InjectRepository} from "typeorm-typedi-extensions";
import OrderEntity from "./order.entity";
import {In, Repository} from "typeorm/index";
import {OrderInput} from "./orders.args";
import ProductEntity from "../products/product.entity";
import StockEntity from "../stocks/stock.entity";
import InventoryService from "./inventory.service";

@Service()
@Resolver(() => OrderEntity)
export default class OrdersResolver {
  constructor(
    @InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>,
    @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
    @InjectRepository(StockEntity) private stockRepository: Repository<StockEntity>,
    private inventoryService: InventoryService,
  ) {}

  @Mutation(() => OrderEntity)
  async createOrder(@Arg("input") input: OrderInput): Promise<OrderEntity> {
    const order = await this.orderRepository.save(this.orderRepository.create(input));
    await this.inventoryService.updateStock(order.inventory);
    return order;
  }

  @Mutation(() => OrderEntity, {nullable: true})
  async updateOrder(
    @Arg("id", () => ID) id: string,
    @Arg("input") input: OrderInput,
  ): Promise<OrderEntity | null> {
    const oldOrder = await this.orderRepository.findOne(id);
    if (!oldOrder) {
      return null;
    }

    await this.orderRepository.update(id, input);
    const updatedOrder = (await this.orderRepository.findOne(id))!;
    await this.inventoryService.updateStock(updatedOrder.inventory, oldOrder.inventory);

    return updatedOrder;
  }

  @FieldResolver()
  products(@Root() order: OrderEntity) {
    const productIds = order.inventory.map(inventory => inventory.productId);
    return this.productRepository.find({where: {id: In(productIds)}});
  }
}
