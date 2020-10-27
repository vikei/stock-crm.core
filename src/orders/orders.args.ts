import {Field, InputType, Int} from "type-graphql";

@InputType()
export class OrderInventoryInput {
  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  count: number;
}

@InputType()
export class OrderInput {
  @Field(() => [OrderInventoryInput])
  inventory: OrderInventoryInput[];
}
