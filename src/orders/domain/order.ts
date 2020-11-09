import DeliveryStatus from "./delivery-status";
import CartItem from "./cart-item";

export default class Order {
  id: number;
  deliveryStatus: DeliveryStatus;
  cart: CartItem[];
}
