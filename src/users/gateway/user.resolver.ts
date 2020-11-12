import {Service} from "typedi";
import {UserInputError} from "apollo-server";
import {Arg, Mutation, Query, Resolver} from "type-graphql";
import UserCredentialsInput from "./user-credentilas.input";
import {NullableResponse, Response} from "../../library/gateway/response";
import UsersStorage from "../storage/users.storage";
import UserType from "./user.type";
import UsersPresenter from "../lib/users.presenter";
import comparePasswords from "../lib/compare-passwords";

@Service()
@Resolver(() => UserType)
export default class UserResolver {
  constructor(private usersStorage: UsersStorage, private usersPresenter: UsersPresenter) {}

  @Mutation(() => UserType)
  async register(@Arg("input") input: UserCredentialsInput): Response<UserType> {
    const user = await this.usersStorage.create(input);
    return this.usersPresenter.prepareForResponse(user);
  }

  @Mutation(() => UserType)
  async login(@Arg("input") {email, password}: UserCredentialsInput): Response<UserType> {
    const user = await this.usersStorage.findOne({email});

    if (!user || !comparePasswords(user.password, password)) {
      throw new UserInputError("Invalid credentials");
    }

    return this.usersPresenter.prepareForResponse(user);
  }

  @Query(() => UserType, {nullable: true})
  async getUser(@Arg("id") id: string): NullableResponse<UserType> {
    const user = await this.usersStorage.findOne({id: parseInt(id)});

    if (!user) {
      return null;
    }

    return this.usersPresenter.prepareForResponse(user);
  }
}
