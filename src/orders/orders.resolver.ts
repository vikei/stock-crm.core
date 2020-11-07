import {Service} from "typedi";
import {UserInputError} from "apollo-server";
import {Arg, FieldResolver, ID, Int, Mutation, Query, Resolver, Root} from "type-graphql";
import {InjectRepository} from "typeorm-typedi-extensions";
import OrderEntity from "./order.entity";
import {In, Repository} from "typeorm/index";
import {OrderInput} from "./orders.args";
import ProductEntity from "../products/product.entity";
import StockEntity from "../stocks/stock.entity";
import StocksService from "../stocks/stocks.service";
import {OrderStatus} from "./orders.constants";
import {NullableResponse, Response} from "../library/gateway/response";

@Service()
@Resolver(() => OrderEntity)
export default class OrdersResolver {
  constructor(
    @InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>,
    @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
    @InjectRepository(StockEntity) private stockRepository: Repository<StockEntity>,
    private stocksService: StocksService,
  ) {}

  @Mutation(() => OrderEntity)
  async createOrder(@Arg("input") input: OrderInput): Response<OrderEntity> {
    const order = await this.orderRepository.save(this.orderRepository.create(input));
    await this.stocksService.updateByInventory(order.inventory);
    return order;
  }

  @Mutation(() => OrderEntity)
  async updateOrder(
    @Arg("id", () => ID) id: string,
    @Arg("input") input: OrderInput,
  ): Response<OrderEntity> {
    const oldOrder = await this.orderRepository.findOne(id);
    if (!oldOrder) {
      throw new UserInputError("Order not found");
    }

    await this.orderRepository.update(id, input);
    const updatedOrder = (await this.orderRepository.findOne(id))!;

    const orderBecomeCanceled =
      ![OrderStatus.CANCELED, OrderStatus.NOT_DELIVERED].includes(oldOrder.status) &&
      [OrderStatus.CANCELED, OrderStatus.NOT_DELIVERED].includes(updatedOrder.status);
    if (orderBecomeCanceled) {
      await this.stocksService.updateByInventory([], oldOrder.inventory);
    } else {
      await this.stocksService.updateByInventory(updatedOrder.inventory, oldOrder.inventory);
    }

    return updatedOrder;
  }

  @Query(() => [OrderEntity])
  async orders(): Response<OrderEntity[]> {
    return this.orderRepository.find();
  }

  @Query(() => OrderEntity, {nullable: true})
  async order(@Arg("id", () => ID) id: string): NullableResponse<OrderEntity> {
    return await this.orderRepository.findOne(id);
  }

  @Mutation(() => Int, {nullable: true})
  async deleteOrder(@Arg("id", () => ID) id: string): NullableResponse<number> {
    const {affected} = await this.orderRepository.delete(id);
    return affected ?? null;
  }

  @FieldResolver()
  products(@Root() order: OrderEntity): Response<ProductEntity[]> {
    const productIds = order.inventory.map(inventory => inventory.productId);
    return this.productRepository.find({where: {id: In(productIds)}});
  }
}
