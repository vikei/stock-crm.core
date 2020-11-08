import {Field, Float, ID, Int, ObjectType} from "type-graphql";

@ObjectType("Product")
export default class ProductType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;

  @Field()
  available: boolean;

  @Field(() => Int)
  stockCount: number;
}

export type ProductTypeResponse = Omit<ProductType, "stockCount">;
