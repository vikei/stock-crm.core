import {Field, ID, ObjectType} from "type-graphql";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm/index";

@ObjectType()
@Entity()
export default class UserEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  email: string;

  @Column()
  password: string;
}
