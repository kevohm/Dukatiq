import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const Expense = sequelize.define(
    'Expense',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        category: {
            type: DataTypes.ENUM('rent', 'transport', 'utilities', 'misc'),
            defaultValue: 'misc',
        },
    }
)
