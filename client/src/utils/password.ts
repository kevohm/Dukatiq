
export async function hashPassword(password: string) {
    const encoder = new TextEncoder()
    const salt = crypto.getRandomValues(new Uint8Array(32))

    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveBits']
    )

    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt,
            iterations: 600000,
            hash: 'SHA-256',
        },
        keyMaterial,
        256
    )

    return {
        password_hash: arrayBufferToBase64(derivedBits),
        password_salt: arrayBufferToBase64(salt),
        iterations: 600000,
    }
}

export async function verifyPassword(
    password: string,
    storedHash: string,
    storedSalt: string,
    iterations: number
): Promise<boolean> {
    const encoder = new TextEncoder()
    const salt = base64ToUint8Array(storedSalt)
    const expectedHashBytes = base64ToUint8Array(storedHash)

    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveBits']
    )


    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt.buffer as ArrayBuffer, // Fixed type constraint,
            iterations,
            hash: 'SHA-256',
        },
        keyMaterial,
        256
    )

    const computedHashBytes = new Uint8Array(derivedBits)

    // Constant-time comparison to prevent timing side-channel attacks
    return timingSafeEqual(computedHashBytes, expectedHashBytes)
}

/**
 * Helper: Constant-time byte array comparison
 */
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) {
        return false
    }
    let result = 0
    for (let i = 0; i < a.length; i++) {
        result |= a[i] ^ b[i]
    }
    return result === 0
}

/**
 * Fast Base64 Helpers
 */
function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    const len = bytes.byteLength
    for (let i = 0; i < len; i += 1024) {
        binary += String.fromCharCode.apply(
            null,
            bytes.subarray(i, i + 1024) as unknown as number[]
        )
    }
    return btoa(binary)
}

function base64ToUint8Array(base64: string): Uint8Array {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
    }
    return bytes
}
