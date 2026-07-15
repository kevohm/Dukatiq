import { EntitySchema } from 'typeorm'
import { baseColumns } from '../base.model.js'

export const RefreshToken = new EntitySchema({
    name: 'RefreshToken',
    tableName: 'refresh_token',

    columns: {
        ...baseColumns,

        token_hash: {
            type: String,
            unique: true,
        },

        expires_at: {
            type: 'timestamp'
        },

        revoked_at: {
           type: 'timestamp',
            nullable: true,
        },

        user_agent: {
            type: String,
            nullable: true,
        },

        ip: {
            type: String,
            nullable: true,
        },
    },

    relations: {
        user: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: {
                name: 'user_id',
            },
            inverseSide: 'refreshTokens',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
    },
})
