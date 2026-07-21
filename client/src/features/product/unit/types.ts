

export type Unit = {
    id: string
    name: string
    created_at: string
    updated_at: string
}


export interface IUnitCreatePayload {
    name: string
}

export interface IUnitUpdatePayload {
    name?: string
}
