import {UserDTO} from "../dto/user.dto";
import {User} from "../models/user.model";

export function toDto(user: User): UserDTO {
    return {id: user.id, username: user.username, password: user.password};
}