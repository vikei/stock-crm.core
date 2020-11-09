import Order from "../order";
import DeliveryStatus from "../delivery-status";

export default function becomeCanceled(newOrder: Order, oldOrder: Order): boolean {
  return (
    [DeliveryStatus.CANCELED, DeliveryStatus.NOT_DELIVERED].includes(newOrder.deliveryStatus) &&
    ![DeliveryStatus.CANCELED, DeliveryStatus.NOT_DELIVERED].includes(oldOrder.deliveryStatus)
  );
}
