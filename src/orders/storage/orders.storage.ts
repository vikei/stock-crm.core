import {Service} from "typedi";
import {InjectRepository} from "typeorm-typedi-extensions";
import OrderEntity from "./order.entity";
import {FindConditions, Repository} from "typeorm/index";
import OrderDto from "./order.dto";

@Service()
export default class OrdersStorage {
  constructor(@InjectRepository(OrderEntity) public orderRepository: Repository<OrderEntity>) {}

  async create(dto: OrderDto): Promise<OrderEntity> {
    return this.orderRepository.save(this.orderRepository.create(dto));
  }

  async updateById(id: number, dto: OrderDto): Promise<OrderEntity | undefined> {
    await this.orderRepository.update(id, dto);
    return this.findOne({id});
  }

  async find(): Promise<OrderEntity[]> {
    return this.orderRepository.find();
  }

  async findOne(query: FindConditions<OrderEntity>): Promise<OrderEntity | undefined> {
    return this.orderRepository.findOne(query);
  }

  async deleteById(id: number): Promise<number | null> {
    const {affected} = await this.orderRepository.delete(id);
    return affected ?? null;
  }
}
