import { useParams } from '@tanstack/react-router'
import AppBodyWrapper from '../../components/layout/AppBodyWrapper'
import { Topbar } from '../../components/layout/Topbar'
import EditProductForm from '../../features/product/components/EditProductForm'
import EditExpenseForm from '../../features/expenses/components/EditProductForm'

const EditExpense = () => {
    const { id } = useParams({ from: '/expenses/edit/$id' })

    return (
        <AppBodyWrapper>
            <Topbar title={'Edit Product'} />
            <div className="px-6">
                <EditExpenseForm id={id} />
            </div>
        </AppBodyWrapper>
    )
}

export default EditExpense
