import { db } from '../../../config/database.js'
import { ProductService } from './product.service.js'
import { StatusCodes } from 'http-status-codes'

export const getAllProducts = async (req, res) => {
    const response = await ProductService.findMany()
    res.status(response.status).json({
        success: response.success,
        data: response?.data,
        message: response?.message,
    })
}
export const getProduct = async (req, res) => {
    const response = await ProductService.findById(req.params.id)
    res.status(response.status).json({
        success: response.success,
        data: response?.data,
        message: response?.message,
    })
}

export const createProduct = async (req, res) => {

    const response = await ProductService.add(req.body)
    
    res.status(response.status).json({
        success: response.success,
        data: response?.data,
        message: response?.message,
    })
}

export const updateProduct = async (req, res) => {
    const response = await ProductService.update(req.params.id, req.body)
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}

export const deleteProduct = async (req, res) => {
    const response = await ProductService.remove(req.params.id)
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}

// export const updateStock = (req, res) => {
//   try {
//     const { stock, change_type } = req.body;
//     if (stock === undefined) {
//       return res.status(400).json({ success: false, error: 'Stock value is required' });
//     }
//     const product = ProductRepository.updateStock(req.params.id, stock, change_type || 'adjustment');
//     if (!product) {
//       return res.status(404).json({ success: false, error: 'Product not found' });
//     }
//     res.json({ success: true, data: product });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };
