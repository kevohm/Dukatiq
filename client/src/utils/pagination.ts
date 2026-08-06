import type { MangoQuerySelector } from 'rxdb'

type KeyValue = {
    key: string
    value: string
}

export type IQueryBuilderArgs = {
    filters?: KeyValue[]
    search?: KeyValue
}

export function baseQueryBuilder(
    query: any = {},
    { filters = [], search }: IQueryBuilderArgs = {}
) {
    const q: MangoQuerySelector<any> = {}

    if (filters?.length > 0) {
        // {[]:{}}
        // {[]:{}}
        for (const filter of filters) {
            if (query[filter?.key]) {
                if (filter?.value?.includes('.')) {
                    console.log(filter.value.split('.'))
                    const [field, operator] = filter.value.split('.')
                    q[field] = { [operator]: query[filter?.key] }
                } else {
                    q[filter?.value] = query[filter?.key]
                }
            }
        }
    }

    if (search) {
        // {[]:{}}
        // {[]:{}}
        if (query[search?.key]) {
            if (search?.value?.includes('.')) {
                console.log(search.value.split('.'))
                const [field, operator] = search.value.split('.')
                q[field] = { [operator]: query[search?.key] }
            } else {
                q[search?.value] = query[search?.key]
            }
        }
    }
    return q
}
