import {Service} from "typedi";
import {Arg, FieldResolver, Mutation, Resolver, Root} from "type-graphql";
import {InjectRepository} from "typeorm-typedi-extensions";
import OrderEntity from "./order.entity";
import {In, Repository} from "typeorm/index";
import {OrderInput} from "./orders.args";
import ProductEntity from "../products/product.entity";

@Service()
@Resolver(() => OrderEntity)
export default class OrdersResolver {
  constructor(
    @InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>,
    @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
  ) {}

  @Mutation(() => OrderEntity)
  async createOrder(@Arg("input") input: OrderInput) {
    const order = await this.orderRepository.save(this.orderRepository.create(input));
    // update stock
    return order;
  }

  @FieldResolver()
  products(@Root() order: OrderEntity) {
    const productIds = order.inventory.map(inventory => inventory.productId);
    return this.productRepository.find({where: {id: In(productIds)}});
  }
}
