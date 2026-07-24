


export interface User {
    full_name: string
    id: string
    email: string
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
