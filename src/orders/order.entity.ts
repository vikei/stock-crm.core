import {Field, ID, Int, ObjectType} from "type-graphql";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm/index";
import {OrderStatus} from "./orders.constants";
import ProductType from "../products/gateway/product.type";

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

  @Field(() => OrderStatus)
  @Column({type: "enum", enum: OrderStatus})
  status: OrderStatus;

  @Field(() => [OrderInventoryItem])
  @Column({type: "json"})
  inventory: OrderInventoryItem[];

  @Field(() => [ProductType])
  products: ProductType[];
}
