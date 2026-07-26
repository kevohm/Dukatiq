
import { getRepositories } from "../repositories/index.js";
import { UserRepository } from "../repositories/user.repository.js"
import { BaseService } from "./base.service.js";

export class UserService extends BaseService<UserRepository> {

     constructor() {
            super(async () => {
                const { userRepository } = await getRepositories()
                return userRepository
            })
        }
}