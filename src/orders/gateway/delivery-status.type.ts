import {registerEnumType} from "type-graphql";
import DeliveryStatus from "../domain/delivery-status";

registerEnumType(DeliveryStatus, {name: "DeliveryStatus"});

export default DeliveryStatus;
