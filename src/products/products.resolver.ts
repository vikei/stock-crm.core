import {Service} from "typedi";
import {Arg, ID, Int, Mutation, Query, Resolver} from "type-graphql";
import {InjectRepository} from "typeorm-typedi-extensions";
import ProductEntity from "./product.entity";
import {Repository} from "typeorm/index";
import {ProductInput} from "./products.args";

@Service()
@Resolver()
export default class ProductsResolver {
  constructor(
    @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
  ) {}

  @Query(() => [ProductEntity])
  async products() {
    return this.productRepository.find();
  }

  @Mutation(() => ProductEntity)
  async createProduct(@Arg("input") input: ProductInput): Promise<ProductEntity> {
    const {id} = await this.productRepository.save(input);
    return (await this.productRepository.findOne(id))!;
  }

  @Mutation(() => ProductEntity, {nullable: true})
  async updateProduct(
    @Arg("id", () => ID)
    id: string,
    @Arg("input") input: ProductInput,
  ): Promise<ProductEntity | null> {
    const product = await this.productRepository.findOne(id);

    if (!product) {
      return null;
    }

    await this.productRepository.update(id, input);

    return (await this.productRepository.findOne(id))!;
  }

  @Mutation(() => Int, {nullable: true})
  async deleteProduct(@Arg("id", () => ID) id: string): Promise<number | null> {
    const {affected} = await this.productRepository.delete(id);
    return affected ?? null;
  }

  @Query(() => ProductEntity, {nullable: true})
  async product(@Arg("id", () => ID) id: string) {
    return (await this.productRepository.findOne(id)) ?? null;
  }
}
