import { Product } from '../../../src/api/product/product.model.js'
import { Category } from '../../../src/api/product/category/product.category.model.js'

describe('ProductRepository', () => {
    it('should create product with category', async () => {})
    it('should link product to category', async () => {
        const category = await Category.create({ name: 'Food' })

        const product = await Product.create({
            name: 'Bread',
            cost_price: 100,
            selling_price: 400,
            category_id: category.id,
        })

        expect(product.category_id).toBe(category.id)
    })
    it('should fetch products with category', async () => {})
    it('should update product', async () => {})
})
