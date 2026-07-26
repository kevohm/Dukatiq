import { Link, useParams } from '@tanstack/react-router'

import AppBodyWrapper from '../../components/layout/AppBodyWrapper'
import { Topbar } from '../../components/layout/Topbar'
import { useProduct } from '../../features/product/hooks'
import LoadingSection from '../../components/shared/LoadingSection'
import ProductView from '../../features/product/components/ProductView'
import { Pencil } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'

const SingleProduct = () => {
    const { id } = useParams({ from: "/_dashboard/products/brand/view/$id" })
    const productQuery = useProduct(id)
    // console.log(productQuery?.data)
    if (productQuery?.isLoading) {
        return <LoadingSection title="Fetching products" />
    }
    return (
        <AppBodyWrapper>
            <Topbar
                title={
                    <div className="flex gap-2.5">
                        <h1 className="text-2xl font-bold">
                            {productQuery?.data?.name}
                        </h1>
                        <div className="flex gap-2 mt-2">
                            <Badge>{
                            //@ts-ignore
                            productQuery?.data?.category.name}</Badge>
                            <Badge color="blue">
                                {//@ts-ignore
                                productQuery?.data?.brand.name}
                            </Badge>
                        </div>
                    </div>
                }

                actions={
                    <Link to="/products/edit/$id" params={{ id }}>
                        <Button variant="primary">
                            <Pencil className="w-4 h-4" />
                            Edit
                        </Button>
                    </Link>
                }
            />
            <div className="px-6">
                {productQuery?.data && (
                    //@ts-ignore
                    <ProductView product={productQuery?.data} />
                )}
            </div>
        </AppBodyWrapper>
    )
}

export default SingleProduct
