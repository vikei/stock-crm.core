import {Service} from "typedi";
import {UserInputError} from "apollo-server";
import {Arg, Mutation, Query, Resolver} from "type-graphql";
import {InjectRepository} from "typeorm-typedi-extensions";
import UserEntity from "./user.entity";
import {Repository} from "typeorm/index";
import UserCredentials from "./users.args";
import {NullableResponse, Response} from "../library/lib/response-types";

@Service()
@Resolver()
export default class UserResolver {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}

  @Mutation(() => UserEntity)
  async register(@Arg("input") input: UserCredentials): Response<UserEntity> {
    const {id} = await this.userRepository.save(input);
    return (await this.userRepository.findOne(id))!;
  }

  @Mutation(() => UserEntity)
  async login(@Arg("input") {email, password}: UserCredentials): Response<UserEntity> {
    const user = await this.userRepository.findOne({email});

    if (!user || user.password !== password) {
      throw new UserInputError("Invalid credentials");
    }

    return user;
  }

  @Query(() => UserEntity, {nullable: true})
  async getUser(@Arg("id") id: string): NullableResponse<UserEntity> {
    return await this.userRepository.findOne(id);
  }
}
