import {Field, Float, InputType} from "type-graphql";

@InputType()
export class ProductInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;
}
