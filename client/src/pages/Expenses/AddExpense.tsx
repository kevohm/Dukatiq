import React from 'react'
import AppBodyWrapper from '../../components/layout/AppBodyWrapper'
import { Topbar } from '../../components/layout/Topbar'
import AddProductForm from '../../features/product/components/AddProductForm'
import AddExpenseForm from '../../features/expenses/components/AddProductForm'

const AddExpense = () => {
    return (
        <AppBodyWrapper>
            <Topbar title={'Add Expense'} />
            <div className='px-6'>
                <AddExpenseForm />
            </div>
        </AppBodyWrapper>
    )
}

export default AddExpense
