import {Service} from "typedi";
import {Arg, Mutation, Query, Resolver} from "type-graphql";
import {InjectRepository} from "typeorm-typedi-extensions";
import UserEntity from "./user.entity";
import {Repository} from "typeorm/index";
import UserCredentials from "./users.args";

@Service()
@Resolver()
export default class UserResolver {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}

  @Mutation(() => UserEntity)
  async register(@Arg("input") input: UserCredentials): Promise<UserEntity> {
    const {id} = await this.userRepository.save(input);
    return (await this.userRepository.findOne(id)) as UserEntity;
  }

  @Mutation(() => UserEntity, {nullable: true})
  async login(@Arg("input") {email, password}: UserCredentials): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({email});

    if (!user) {
      return null;
    }

    if (user.password !== password) {
      return null;
    }

    return user;
  }

  @Query(() => UserEntity, {nullable: true})
  async getUser(@Arg("id") id: string): Promise<UserEntity | null> {
    return (await this.userRepository.findOne(id)) ?? null;
  }
}
