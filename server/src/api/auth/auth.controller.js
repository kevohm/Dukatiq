import { AppError, ERROR_CODES } from '../../errors/app.error.js'
import {
    clearTokenCookies,
    setTokenCookies,
} from '../../utils/auth/token.cookie.js'
import { cookieConfigs, setCookie } from '../../utils/cookie/cookie.js'
import { COOKIE_KEYS } from '../../utils/cookie/cookie.keys.js'
import { AuthService } from './auth.service.js'
import { StatusCodes } from 'http-status-codes'
import { RecoveryService } from './recovery/recovery.service.js'
import { db } from '../../config/database.js'

function getRefreshToken(req) {
    let payload = req.signedCookies?.[COOKIE_KEYS.refreshToken]
    if (!payload) {
        throw new AppError({
            message: 'Invalid refresh token',
            code: ERROR_CODES.AUTH.INVALID_REFRESH_TOKEN,
            status: 404,
        })
    }

    return payload?.split(':')
}

export const login = async (req, res, next) => {
    try {
        const response = await AuthService.login({
            ...req.body,
            user_agent: req.headers['user-agent'],
            ip: req.ip,
        })

        setTokenCookies({
            res,
            refreshToken: response?.data?.refreshToken,
            accessToken: response?.data?.accessToken,
        })

        res.status(response.status).json({
            success: response.success,
            data: response?.data?.user,
            message: response.message,
        })
    } catch (err) {
        res.status(401).json({ message: err.message })
    }
}

export const signup = async (req, res) => {
    const response = await AuthService.signup(req.body)
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}

export const createLocalAccess = async (req, res) => {
    const response = await db.transaction(async(tx)=>{
        const userId = req.user?.id
        return await RecoveryService.setLocalAccess(userId, req.body, tx)
    })

    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}

export const me = async (req, res, next) => {
    res.status(StatusCodes.OK).json({
        success: true,
        data: req.user,
        message: 'Current user found',
    })
}

export const refresh = async (req, res) => {
    const [id, token] = getRefreshToken(req)
    const response = await AuthService.refresh({
        id,
        old_token: token,
        user_agent: req.headers['user-agent'],
        ip: req.ip,
    })

    setTokenCookies({
        res,
        refreshToken: response?.data?.refreshToken,
        accessToken: response?.data?.accessToken,
    })
    res.status(response.status).json({
        success: response?.status,
        message: response?.message,
    })
}

export const logout = async (req, res) => {
    const [id, token] = getRefreshToken(req)
    await AuthService.logout(id, token)
    await clearTokenCookies(res)
    res.sendStatus(204)
}
