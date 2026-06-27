// utils/jwt.js
import jwt from 'jsonwebtoken'

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET

export const signAccessToken = (user) => {
    return jwt.sign({ sub: user.id }, ACCESS_SECRET, { expiresIn: '15m' })
}

export const verifyAccessToken = (token) => jwt.verify(token, ACCESS_SECRET)


