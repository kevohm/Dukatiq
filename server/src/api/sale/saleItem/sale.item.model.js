import { sequelize, DataTypes } from '../../../config/database.js'

export const SaleItem = sequelize.define('SaleItem', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    selling_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    cost_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    profit: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
})
