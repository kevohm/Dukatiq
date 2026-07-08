import React from 'react'
import AppBodyWrapper from '../../components/layout/AppBodyWrapper'
import { Topbar } from '../../components/layout/Topbar'
import AddProductForm from '../../features/product/components/AddProductForm'

const AddProduct = () => {
    return (
        <AppBodyWrapper>
            <Topbar title={'Add Product'} />
            <div className='px-6'>
                <AddProductForm />
            </div>
        </AppBodyWrapper>
    )
}

export default AddProduct
