import {
    setCookie,
    clearCookie,
    cookieConfigs,
    COOKIE_KEYS,
} from '../cookie/index.js'

class Token {
    static setRefreshTokenCookie(res, refreshToken) {
        setCookie(
            res,
            COOKIE_KEYS.refreshToken,
            refreshToken,
            cookieConfigs.refreshToken
        )
    }

    static setAccessTokenCookie(res, accessToken) {
        setCookie(
            res,
            COOKIE_KEYS.accessToken,
            accessToken,
            cookieConfigs.accessToken
        )
    }

    static removeRefreshTokenCookie(res) {
        clearCookie(res, COOKIE_KEYS.refreshToken, cookieConfigs.refreshToken)
    }

    static removeAccessTokenCookie(res) {
        clearCookie(res, COOKIE_KEYS.accessToken, cookieConfigs.accessToken)
    }
}

/**
 * Set BOTH tokens (access + refresh)
 */
export const setTokenCookies = ({ res, refreshToken, accessToken }) => {
    if (!res) throw new Error('Response object is required')


    if (refreshToken) {
        Token.setRefreshTokenCookie(res, refreshToken)
    }

    if (accessToken) {
        Token.setAccessTokenCookie(res, accessToken)
    }
}

/**
 * Set ONLY refresh token
 * (used in refresh rotation or login flows)
 */
export const setRefreshTokenCookie = ({ res, refreshToken }) => {
    if (!res) throw new Error('Response object is required')
    if (!refreshToken) return

    Token.setRefreshTokenCookie(res, refreshToken)
}

/**
 * Set ONLY access token
 * (used after refresh endpoint)
 */
export const setAccessTokenCookie = ({ res, accessToken }) => {
    if (!res) throw new Error('Response object is required')
    if (!accessToken) return

    Token.setAccessTokenCookie(res, accessToken)
}

/**
 * Clear BOTH tokens (logout)
 */
export const clearTokenCookies = (res) => {
    if (!res) throw new Error('Response object is required')

    Token.removeAccessTokenCookie(res)
    Token.removeRefreshTokenCookie(res)
}

/**
 * Clear ONLY refresh token
 * (used when revoking session)
 */
export const clearRefreshTokenCookie = (res) => {
    if (!res) throw new Error('Response object is required')

    Token.removeRefreshTokenCookie(res)
}

/**
 * Clear ONLY access token
 */
export const clearAccessTokenCookie = (res) => {
    if (!res) throw new Error('Response object is required')
    Token.removeAccessTokenCookie(res)
}
