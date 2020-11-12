import {Service} from "typedi";
import OrderEntity from "../storage/order.entity";
import {OrderTypeResponse} from "../gateway/order.type";

@Service()
export default class OrdersPresenter {
  prepareForResponse(data: OrderEntity): OrderTypeResponse;
  prepareForResponse(data: OrderEntity[]): OrderTypeResponse[];
  prepareForResponse(data: OrderEntity | OrderEntity[]): OrderTypeResponse | OrderTypeResponse[] {
    if (Array.isArray(data)) {
      return data.map(entity => OrdersPresenter.prepareForResponseSingle(entity));
    }
    return OrdersPresenter.prepareForResponseSingle(data);
  }

  private static prepareForResponseSingle(entity: OrderEntity): OrderTypeResponse {
    return {...entity, id: entity.id.toString()};
  }
}
