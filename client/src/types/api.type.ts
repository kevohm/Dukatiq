export type Category = 'clothes' | 'tissues' | 'plastics';

export type ProductStatus = 'healthy' | 'soon' | 'urgent' | 'out';

export type RestockTier = 'urgent' | 'soon';

export type LossFlag = 'low_margin' | 'slow_moving' | 'idle';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: Category;
  cost: number;
  price: number;
  stock: number;
  reorder_point: number;
  sold_count: number;
  last_restock_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Sale {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  unit_cost: number;
  sold_at: string;
  product?: Product;
}

export interface Bundle {
  id: string;
  main_item_id: string;
  addon_item_id: string;
  bundle_price: number;
  discount: number;
  times_sold: number;
  is_active: boolean;
  label: string | null;
  main_item?: Product;
  addon_item?: Product;
}

export interface InventoryAudit {
  id: string;
  product_id: string;
  old_stock: number;
  new_stock: number;
  change_type: 'sale' | 'restock' | 'adjustment';
  changed_at: string;
}

export interface KpiSnapshot {
  revenue: number;
  profit: number;
  margin: number;
  unitsSold: number;
  revenueTrend: number;
  profitTrend: number;
  marginTrend: number;
  unitsTrend: number;
}

export interface DailyPoint {
  date: string;
  revenue: number;
  profit: number;
}

export interface CategorySlice {
  category: string;
  revenue: number;
  profit: number;
  share: number;
}

export interface TopProduct {
  id: string;
  name: string;
  sku: string;
  units: number;
  revenue: number;
  profit: number;
  margin: number;
  profitPerUnit: number;
}

export interface InventoryRow extends Product {
  margin: number;
  stockValue: number;
  health: ProductStatus;
  delta: number;
  weeklySold: number;
  monthlySold: number;
  turnover: number;
}

export interface RestockItem {
  id: string;
  name: string;
  sku: string;
  category: Category;
  stock: number;
  reorder_point: number;
  weeklySold: number;
  margin: number;
  tier: RestockTier;
  suggestedQty: number;
}

export interface LossLeader {
  id: string;
  name: string;
  sku: string;
  category: Category;
  stock: number;
  sales30d: number;
  margin: number;
  monthlyProfit: number;
  flags: LossFlag[];
  suggestedAction: string;
}

export interface AlertItem {
  id: string;
  level: 'urgent' | 'warning' | 'info';
  message: string;
  product_id?: string;
  product_name?: string;
}

export interface BundleSuggestion extends Bundle {
  mainName: string;
  addonName: string;
  totalProfit: number;
  combinedPrice: number;
  savings: number;
}
