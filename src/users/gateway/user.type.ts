import {Field, ID, ObjectType} from "type-graphql";

@ObjectType("User")
export default class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;
}
