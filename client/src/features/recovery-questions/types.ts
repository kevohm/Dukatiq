interface IRecoveryQuestion {
    question: string
    answer: string
    code: string
}

export type IRecoveryQuestionsPayload = IRecoveryQuestion[]

export type IRecoveryQuestionsResponse = IRecoveryQuestion[]