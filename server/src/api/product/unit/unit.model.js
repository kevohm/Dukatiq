import { DataTypes, sequelize } from '../../../config/database.js'

export const Unit = sequelize.define('unit', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },

    name: {
        type: DataTypes.STRING, // "crate", "bottle", "1kg", "tray"
        allowNull: false,
    },
})

