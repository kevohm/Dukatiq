import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/database.js'
import { Category } from './category/product.category.model.js'
import { Unit } from './unit/unit.model.js'
import { ProductUnit } from './product-unit/product.unit.model.js'


export const Product = sequelize.define('product', {
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

    image_url: DataTypes.STRING,

    image_key: DataTypes.STRING
})

// Associations
Product.belongsTo(Category, { foreignKey: 'category_id' })
Category.hasMany(Product, { foreignKey: 'category_id' })

Product.belongsToMany(Unit, {
    through: ProductUnit,
    foreignKey: 'product_id',
})

Unit.belongsToMany(Product, {
    through: ProductUnit,
    foreignKey: 'unit_id',
})
