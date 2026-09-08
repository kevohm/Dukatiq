export interface User {
    full_name: string
    id: string
    email: string
    has_local_access: boolean
}


export interface IUser {
    full_name: string
    id: string
    email: string
    lastLoginAt: string | null
}

export interface IOCreateUserPayload {
    full_name: string
    id: string
    email: string
    is_active: boolean
}

export interface ILoginPayload {
    email: string
    password: string
}

export interface ISignupPayload {
    first_name: string
    last_name: string
    email: string
    password: string
}

export interface ILocalAccessPayload {
    full_name: string
    email: string
    password: string
}



export interface ILocalAccessResponse {
    id: string
    user_id: string
    password: string
}

export interface IOLocalAccessPayload extends ILocalAccessResponse {}

export interface IVerifyLocalAccessPayload {
    password: string
}
