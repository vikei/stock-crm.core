import {Service} from "typedi";
import {Arg, Args, FieldResolver, ID, Int, Mutation, Query, Resolver, Root} from "type-graphql";
import ProductEntity from "../storage/product.entity";
import ProductsQueryArgs from "./products-query.args";
import ProductInput from "./product.input";
import ProductsStorage from "../storage/products.storage";
import ProductType, {ProductTypeResponse} from "./product.type";
import ProductsPresenter from "../lib/products.presenter";
import {NullableResponse, Response} from "../../library/gateway/response";
import StockStorage from "../../stocks/storage/stock.storage";

@Service()
@Resolver(() => ProductType)
export default class ProductsResolver {
  constructor(
    private stocksStorage: StockStorage,
    private productsStorage: ProductsStorage,
    private productsPresenter: ProductsPresenter,
  ) {}

  @Mutation(() => ProductType)
  async createProduct(
    @Arg("input") {stockCount, ...input}: ProductInput,
  ): Response<ProductTypeResponse> {
    const product = await this.productsStorage.create(input);

    await this.stocksStorage.create({productId: product.id, count: stockCount});

    return this.productsPresenter.prepareForResponse(product);
  }

  @Mutation(() => ProductType, {nullable: true})
  async updateProduct(
    @Arg("id", () => ID)
    id: string,
    @Arg("input") {stockCount, ...input}: ProductInput,
  ): NullableResponse<ProductTypeResponse> {
    const productId = parseInt(id);

    const productToUpdate = await this.productsStorage.findOne({id: productId});
    if (!productToUpdate) {
      return null;
    }

    await this.productsStorage.updateById(productId, input);

    const stock = (await this.stocksStorage.findOne({productId}))!;
    await this.stocksStorage.updateById(stock.id, {productId, count: stockCount});

    const product = (await this.productsStorage.findOne({id: productId}))!;

    return this.productsPresenter.prepareForResponse(product);
  }

  @Query(() => [ProductType])
  async products(@Args() query: ProductsQueryArgs): Response<ProductTypeResponse[]> {
    const productEntities = await this.productsStorage.find(query);
    return this.productsPresenter.prepareForResponse(productEntities);
  }

  @Query(() => ProductType, {nullable: true})
  async product(@Arg("id", () => ID) id: string): NullableResponse<ProductTypeResponse> {
    const product = await this.productsStorage.findOne({id: parseInt(id)});

    if (!product) {
      return null;
    }

    return this.productsPresenter.prepareForResponse(product);
  }

  @Mutation(() => Int, {nullable: true})
  async deleteProduct(@Arg("id", () => ID) id: string): Response<number | null> {
    return await this.productsStorage.deleteById(parseInt(id));
  }

  @FieldResolver()
  async stockCount(@Root() product: ProductEntity): Response<number> {
    const {count} = (await this.stocksStorage.findOne({productId: product.id}))!;
    return count;
  }
}
