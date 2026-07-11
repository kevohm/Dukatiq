import { EntitySchema } from 'typeorm'
import { baseColumns } from '../base.model.js'

export const User =  new EntitySchema({
    name: 'User',
    tableName: 'user',

    columns: {
        ...baseColumns,

        first_name: {
            type: String,
        },

        last_name: {
            type: String,
        },

        email: {
            type: String,
            unique: true,
        },

        password: {
            type: String,
        },
    },

    relations: {
        refreshTokens: {
            type: 'one-to-many',
            target: 'RefreshToken',
            inverseSide: 'user',
        },
    },
})
