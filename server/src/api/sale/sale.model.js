import { sequelize, DataTypes } from '../../config/database.js'
import { Product } from '../product/product.model.js'
import { SaleItem } from './saleItem/sale.item.model.js'

export const Sale = sequelize.define('Sale', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    // shop_id: {
    //     type: DataTypes.UUID,
    //     allowNull: false,
    // },
    // user_id: {
    //     type: DataTypes.UUID,
    //     allowNull: true,
    // },
    total_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    total_profit: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    payment_method: {
        type: DataTypes.ENUM('cash', 'mpesa', 'card', 'credit'),
        allowNull: false,
        defaultValue: 'cash',
    },
})

// Associations
SaleItem.belongsTo(Sale, { foreignKey: 'sale_id', as:"items" })
Sale.hasMany(SaleItem, { foreignKey: 'sale_id', as: 'items' })

SaleItem.belongsTo(Product, { foreignKey: 'product_id' })
Product.hasMany(SaleItem, { foreignKey: 'product_id' })
