import type { LocalAccessDoc } from '../../models/sessions/local-access'
import { BaseRepository } from '../base.repository'

export class LocalAccessRepository extends BaseRepository<LocalAccessDoc> {
    async findByUserId(user_id: string) {
        return this.collection
            .findOne({
                selector: {
                    user_id,
                },
            })
            .exec()
            .then((item) => item?.toJSON())
    }

}
