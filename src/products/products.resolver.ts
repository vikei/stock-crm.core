import {Service} from "typedi";
import {Arg, Args, FieldResolver, ID, Int, Mutation, Query, Resolver, Root} from "type-graphql";
import {InjectRepository} from "typeorm-typedi-extensions";
import ProductEntity from "./product.entity";
import {FindConditions, Raw, Repository} from "typeorm/index";
import {ProductInput, ProductsQuery} from "./products.args";
import StockEntity from "../stocks/stock.entity";

@Service()
@Resolver(() => ProductEntity)
export default class ProductsResolver {
  constructor(
    @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
    @InjectRepository(StockEntity) private stockRepository: Repository<StockEntity>,
  ) {}

  @Query(() => [ProductEntity])
  async products(@Args() {name}: ProductsQuery): Promise<ProductEntity[]> {
    const where: FindConditions<ProductEntity> = {};

    if (name) {
      where.name = Raw(alias => `${alias} ILIKE '%${name}%'`);
    }

    return this.productRepository.find({where});
  }

  @Mutation(() => ProductEntity)
  async createProduct(@Arg("input") {stockCount, ...input}: ProductInput): Promise<ProductEntity> {
    const product = await this.productRepository.save(this.productRepository.create(input));
    await this.stockRepository.save(this.stockRepository.create({product, count: stockCount}));
    return product;
  }

  @Mutation(() => ProductEntity, {nullable: true})
  async updateProduct(
    @Arg("id", () => ID)
    id: string,
    @Arg("input") {stockCount, ...input}: ProductInput,
  ): Promise<ProductEntity | null> {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      return null;
    }

    await this.productRepository.update(id, input);

    const stock = (await this.stockRepository.findOne({productId: parseInt(id)}))!;
    await this.stockRepository.update({id: stock.id}, {count: stockCount});

    return (await this.productRepository.findOne(id))!;
  }

  @Mutation(() => Int, {nullable: true})
  async deleteProduct(@Arg("id", () => ID) id: string): Promise<number | null> {
    const {affected} = await this.productRepository.delete(id);
    return affected ?? null;
  }

  @Query(() => ProductEntity, {nullable: true})
  async product(@Arg("id", () => ID) id: string): Promise<ProductEntity | null> {
    return (await this.productRepository.findOne(id)) ?? null;
  }

  @FieldResolver()
  async stockCount(@Root() product: ProductEntity): Promise<number> {
    const {count} = (await this.stockRepository.findOne({productId: product.id}))!;
    return count;
  }
}
