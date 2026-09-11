export type DashboardOverview = {
    sales: DashboardSalesSummary
    expenses: DashboardExpenseSummary
    inventory: DashboardInventorySummary
    products: number
    lowStock: number
    netProfit: number
}

export type DashboardSalesSummary = {
    count: number
    totalSales: number
    totalProfit: number
}

export type DashboardExpenseSummary = {
    count: number
    totalAmount: number
}

export type DashboardInventorySummary = {
    totalStock: number
    inventoryValue: number
}

export type DashboardCategory = {
    id: string
    name: string
}

export type DashboardBrand = {
    id: string
    name: string
}

export type DashboardProduct = {
    id: string
    name: string
    image_url?: string | null

    stock_quantity?: number
    low_stock_threshold?: number

    totalSold?: number
    totalProfit?: number
    revenue?: number

    category?: DashboardCategory | null
    brand?: DashboardBrand | null
}
export type DashboardSaleItem = {
    id: string
    quantity: number
    selling_price: number
    profit: number

    unit: {
        id: string
        name: string
    }

    product: {
        id: string
        name: string
        image_url?: string | null
    }
}
export type DashboardSale = {
    id: string
    total_amount: number
    total_profit: number
    payment_method: string
    created_at: string
    items: DashboardSaleItem[]
}

export type DashboardTrendPoint = {
    label: string
    value: number
}

export type DashboardTrend = DashboardTrendPoint[]
