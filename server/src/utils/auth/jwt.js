import jwt from 'jsonwebtoken'
import { config } from '../../config/env.config.js'


export const signAccessToken = (user) => {
    return jwt.sign({ sub: user.id }, config.auth.accessToken.secret, { expiresIn: config.auth.accessToken.duration })
}

export const verifyAccessToken = (token) =>
    jwt.verify(token, config.auth.accessToken.secret)


