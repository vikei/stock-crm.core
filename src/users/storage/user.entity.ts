import {Column, Entity, PrimaryGeneratedColumn} from "typeorm/index";

@Entity()
export default class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;
}
