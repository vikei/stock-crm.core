import {Field, InputType} from "type-graphql";

@InputType()
export class UserCredentialsInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
