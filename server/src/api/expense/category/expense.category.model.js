import { DataTypes } from 'sequelize'
import { sequelize } from '../../../config/database.js'

export const ExpenseCategory = sequelize.define('ExpenseCategory', {
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
        unique: true,
    },
})

