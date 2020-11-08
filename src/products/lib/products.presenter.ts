import {Service} from "typedi";
import ProductEntity from "../storage/product.entity";
import {ProductTypeResponse} from "../gateway/product.type";

@Service()
export default class ProductsPresenter {
  private static prepareForResponseSingle({...entity}: ProductEntity): ProductTypeResponse {
    delete entity.stock;
    return {...entity, id: entity.id.toString()};
  }

  prepareForResponse(data: ProductEntity): ProductTypeResponse;
  prepareForResponse(data: ProductEntity[]): ProductTypeResponse[];
  prepareForResponse(
    data: ProductEntity | ProductEntity[],
  ): ProductTypeResponse | ProductTypeResponse[] {
    if (Array.isArray(data)) {
      return data.map(entity => ProductsPresenter.prepareForResponseSingle(entity));
    } else {
      return ProductsPresenter.prepareForResponseSingle(data);
    }
  }
}
