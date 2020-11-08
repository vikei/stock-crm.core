import {Field, ID, Int, ObjectType} from "type-graphql";
import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm/index";
import ProductEntity from "../products/storage/product.entity";
import ProductType from "../products/gateway/product.type";

@ObjectType("Stock")
@Entity()
export default class StockEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  productId: number;

  @Field(() => Int)
  @Column()
  count: number;

  @Field(() => ProductType)
  @OneToOne(() => ProductEntity, product => product.stock, {onDelete: "CASCADE"})
  @JoinColumn()
  product: ProductEntity;
}
