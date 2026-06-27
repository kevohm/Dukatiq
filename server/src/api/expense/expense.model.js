import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/database.js'
import { ExpenseCategory } from './category/expense.category.model.js'

export const Expense = sequelize.define('Expense', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
})

Expense.belongsTo(ExpenseCategory, { foreignKey: 'category_id' })
ExpenseCategory.hasMany(Expense, { foreignKey: 'category_id' })
