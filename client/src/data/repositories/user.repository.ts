import type { UserDoc } from "../models/user";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<UserDoc> {}
