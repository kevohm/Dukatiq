import { Topbar } from '@/components/layout/Topbar'
import { Badge } from '@/components/ui/Badge'
import SaleView from '@/features/sales/components/SaleView'
import { useGetSale } from '@/features/sales/hooks'
import type { Sale } from '@/features/sales/types'
import { formatDate } from '@/utils/time'
import { useParams } from '@tanstack/react-router'

const SingleSale = () => {
    const { id } = useParams({ from: '/_dashboard/sales/view/$id' })
    const { data, isLoading, isError } = useGetSale(id)
    if (isLoading) return <div className="p-6">Loading sale...</div>
    if (isError)
        return <div className="p-6 text-red-500">Failed to load sale</div>
    console.log(data)
    return (
        <div>
            <Topbar
                title={
                    <div className="flex items-center gap-5">
                        <h1 className="text-2xl font-bold">Sale</h1>
                    </div>
                }
                subTitle={
                    data?.created_at ? formatDate(data?.created_at) : undefined
                }
            />

            <div className="px-6">
                {data && <SaleView sale={data as Sale} />}
            </div>
        </div>
    )
}

export default SingleSale
