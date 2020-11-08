import {Service} from "typedi";
import {InjectRepository} from "typeorm-typedi-extensions";
import ProductEntity from "./product.entity";
import {FindConditions, Raw, Repository} from "typeorm/index";
import ProductDto from "./product.dto";
import ProductsQuery from "./products.query";

@Service()
export default class ProductsStorage {
  constructor(
    @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
  ) {}

  async create(dto: ProductDto): Promise<ProductEntity> {
    return this.productRepository.save(this.productRepository.create(dto));
  }

  async findMany(query: ProductsQuery): Promise<ProductEntity[]> {
    const where: FindConditions<ProductEntity> = {};

    if (query.name) {
      where.name = Raw(alias => `${alias} ILIKE '%${query.name}%'`);
    }

    return this.productRepository.find({where});
  }

  async findOne(query: FindConditions<ProductEntity>): Promise<ProductEntity | undefined> {
    return this.productRepository.findOne(query);
  }

  async updateById(id: number, dto: ProductDto): Promise<ProductEntity | undefined> {
    await this.productRepository.update(id, this.productRepository.create(dto));
    return this.findOne({id});
  }

  async deleteById(id: number): Promise<number | null> {
    const {affected} = await this.productRepository.delete(id);
    return affected ?? null;
  }
}
