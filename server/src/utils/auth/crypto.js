
import argon2 from 'argon2'
import crypto from "crypto"

export const hashToken = (data) => argon2.hash(data)

export const verifyToken = (hashValue, plain) => argon2.verify(hashValue, plain)

export const generateToken = () => crypto.randomBytes(40).toString('hex')
