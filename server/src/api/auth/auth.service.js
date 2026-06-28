import { StatusCodes } from 'http-status-codes'
import { AuthValidator } from './auth.validator.js'
import { AuthRepository } from './auth.repository.js'
import { verifyPassword } from '../../utils/auth/password.js'
import {
    generateToken,
    hashToken,
    verifyToken,
} from '../../utils/auth/crypto.js'
import dayjs from 'dayjs'
import { signAccessToken } from '../../utils/auth/jwt.js'
import { AuthSerializer } from './auth.serializer.js'

export class AuthService {
    static async signup(body) {
        const data = await AuthValidator.signupSchema.parseAsync(body)

        const existing = await AuthRepository.findByEmail(data.email)
        if (existing) {
            return {
                status: StatusCodes.BAD_REQUEST,
                success: false,
                message: 'Account already exists',
            }
        }

        const user = await AuthRepository.create(data)

         return {
                status: StatusCodes.CREATED,
                success: true,
                data: AuthSerializer.baseSerializer(user),
                message: 'Account created successfully',
            }
    }

    static async login(body) {
        const data = await AuthValidator.loginSchema.parseAsync(body)
        const user = await AuthRepository.findByEmail(data.email)
        if (!user) {
            return {
                status: StatusCodes.UNAUTHORIZED,
                success: false,
                message: 'Invalid credentials',
            }
        }

        const valid = await verifyPassword(user.password, data.password)
        if (!valid) {
            return {
                status: StatusCodes.UNAUTHORIZED,
                success: false,
                message: 'Invalid credentials',
            }
        }

        const refreshToken = generateToken()
        const tokenHash = await hashToken(refreshToken)

        const rt = await AuthRepository.saveRefreshToken({
            user_id: user.id,
            token_hash: tokenHash,
            expires_at: dayjs().add(7, 'days').toDate(),
            user_agent: body?.user_agent,
            ip: body?.ip,
        })

        const accessToken = signAccessToken(user)

        return {
            status: StatusCodes.OK,
            success: true,
            data: {
                accessToken,
                refreshToken: `${rt?.id}:${refreshToken}`,
                user: AuthSerializer.baseSerializer(user),
            },
            message: 'Login successfull',
        }
    }

    static async refresh(
        { id, old_token, user_agent, ip },
        transaction = null
    ) {
        const token = await AuthRepository.findActiveTokenById(id, transaction)
        if (!token) {
            return {
                status: StatusCodes.FORBIDDEN,
                success: false,
                message: 'Invalid refresh token',
            }
        }

        const isTokenMatch = await verifyToken(token.token_hash, old_token)

        if (!isTokenMatch) {
            return {
                status: StatusCodes.FORBIDDEN,
                success: false,
                message: 'Invalid refresh token',
            }
        }

        // 🔁 rotation (VERY IMPORTANT)
        await AuthRepository.revokeToken(token.id, transaction)

        const newRefreshToken = generateToken()
        const newHash = await hashToken(newRefreshToken)

        await AuthRepository.saveRefreshToken(
            {
                user_id: token.user_id,
                token_hash: newHash,
                expires_at: dayjs().add(7, 'days').toDate(),
                user_agent,
                ip,
            },
            transaction
        )

        const user = { id: token.user_id }
        const accessToken = signAccessToken(user)

        return {
            status: StatusCodes.OK,
            success: true,
            data: { accessToken, refreshToken: newRefreshToken },
            message: 'Token refreshed',
        }
    }

    static async logout(id, refreshToken) {
        const token = await AuthRepository.findActiveTokenById(id)
        if (!token) {
            return {
                status: StatusCodes.NO_CONTENT,
                success: true,
            }
        }
        await AuthRepository.revokeToken(token.id)
        
        return {
            status: StatusCodes.NO_CONTENT,
            success: true,
        }
    }
}
