
import type { SaleItemDoc } from '../../models/sale/sale.items'
import { BaseRepository } from '../base.repository'

export class SaleItemRepository extends BaseRepository<SaleItemDoc> {
    findBySaleId(saleId: string) {
        return this.collection
            .find({
                selector: {
                    sale_id: saleId,
                },
            })
            .exec()
    }

}
