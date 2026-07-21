

export const generateId = ()=>{
    return globalThis.crypto.randomUUID()
}


export const generateBaseValues = () => {
    const now = new Date().toISOString()
    return {
        id:generateId(),
        created_at: now,
        updated_at: now
    }
}
