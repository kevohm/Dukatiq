import { DataTypes, sequelize } from '../../../config/database.js'


export const ProductUnit = sequelize.define('product_unit', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },

    product_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },

    unit_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },

    conversion_factor: {
        type: DataTypes.FLOAT,
        allowNull: false,
        // how many BASE units this equals
    },

    is_base_unit: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
})


