export interface DashboardData {
  todaySales: number;
  todayExpenses: number;
  todayProfit: number;
  totalRevenue: number;
  totalOutstandingPayables: number;
  totalProducts: number;
  lowStockCount: number;
}

export interface SalesReport {
  dailySales: { date: string; total: number; count: number }[];
  monthlySales: { month: string; total: number; count: number }[];
  paymentMethodBreakdown: { method: string; total: number; count: number }[];
}

export interface TopSellingProduct {
  productId: number;
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface MostProfitableProduct {
  productId: number;
  productName: string;
  totalProfit: number;
  totalRevenue: number;
  margin: number;
}

export interface DeadStockItem {
  id: number;
  name: string;
  barcode: string | null;
  stock: number;
  lastSaleDate: string | null;
  daysSinceLastSale: number;
}

export interface LowStockItem {
  id: number;
  name: string;
  stock: number;
  lowStockThreshold: number;
}

export interface ProductReport {
  topSelling: TopSellingProduct[];
  mostProfitable: MostProfitableProduct[];
  deadStock: DeadStockItem[];
  lowStock: LowStockItem[];
}

export interface ProfitLossData {
  totalRevenue: number;
  cogs: number;
  grossProfit: number;
  grossMargin: number;
  operatingExpenses: number;
  netProfit: number;
  netMargin: number;
  period: { from: string; to: string };
}

export interface ReportFilters {
  dateFrom?: string;
  dateTo?: string;
}
