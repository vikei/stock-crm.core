import {Field, Float, ID, Int, ObjectType} from "type-graphql";
import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm/index";
import StockEntity from "../stocks/stock.entity";

@ObjectType("Product")
@Entity()
export default class ProductEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field(() => Float)
  @Column({type: "float"})
  price: number;

  @OneToOne(() => StockEntity, stock => stock.product)
  stock: StockEntity;

  @Field(() => Int)
  stockCount: number;
}
