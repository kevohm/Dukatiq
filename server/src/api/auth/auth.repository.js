import { Op } from 'sequelize'
import { RefreshToken, User } from './auth.model.js'
import { hash } from 'argon2'

export class AuthRepository {
    // Get account by ID
    static async findById(id) {
        return await User.findByPk(id)
    }

    static async findByEmail(email, transaction = null) {
        return await User.findOne({ where: { email }, transaction })
    }

    // sign up
    static async create(data, transaction = null) {
        const hashed = await hashPassword(data.password)
        return await User.create({ ...data, password }, { transaction })
    }

    static async findOrCreate(data, transaction = null) {
        const category = await this.getByName(data?.name, transaction)
        if (!category) {
            return await this.create(data, transaction)
        }
        return category
    }

    // Update account
    static async update(id, data) {
        const account = await User.update(data, { where: { id } })
        return account
    }

    static async delete(id) {
        return await User.destroy({ where: { id } })
    }

    static async saveRefreshToken(data, transaction = null) {
        console.log(data)
        return await RefreshToken.create(
            {
                ...data,
                revoked_at: null,
            },
            {
                transaction,
            }
        )
    }

    static async findValidTokens(transaction = null) {
        return await RefreshToken.findAll({
            where: {
                revoked_at: null,
                expires_at: {
                    [Op.gt]: new Date(),
                },
            },
            transaction,
        })
    }
    static async findActiveTokenById(id, transaction = null) {
        return await RefreshToken.findOne({
            where: {
                id,
                revoked_at: null,
                expires_at: {
                    [Op.gt]: new Date(),
                },
            },
            transaction,
        })
    }

    static async revokeToken(id, transaction = null) {
        return await RefreshToken.update(
            { revoked_at: new Date() },
            { where: { id }, transaction }
        )
    }
}
