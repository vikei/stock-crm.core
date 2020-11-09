import DeliveryStatus from "../domain/delivery-status";
import CartItem from "../domain/cart-item";

export default class OrderDto {
  deliveryStatus: DeliveryStatus;
  cart: CartItem[];
}
