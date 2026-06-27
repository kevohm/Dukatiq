import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/database.js'

export const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})

export const RefreshToken = sequelize.define('RefreshToken', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },

    token_hash: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },

    revoked_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },

    user_agent: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    ip: {
        type: DataTypes.STRING,
        allowNull: true,
    },
})

RefreshToken.belongsTo(User, {
    foreignKey: 'user_id',
})

User.hasMany(RefreshToken, {
    foreignKey: 'user_id',
})
