import { and, eq, sql } from 'drizzle-orm'
import { db } from '../../../config/database.js'
import {
    attributeValues,
    brands,
    productCategories,
    products,
    productUnits,
    productVariants,
    units,
    variantAttributeValues,
} from '../../../db/schema.js'
import { ProductCategoryRepository } from './category/product.category.repository.js'
import { ProductBrandRepository } from './brand/product.brand.repository.js'
import { UnitRepository } from './unit/unit.repository.js'
import { AppError, ERROR_CODES } from '../../../errors/app.error.js'
import { ProductVariantRepository } from '../../v2/product/variant/product.variant.repository.js'

const productRow = {
    id: products.id,
    created_at: products.created_at,
    updated_at: products.updated_at,
    name: products.name,
    cost_price: products.cost_price,
    selling_price: products.selling_price,
    stock_quantity: products.stock_quantity,
    low_stock_threshold: products.low_stock_threshold,
    image_url: products.image_url,
    image_key: products.image_key,
    category_id: products.category_id,
    brand_id: products.brand_id,
    category: {
        id: productCategories.id,
        name: productCategories.name,
    },
    brand: {
        id: brands.id,
        name: brands.name,
    },
}
export class ProductRepository {
    static async getAll() {
        const rows = await db
            .select(productRow)
            .from(products)
            .leftJoin(
                productCategories,
                eq(products.category_id, productCategories.id)
            )
            .leftJoin(brands, eq(products.brand_id, brands.id))
        return Promise.all(rows.map((product) => this.#withUnits(product)))
    }
    static async #withUnits(product, client = db) {
        return {
            ...product,
            productUnits: await client
                .select({
                    id: productUnits.id,
                    conversion_factor: productUnits.conversion_factor,
                    is_base_unit: productUnits.is_base_unit,
                    product_id: productUnits.product_id,
                    unit_id: productUnits.unit_id,
                    units: {
                        id: units.id,
                        name: units.name,
                    },
                })
                .from(productUnits)
                .leftJoin(units, eq(productUnits.unit_id, units.id))
                .where(eq(productUnits.product_id, product.id)),
            variants: await client
                .select({
                    id: productVariants.id,
                    product_id: productVariants.product_id,
                    sku: productVariants.sku,
                    cost_price: productVariants.cost_price,
                    selling_price: productVariants.selling_price,
                    stock_quantity: productVariants.stock_quantity,
                    low_stock_threshold: productVariants.low_stock_threshold,
                    image_key: productVariants.image_key,
                    image_url: productVariants.image_url,
                })
                .from(productVariants)
                .where(eq(productVariants.product_id, product.id)),
        }
    }
    static async getById(id, client = db) {
        const [product] = await client
            .select(productRow)
            .from(products)
            .leftJoin(
                productCategories,
                eq(products.category_id, productCategories.id)
            )
            .leftJoin(brands, eq(products.brand_id, brands.id))
            .where(eq(products.id, id))
        if (!product)
            throw new AppError({
                message: 'Product not found',
                code: ERROR_CODES.PRODUCT.NOT_FOUND,
                status: 404,
                meta: { resource: 'product', id },
            })
        return this.#withUnits(product, client)
    }
    static async create(data, client = db) {
        const category = await ProductCategoryRepository.findOrCreate(
            { name: data.category },
            client
        )
        const brand = await ProductBrandRepository.findOrCreate(
            { name: data.brand },
            client
        )
        const {
            stock_quantity: _stock,
            units: requestedUnits,
            variants: requestedVariants,
            category: _category,
            brand: _brand,
            ...productData
        } = data
        const [product] = await client
            .insert(products)
            .values({
                ...productData,
                stock_quantity: 0,
                category_id: category.id,
                brand_id: brand.id,
            })
            .returning()

        for (const item of requestedUnits) {
            const unit = await UnitRepository.findOrCreate(
                { name: item.unit_name },
                client
            )
            await client.insert(productUnits).values({
                product_id: product.id,
                unit_id: unit.id,
                conversion_factor: item.conversion_factor,
                is_base_unit: item.is_base_unit ?? false,
            })
        }

        for (const item of requestedVariants) {
            await ProductVariantRepository.create(
                { ...item, product_id: product.id, name:product?.name},
                client
            )
        }
        return await this.getById(product.id, client)
    }
    static async update(id, data) {
        const updated = await db
            .update(products)
            .set({ ...data, updated_at: new Date() })
            .where(eq(products.id, id))
            .returning({ id: products.id })
        if (!updated.length)
            throw new AppError({
                message: 'Product not found',
                code: ERROR_CODES.PRODUCT.NOT_FOUND,
                status: 404,
                meta: { resource: 'product', id },
            })
        return this.getById(id)
    }
    static async delete(id) {
        const row = await db
            .delete(products)
            .where(eq(products.id, id))
            .returning({ id: products.id })
        if (!row.length)
            throw new AppError({
                message: 'Failed to delete product',
                code: ERROR_CODES.PRODUCT.DELETE_FAILED,
                status: 500,
                meta: { resource: 'product', id },
            })
        return true
    }
    static async applyStockChange({ id, quantity, client = db }) {
        await client
            .update(products)
            .set({
                stock_quantity: sql`${products.stock_quantity} + ${quantity}`,
                updated_at: new Date(),
            })
            .where(eq(products.id, id))
        return this.getById(id)
    }
}
