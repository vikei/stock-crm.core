import {Field, InputType} from "type-graphql";

@InputType()
export default class UserCredentialsInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
