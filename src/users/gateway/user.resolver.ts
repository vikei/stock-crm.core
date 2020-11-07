import {Service} from "typedi";
import {UserInputError} from "apollo-server";
import {Arg, Mutation, Query, Resolver} from "type-graphql";
import UserCredentialsInput from "./users.args";
import {NullableResponse, Response} from "../../library/lib/response-types";
import UsersStorage from "../storage/users.storage";
import UserType from "./user.type";

@Service()
@Resolver(() => UserType)
export default class UserResolver {
  constructor(public usersStorage: UsersStorage) {}

  @Mutation(() => UserType)
  async register(@Arg("input") input: UserCredentialsInput): Response<UserType> {
    return this.usersStorage.createUser(input);
  }

  @Mutation(() => UserType)
  async login(@Arg("input") {email, password}: UserCredentialsInput): Response<UserType> {
    const user = await this.usersStorage.findUser({email});

    if (!user || user.password !== password) {
      throw new UserInputError("Invalid credentials");
    }

    return user;
  }

  @Query(() => UserType, {nullable: true})
  async getUser(@Arg("id") id: string): NullableResponse<UserType> {
    return this.usersStorage.findUser({id: parseInt(id)});
  }
}
