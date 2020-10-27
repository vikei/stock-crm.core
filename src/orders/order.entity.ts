import {Field, ID, Int, ObjectType} from "type-graphql";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm/index";
import ProductEntity from "../products/product.entity";

@ObjectType("OrderInventory")
export class OrderInventory {
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

  @Field(() => [OrderInventory])
  @Column({type: "json"})
  inventory: OrderInventory[];

  @Field(() => [ProductEntity])
  products: ProductEntity[];
}
