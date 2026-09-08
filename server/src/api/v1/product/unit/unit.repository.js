import { and, eq } from 'drizzle-orm'
import { db } from '../../../../config/database.js'
import { units } from '../../../../db/schema.js'
import { AppError, ERROR_CODES } from '../../../../errors/app.error.js'

export class UnitRepository {
    static async getAll() { return db.select().from(units) }
    static async getById(id) {
        const [unit] = await db.select().from(units).where(eq(units.id, id))
        if (!unit) throw new AppError({ message: 'Unit not found', code: ERROR_CODES.UNIT.NOT_FOUND, status: 404, meta: { resource: 'unit', id } })
        return unit
    }
    static async getByName(name, client = db) { const [unit] = await client.select().from(units).where(eq(units.name, name)); return unit }
    static async create(data, client = db) { const [unit] = await client.insert(units).values(data).returning(); return unit }
    static async findOrCreate(data, client = db) { return (await this.getByName(data.name, client)) ?? this.create(data, client) }
    static async delete(id) {
        const deleted = await db.delete(units).where(eq(units.id, id)).returning({ id: units.id })
        if (!deleted.length) throw new AppError({ message: 'Failed to delete unit', code: ERROR_CODES.UNIT.DELETE_FAILED, status: 500, meta: { resource: 'unit', id } })
        return deleted[0]
    }
}
