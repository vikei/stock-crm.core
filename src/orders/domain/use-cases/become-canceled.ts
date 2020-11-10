import DeliveryStatus from "../delivery-status";

export default function becomeCanceled(
  newDeliveryStatus: DeliveryStatus,
  oldDeliveryStatus: DeliveryStatus,
): boolean {
  return (
    [DeliveryStatus.CANCELED, DeliveryStatus.NOT_DELIVERED].includes(newDeliveryStatus) &&
    ![DeliveryStatus.CANCELED, DeliveryStatus.NOT_DELIVERED].includes(oldDeliveryStatus)
  );
}
