
import { clearTokenCookies, setTokenCookies } from '../../utils/auth/token.cookie.js'
import { cookieConfigs, setCookie } from '../../utils/cookie/cookie.js'
import { COOKIE_KEYS } from '../../utils/cookie/cookie.keys.js'
import { AuthService } from './auth.service.js'
import { StatusCodes } from 'http-status-codes'

function getRefreshToken(req) {
    let payload = req.signedCookies?.[COOKIE_KEYS.refreshToken]
    if (!payload) {
        return res.status(StatusCodes.FORBIDDEN).json({
            success: false,
            message: 'Invalid refresh token',
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
    try {
        const response = await AuthService.signup(req.body)
        res.status(response.status).json({
            success: response.success,
            data: response.data,
            message: response.message,
        })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

export const me = async (req, res, next) => {
    res.status(StatusCodes.OK).json({
        success: true,
        data: req.user,
        message: 'Current user found',
    })
}

export const refresh = async (req, res) => {
    const t = await sequelize.transaction()
    try {
        const [id, token] = getRefreshToken(req)
        const response = await AuthService.refresh(
            {
                id,
                old_token: token,
                user_agent: req.headers['user-agent'],
                ip: req.ip,
            },
            t
        )

        setTokenCookies({
            res,
            refreshToken: response?.data?.refreshToken,
            accessToken: response?.data?.accessToken,
        })
        t.commit()
        res.status(response.status).json({
            success: response?.status,
            message: response?.message,
        })
    } catch (error) {
        t.rollback()
        throw error
    }
}

export const logout = async (req, res) => {
    const [id, token] = getRefreshToken(req)
    await AuthService.logout(id,token)
    await clearTokenCookies(res)
    res.sendStatus(204)
}
