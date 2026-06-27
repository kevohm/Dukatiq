import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'
import { Product } from '../api/product/product.model.js'

export const Inventory = sequelize.define('Inventory', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    shop_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('stock_in', 'stock_out', 'adjustment'),
        allowNull: false,
    },
    quantity_change: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    reference_type: {
        type: DataTypes.STRING, // "sale", "restock", "manual"
        allowNull: true,
    },
    reference_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
})

// Associations
InventoryLog.belongsTo(Product, { foreignKey: 'product_id' })
Product.hasMany(Inventory, { foreignKey: 'product_id' })
