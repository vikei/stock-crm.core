import {Service} from "typedi";
import OrderEntity from "../storage/order.entity";
import {OrderTypeResponse} from "../gateway/order.type";

@Service()
export default class OrdersPresenter {
  prepareForResponse(entity: OrderEntity): OrderTypeResponse;
  prepareForResponse(entity: OrderEntity[]): OrderTypeResponse[];
  prepareForResponse(entity: OrderEntity | OrderEntity[]): OrderTypeResponse | OrderTypeResponse[] {
    if (Array.isArray(entity)) {
      return entity.map(entity => OrdersPresenter.prepareForResponseSingle(entity));
    }

    return {...entity, id: entity.id.toString()};
  }

  private static prepareForResponseSingle(entity: OrderEntity): OrderTypeResponse {
    return {...entity, id: entity.id.toString()};
  }
}
