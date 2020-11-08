import {Field, Float, InputType, Int} from "type-graphql";

@InputType()
export default class ProductInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  stockCount: number;

  @Field()
  available: boolean;
}
