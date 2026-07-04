import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/database.js'
import { Product } from '../product/product.model.js'
import { Unit } from '../product/unit/unit.model.js'

export const Inventory = sequelize.define('Inventory', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    type: {
        type: DataTypes.ENUM('stock_in', 'stock_out', 'adjustment'),
        allowNull: false,
    },

    quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },

    normalized_quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },

    adjustment_type: {
        type: DataTypes.ENUM('increase', 'decrease'),
        allowNull: true,
        defaultValue: null
    },

    reference_type: {
        type: DataTypes.ENUM(
            'purchase',
            'sale',
            'adjustment',
            'transfer',
            'return'
        ),
        allowNull: true,
    },
    reference_id: {
        type: DataTypes.UUID,
    },
})

// Associations
Inventory.belongsTo(Product, { foreignKey: 'product_id' })
Product.hasMany(Inventory, { foreignKey: 'product_id' })

Inventory.belongsTo(Unit, { foreignKey: 'unit_id' })
Unit.hasMany(Inventory, { foreignKey: 'unit_id' })
