import {Service} from "typedi";
import {Arg, Args, FieldResolver, ID, Int, Mutation, Query, Resolver, Root} from "type-graphql";
import {InjectRepository} from "typeorm-typedi-extensions";
import ProductEntity from "../storage/product.entity";
import {Repository} from "typeorm/index";
import StockEntity from "../../stocks/stock.entity";
import ProductsQueryArgs from "./products-query.args";
import ProductInput from "./product.input";
import ProductsStorage from "../storage/products.storage";
import ProductType, {ProductTypeResponse} from "./product.type";
import ProductsPresenter from "../lib/products.presenter";
import {NullableResponse, Response} from "../../library/gateway/response";

@Service()
@Resolver(() => ProductType)
export default class ProductsResolver {
  constructor(
    @InjectRepository(StockEntity) private stockRepository: Repository<StockEntity>,
    private productsStorage: ProductsStorage,
    private productsPresenter: ProductsPresenter,
  ) {}

  @Query(() => [ProductType])
  async products(@Args() query: ProductsQueryArgs): Response<ProductTypeResponse[]> {
    const productEntities = await this.productsStorage.findMany(query);
    return this.productsPresenter.prepareForResponse(productEntities);
  }

  @Mutation(() => ProductType)
  async createProduct(
    @Arg("input") {stockCount, ...input}: ProductInput,
  ): Response<ProductTypeResponse> {
    const productEntity = await this.productsStorage.create(input);

    await this.stockRepository.save(
      this.stockRepository.create({product: productEntity, count: stockCount}),
    );

    return this.productsPresenter.prepareForResponse(productEntity);
  }

  @Mutation(() => ProductType, {nullable: true})
  async updateProduct(
    @Arg("id", () => ID)
    id: string,
    @Arg("input") {stockCount, ...input}: ProductInput,
  ): NullableResponse<ProductTypeResponse> {
    const entityId = parseInt(id);

    const productEntity = await this.productsStorage.findOne({id: entityId});
    if (!productEntity) {
      return null;
    }

    await this.productsStorage.updateById(entityId, input);

    const stock = (await this.stockRepository.findOne({productId: parseInt(id)}))!;
    await this.stockRepository.update({id: stock.id}, {count: stockCount});

    const updatedProductEntity = (await this.productsStorage.findOne({id: entityId}))!;

    return this.productsPresenter.prepareForResponse(updatedProductEntity);
  }

  @Mutation(() => Int, {nullable: true})
  async deleteProduct(@Arg("id", () => ID) id: string): Response<number | null> {
    return await this.productsStorage.deleteById(parseInt(id));
  }

  @Query(() => ProductType, {nullable: true})
  async product(@Arg("id", () => ID) id: string): NullableResponse<ProductTypeResponse> {
    const productEntity = await this.productsStorage.findOne({id: parseInt(id)});

    if (!productEntity) {
      return null;
    }

    return this.productsPresenter.prepareForResponse(productEntity);
  }

  @FieldResolver()
  async stockCount(@Root() product: ProductEntity): Response<number> {
    const {count} = (await this.stockRepository.findOne({productId: product.id}))!;
    return count;
  }
}
