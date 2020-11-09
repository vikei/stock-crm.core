import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm/index";
import ProductEntity from "../../products/storage/product.entity";

@Entity()
export default class StockEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  count: number;

  @OneToOne(() => ProductEntity, product => product.stock, {onDelete: "CASCADE"})
  @JoinColumn()
  product: ProductEntity;
}
