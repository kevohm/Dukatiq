export const userFactory = (overrides = {}) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    return {
        email: `${unique}@test.com`,
        first_name: 'Kevin',
        last_name: 'Kibet',
        password: 'Kevin',
        ...overrides,
    }
}
export const expenseFactory = (overrides = {}) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    return {
        name: `Expense-${unique}`, // ✅ matches model
        amount: 100 + Math.floor(Math.random() * 900),
        category: `Category-${unique}`, // ✅ matches repository expectation
        ...overrides,
    }
}

export const productFactory = (overrides = {}) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    return {
        name: `Product-${unique}`,
        cost_price: 100 + Math.floor(Math.random() * 500),
        selling_price: 600 + Math.floor(Math.random() * 1000),
        stock: Math.floor(Math.random() * 50) + 1,

        // IMPORTANT: matches ProductRepository.create()
        // It expects `category` as a string name
        category: `Category-${unique}`,

        ...overrides,
    }
}