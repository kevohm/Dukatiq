import { config } from "../../config/env.config.js"

export class cookieConfigs {
    static baseCookieOptions = config.cookie.options
    static refreshToken = {
        ...this.baseCookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }

    static accessToken = {
        ...this.baseCookieOptions,
        maxAge: 15 * 60 * 1000, // 15 minutes
    }

    // Example for non-sensitive cookie
    static preferences = {
        httpOnly: false,
        secure: this.baseCookieOptions.secure,
        sameSite: 'lax',
    }
}

export const setCookie = (res, name, value, config=cookieConfigs.baseCookieOptions) => {
    return res.cookie(name, value, config)
}

export const clearCookie = (res, name, config = cookieConfigs.baseCookieOptions) => {
    return res.clearCookie(name, config)
}


