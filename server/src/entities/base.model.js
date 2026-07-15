// @ts-check

/**
 * Common columns shared by all entities.
 */
export const baseColumns = {
    id: {
        primary: true,
        generated: 'uuid',
        type: 'uuid',
    },

    created_at: {
        type: 'timestamp',
        createDate: true,
        default: () => 'CURRENT_TIMESTAMP',
    },

    updated_at: {
        type: 'timestamp',
        updateDate: true,
        default: () => 'CURRENT_TIMESTAMP',
    },
}
