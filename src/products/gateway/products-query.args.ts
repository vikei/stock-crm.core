import {ArgsType, Field, Int} from "type-graphql";

@ArgsType()
export default class ProductsQueryArgs {
  @Field(() => String, {nullable: true})
  name?: string;

  @Field(() => [Int], {nullable: true})
  ids?: number[];
}
