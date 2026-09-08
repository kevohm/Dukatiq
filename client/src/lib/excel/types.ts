export interface ImportColumn<T> {
    key: keyof T
    label: string
    required?: boolean
    parser?: (value: unknown) => any
    validator?: (value: any) => string | null
}

export interface ImportSchema<T> {
    name: string
    columns: ImportColumn<T>[]
}

