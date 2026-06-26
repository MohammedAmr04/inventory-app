export interface Unit {
  id: number;
  name: string;
  symbol: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUnitInput {
  name: string;
  symbol: string;
}

export interface UpdateUnitInput {
  name?: string;
  symbol?: string;
  isActive?: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export type ProductType = "physical" | "service";

export interface Product {
  id: number;
  name: string;
  barcode: string | null;
  type: ProductType;
  categoryId: number | null;
  unitId: number | null;
  costPrice: number;
  salePrice: number;
  stock: number;
  lowStockThreshold: number | null;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  categoryName: string | null;
  unitName: string | null;
}

export interface CreateProductInput {
  name: string;
  barcode?: string;
  type: ProductType;
  categoryId?: number | null;
  unitId?: number | null;
  costPrice: number;
  salePrice: number;
  stock?: number;
  lowStockThreshold?: number;
  description?: string;
}

export interface UpdateProductInput {
  name?: string;
  barcode?: string;
  type?: ProductType;
  categoryId?: number | null;
  unitId?: number | null;
  costPrice?: number;
  salePrice?: number;
  stock?: number;
  lowStockThreshold?: number;
  description?: string;
  isActive?: boolean;
}

export type StockAdjustmentType = "increase" | "decrease" | "set";

export interface StockAdjustment {
  id: number;
  productId: number;
  type: StockAdjustmentType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string | null;
  createdAt: string;
  productName: string | null;
}

export interface CreateStockAdjustmentInput {
  productId: number;
  type: StockAdjustmentType;
  quantity: number;
  reason?: string;
}

export interface ProductFilters {
  search?: string;
  categoryId?: number | null;
  type?: ProductType | null;
  isActive?: boolean | null;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
