import { StatusCodes } from 'http-status-codes'
import { ProductUnitRepository } from './product.unit.repository.js'
import { ProductUnitValidator } from './product.unit.validator.js'
import { validateDataAndReturn } from '../../../../utils/zod/validate.js'
import { AppError, ERROR_CODES } from '../../../../errors/app.error.js'
import { ProductService } from '../product.service.js'
import { UnitService } from '../unit/unit.service.js'

export class ProductUnitService {
    static async findManyByProduct(body) {
        const { data, success, error } = await ProductUnitValidator.baseSchema
            .pick({ product_id: true })
            .safeParseAsync(body)
        if (!success) {
            return {
                status: StatusCodes.BAD_REQUEST,
                success: false,
                message: error?.issues[0]?.message ?? 'Validation error',
            }
        }
        const results = await ProductUnitRepository.getByProduct(
            data?.product_id
        )
        return {
            status: StatusCodes.OK,
            success: true,
            data: results,
            message: 'Product units found',
        }
    }

    static async findManyByProductAndUnit(body) {
        const { data, success, error } = await ProductUnitValidator.baseSchema
            .pick({ product_id: true, unit_id: true })
            .safeParseAsync(body)
        if (!success) {
            return {
                status: StatusCodes.BAD_REQUEST,
                success: false,
                message: error?.issues[0]?.message ?? 'Validation error',
            }
        }
        const results = await ProductUnitRepository.getByUnit(
            data?.product_id,
            data?.unit_id
        )
        return {
            status: StatusCodes.OK,
            success: true,
            data: results,
            message: 'Product units found',
        }
    }
    static async findBaseUnit(body) {
        const response = await validateDataAndReturn(
            ProductUnitValidator.productSchema,
            body
        )
        if (!response?.success) {
            return response
        }
        const unit = await ProductUnitRepository.getBaseUnit(
            response?.data?.product_id
        )
        if (!unit) {
            throw new AppError({
                message: 'Product unit not found',
                code: ERROR_CODES.PRODUCT_UNIT.NOT_FOUND,
                status: StatusCodes.NOT_FOUND,
                meta: {
                    resource: 'product_unit',
                    product_id: response?.data?.product_id,
                },
            })
        }
        return {
            status: StatusCodes.OK,
            success: true,
            data: unit,
            message: 'Product unit found',
        }
    }

    static async findById(id) {
        const productUnit = await ProductUnitRepository.findById(id)
        if (!productUnit) {
            throw new AppError({
                message: 'Product unit not found',
                code: ERROR_CODES.PRODUCT_UNIT.NOT_FOUND,
                status: StatusCodes.NOT_FOUND,
                meta: { resource: 'product_unit', id },
            })
        }
        return {
            status: StatusCodes.OK,
            success: true,
            data: productUnit,
            message: 'Product unit found',
        }
    }
    static async findByIdOrThrow(id) {
        const response = await this.findById(id)
        if (!response?.success) {
            throw new AppError({
                message: response?.message ?? 'Product unit not found',
                code: ERROR_CODES.PRODUCT_UNIT.NOT_FOUND,
                status: StatusCodes.NOT_FOUND,
                meta: { resource: 'product_unit', id },
            })
        }
        return response?.data?.toJSON()
    }
    static async add(body) {
        const data = await ProductUnitValidator.createSchema.parseAsync(body)
        await ProductService.findByIdOrThrow(data.product_id)
        await UnitService.findById(data?.unit_id)
        
        const unit = await ProductUnitRepository.findOrCreate(data)

        return {
            status: StatusCodes.CREATED,
            success: true,
            data: unit,
            message: 'Successfully added',
        }
    }

    static async update(id, body) {
        const productUnit = await this.findByIdOrThrow(id)

        const data = await ProductUnitValidator.updateSchema.parseAsync(body)

        if (data.is_base_unit === false) {
            const baseCount = await ProductUnitRepository.countActiveUnits(
                productUnit?.product_id
            )

            if (baseCount === 1) {
                throw new AppError({
                    message:
                        'Cannot remove the only base unit. Set another base unit first.',
                    code: ERROR_CODES.PRODUCT_UNIT.ONLY_BASE_UNIT,
                    status: StatusCodes.BAD_REQUEST,
                    meta: {
                        resource: 'product_unit',
                        product_id: productUnit?.product_id,
                    },
                })
            }
        }

        const result = await ProductUnitRepository.update(id, data)
        if (result[0] === 0) {
            throw new AppError({
                message: 'Failed to update product unit',
                code: ERROR_CODES.PRODUCT_UNIT.UPDATE_FAILED,
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                meta: { resource: 'product_unit', id },
            })
        }
        return {
            status: StatusCodes.NO_CONTENT,
            success: true,
            data: result,
            message: 'Product updated',
        }
    }

    static async remove(id) {
        const responseData = await this.findById(id)
        if (!responseData?.success) {
            throw new AppError({
                message: responseData?.message ?? 'Product unit not found',
                code: ERROR_CODES.PRODUCT_UNIT.NOT_FOUND,
                status: StatusCodes.NOT_FOUND,
                meta: { resource: 'product_unit', id },
            })
        }
        const response = await ProductUnitRepository.delete(id)
        if (!response?.success) {
            throw new AppError({
                message: response?.message ?? 'Failed to delete product unit',
                code: response?.message?.includes('only unit')
                    ? ERROR_CODES.PRODUCT_UNIT.CANNOT_DELETE_BASE
                    : ERROR_CODES.PRODUCT_UNIT.DELETE_FAILED,
                status: response?.message
                    ? StatusCodes.BAD_REQUEST
                    : StatusCodes.INTERNAL_SERVER_ERROR,
                meta: { resource: 'product_unit', id },
            })
        }
        return {
            status: StatusCodes.NO_CONTENT,
            success: true,
            data: responseData?.data,
            message: 'Product unit deleted',
        }
    }
}
