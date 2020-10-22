import {Field, InputType} from "type-graphql";

@InputType()
export default class UserCredentials {
  @Field()
  email: string;

  @Field()
  password: string;
}
