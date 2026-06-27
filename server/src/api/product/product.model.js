import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/database.js'
import { Category } from './category/product.category.model.js'

export const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    // shop_id: {
    //     type: DataTypes.UUID,
    //     allowNull: false,
    // },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cost_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    selling_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    stock_quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    low_stock_threshold: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
    },
})

// Associations
Product.belongsTo(Category, { foreignKey: 'category_id' })
Category.hasMany(Product, { foreignKey: 'category_id' })
