


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


export interface ILocalAccessPayload {
    full_name: string
    email: string
    password: string
    recoveryQuestions: {
        question: string
        answer: string
         code:string
    }[]
}


export interface ILocalAccessQuestion {
    id: string
    user_local_access_id: string
    question: string
    code: string
    answer: string
}

export interface ILocalAccessResponse {
    id: string
    user_id: string
    password: string
    questions: ILocalAccessQuestion[]
}


export interface IOLocalAccessPayload extends ILocalAccessResponse{} 


export interface IVerifyLocalAccessPayload {
    user_id: string
    password: string
}

