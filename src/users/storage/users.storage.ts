import {Service} from "typedi";
import {InjectRepository} from "typeorm-typedi-extensions";
import UserEntity from "./user.entity";
import {FindConditions, Repository} from "typeorm/index";
import {UserDto} from "./user.dto";
import {UserQuery} from "./user.query";

@Service()
export default class UsersStorage {
  constructor(@InjectRepository(UserEntity) public userRepository: Repository<UserEntity>) {}

  async createUser(dto: UserDto): Promise<UserEntity> {
    return this.userRepository.save(dto);
  }

  async findUser(query: UserQuery): Promise<UserEntity | undefined> {
    const where: FindConditions<UserEntity> = {};

    if (query.email) {
      where.email = query.email;
    }

    return this.userRepository.findOne({where});
  }
}
