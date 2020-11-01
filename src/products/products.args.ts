import {ArgsType, Field, Float, InputType, Int} from "type-graphql";

@InputType()
export class ProductInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  stockCount: number;
}

@ArgsType()
export class ProductsQuery {
  @Field(() => String, {nullable: true})
  name: string | null;

  @Field(() => [Int], {nullable: true})
  ids: number[] | null;
}
