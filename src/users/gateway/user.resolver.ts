import {Service} from "typedi";
import {UserInputError} from "apollo-server";
import {Arg, Mutation, Query, Resolver} from "type-graphql";
import UserCredentialsInput from "./user-credentilas.input";
import {NullableResponse, Response} from "../../library/gateway/response";
import UsersStorage from "../storage/users.storage";
import UserType from "./user.type";
import UsersPresenter from "../lib/users.presenter";

@Service()
@Resolver(() => UserType)
export default class UserResolver {
  constructor(private usersStorage: UsersStorage, private usersPresenter: UsersPresenter) {}

  @Mutation(() => UserType)
  async register(@Arg("input") input: UserCredentialsInput): Response<UserType> {
    const userEntity = await this.usersStorage.create(input);
    return this.usersPresenter.prepareForResponse(userEntity);
  }

  @Mutation(() => UserType)
  async login(@Arg("input") {email, password}: UserCredentialsInput): Response<UserType> {
    const userEntity = await this.usersStorage.findOne({email});

    if (!userEntity || userEntity.password !== password) {
      throw new UserInputError("Invalid credentials");
    }

    return this.usersPresenter.prepareForResponse(userEntity);
  }

  @Query(() => UserType, {nullable: true})
  async getUser(@Arg("id") id: string): NullableResponse<UserType> {
    const userEntity = await this.usersStorage.findOne({id: parseInt(id)});

    if (!userEntity) {
      return null;
    }

    return this.usersPresenter.prepareForResponse(userEntity);
  }
}
