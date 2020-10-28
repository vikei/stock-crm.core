import {Field, ID, Int, ObjectType} from "type-graphql";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm/index";
import ProductEntity from "../products/product.entity";

@ObjectType("OrderInventoryItem")
export class OrderInventoryItem {
  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  count: number;
}

@ObjectType("Order")
@Entity()
export default class OrderEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => [OrderInventoryItem])
  @Column({type: "json"})
  inventory: OrderInventoryItem[];

  @Field(() => [ProductEntity])
  products: ProductEntity[];
}
