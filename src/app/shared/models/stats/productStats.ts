export interface ProductReduceStatsI {
    transactions_completed: number
}

export interface ProductStatsI {
    product_id: number
    product_name: string
    reduce_stats: ProductReduceStatsI
}
