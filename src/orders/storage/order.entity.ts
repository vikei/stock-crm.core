import {Column, Entity, PrimaryGeneratedColumn} from "typeorm/index";
import DeliveryStatus from "../domain/delivery-status";
import CartItemColumn from "./cart-item-column";

@Entity()
export default class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: "enum", enum: DeliveryStatus})
  deliveryStatus: DeliveryStatus;

  @Column({type: "json"})
  cart: CartItemColumn[];
}
