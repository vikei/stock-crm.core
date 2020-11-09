import {Field, Int, ObjectType} from "type-graphql";

@ObjectType("CartItem")
export default class CartItemType {
  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  count: number;
}
