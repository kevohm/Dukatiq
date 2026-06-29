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