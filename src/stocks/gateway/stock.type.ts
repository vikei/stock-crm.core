import {Field, ID, Int, ObjectType} from "type-graphql";
import {Entity} from "typeorm/index";
import ProductType from "../../products/gateway/product.type";

@ObjectType("Stock")
@Entity()
export default class StockType {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  count: number;

  @Field(() => ProductType)
  product: ProductType;
}
