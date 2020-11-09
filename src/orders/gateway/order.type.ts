import {Field, ID, ObjectType} from "type-graphql";
import DeliveryStatus from "./delivery-status.type";
import CartItemType from "./cart-item.type";
import ProductType from "../../products/gateway/product.type";

@ObjectType("Order")
export default class OrderType {
  @Field(() => ID)
  id: string;

  @Field(() => DeliveryStatus)
  deliveryStatus: DeliveryStatus;

  @Field(() => [CartItemType])
  cart: CartItemType[];

  @Field(() => [ProductType])
  products: ProductType[];
}

export type OrderTypeResponse = Omit<OrderType, "products">;
