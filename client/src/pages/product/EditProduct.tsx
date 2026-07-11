import { useParams } from '@tanstack/react-router'
import AppBodyWrapper from '../../components/layout/AppBodyWrapper'
import { Topbar } from '../../components/layout/Topbar'
import EditProductForm from '../../features/product/components/EditProductForm'

const EditProduct = () => {
    const { id } = useParams({ from: '/products/edit/$id' })

    return (
        <AppBodyWrapper>
            <Topbar title={'Edit Product'} />
            <div className="px-6">
                <EditProductForm id={id} />
            </div>
        </AppBodyWrapper>
    )
}

export default EditProduct
