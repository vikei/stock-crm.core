import {Service} from "typedi";
import UserEntity from "../storage/user.entity";
import UserType from "./user.type";

@Service()
export default class UsersPresenter {
  prepareUser(userEntity: UserEntity): UserType {
    return {...userEntity, id: userEntity.id.toString()};
  }
}
