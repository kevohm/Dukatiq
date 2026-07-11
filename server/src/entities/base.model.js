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
        type: 'datetime',
        createDate: true,
    },

    updated_at: {
        type: 'datetime',
        updateDate: true,
    },
}
