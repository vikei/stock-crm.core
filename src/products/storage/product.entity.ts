import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm/index";
import StockEntity from "../../stocks/stock.entity";

@Entity()
export default class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({type: "float"})
  price: number;

  @Column()
  available: boolean;

  @OneToOne(() => StockEntity, stock => stock.product)
  stock?: StockEntity;
}
