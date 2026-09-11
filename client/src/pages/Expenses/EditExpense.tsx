import { useParams } from '@tanstack/react-router'
import AppBodyWrapper from '../../components/layout/AppBodyWrapper'
import { Topbar } from '../../components/layout/Topbar'
import EditExpenseForm from '../../features/expenses/components/EditProductForm'

const EditExpense = () => {
    const { id } = useParams({ from: '/_dashboard/expenses/edit/$id' })

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
