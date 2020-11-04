import {registerEnumType} from "type-graphql";

export enum OrderStatus {
  AWAITING_PROCESSING = "AWAITING_PROCESSING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  NOT_DELIVERED = "NOT_DELIVERED",
  CANCELED = "CANCELED",
}
registerEnumType(OrderStatus, {name: "OrderStatus"});
