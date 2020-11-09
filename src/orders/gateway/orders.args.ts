import {Field, InputType, Int} from "type-graphql";
import DeliveryStatus from "../domain/delivery-status";

@InputType()
export class CartItemInput {
  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  count: number;
}

@InputType()
export class OrderInput {
  @Field(() => [CartItemInput])
  cart: CartItemInput[];

  @Field(() => DeliveryStatus)
  deliveryStatus: DeliveryStatus;
}
