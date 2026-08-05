import type { MangoQuerySelector } from 'rxdb'

type Filter = {
    key: string
    value: string
}

type QueryBuilderArgs = {
    filters: Filter[]
}

export function baseQueryBuilder(
    query: any = {},
    { filters = [] }: QueryBuilderArgs
) {
    const q: MangoQuerySelector<any> = {}

    if (filters?.length > 0) {
        for (const filter of filters) {
            if (filter?.value?.includes(':')) {
                const operator = filter?.value
                query[filter?.key] = { [operator]: query[filter?.key] }
            } else {
                query[filter?.key] = query[filter?.key]
            }
        }
    }
    return q
}
