import { verifyAccessToken } from '../utils/auth/jwt.js'
import { COOKIE_KEYS } from '../utils/cookie/cookie.keys.js'
import { StatusCodes } from 'http-status-codes'
import { AuthRepository } from '../api/v1/auth/auth.repository.js'

export const requireAuth = async (req, res, next) => {
    try {
        
        
        // console.log(req.signedCookies)

        const accessToken = req.signedCookies?.[COOKIE_KEYS.accessToken]

        if (!accessToken) {
            return res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                code: 'AUTH_TOKEN_MISSING',
                message:
                    'Your session is invalid or has expired. Please sign in again.',
            })
        }

        let payload

        try {
            payload = verifyAccessToken(accessToken)
        } catch (err) {
            return res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                code: 'AUTH_TOKEN_INVALID',
                message: 'Your session is invalid or has expired.',
            })
        }

        const user = await AuthRepository.findById(payload?.sub)

        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                code: 'AUTH_USER_NOT_FOUND',
                message: 'This account no longer exists or has been removed.',
            })
        }

        req.user = {
            id: user.id,
            full_name: `${user.first_name} ${user.last_name}`,
            email: user.email,
        }

        next()
    } catch (err) {

        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            code: 'AUTH_UNKNOWN_ERROR',
            message: 'Authentication failed. Please try again.',
        })
    }
}
