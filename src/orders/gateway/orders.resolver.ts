import {Service} from "typedi";
import {UserInputError} from "apollo-server";
import {Arg, FieldResolver, ID, Int, Mutation, Query, Resolver, Root} from "type-graphql";
import {OrderInput} from "./orders.args";
import OrdersService from "../lib/orders.service";
import {NullableResponse, Response} from "../../library/gateway/response";
import OrderType, {OrderTypeResponse} from "./order.type";
import OrdersStorage from "../storage/orders.storage";
import ProductsStorage from "../../products/storage/products.storage";
import OrdersPresenter from "../lib/orders.presenter";
import {ProductTypeResponse} from "../../products/gateway/product.type";
import ProductsPresenter from "../../products/lib/products.presenter";

@Service()
@Resolver(() => OrderType)
export default class OrdersResolver {
  constructor(
    private ordersStorage: OrdersStorage,
    private productsStorage: ProductsStorage,
    private ordersService: OrdersService,
    private ordersPresenter: OrdersPresenter,
    private productsPresenter: ProductsPresenter,
  ) {}

  @Mutation(() => OrderType)
  async createOrder(@Arg("input") input: OrderInput): Response<OrderTypeResponse> {
    const order = await this.ordersService.create(input);
    return this.ordersPresenter.prepareForResponse(order);
  }

  @Mutation(() => OrderType)
  async updateOrder(
    @Arg("id", () => ID) id: string,
    @Arg("input") input: OrderInput,
  ): Response<OrderTypeResponse> {
    const orderId = parseInt(id);

    const orderToUpdate = await this.ordersStorage.findOne({id: orderId});
    if (!orderToUpdate) {
      throw new UserInputError("Order not found");
    }

    const order = await this.ordersService.updateById(orderId, input);

    return this.ordersPresenter.prepareForResponse(order);
  }

  @Query(() => [OrderType])
  async orders(): Response<OrderTypeResponse[]> {
    return this.ordersPresenter.prepareForResponse(await this.ordersStorage.find());
  }

  @Query(() => OrderType, {nullable: true})
  async order(@Arg("id", () => ID) id: string): NullableResponse<OrderTypeResponse> {
    const order = await this.ordersStorage.findOne({id: parseInt(id)});

    if (!order) {
      return null;
    }

    return this.ordersPresenter.prepareForResponse(order);
  }

  @Mutation(() => Int, {nullable: true})
  async deleteOrder(@Arg("id", () => ID) id: string): NullableResponse<number> {
    return this.ordersStorage.deleteById(parseInt(id));
  }

  @FieldResolver()
  async products(@Root() order: OrderType): Response<ProductTypeResponse[]> {
    // TODO: make helper: findProductsByOrderId
    const productEntities = await this.productsStorage.find({
      ids: order.cart.map(inventory => inventory.productId),
    });

    return this.productsPresenter.prepareForResponse(productEntities);
  }
}
