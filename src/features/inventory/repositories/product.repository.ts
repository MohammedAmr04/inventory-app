import { getDb } from "@/lib/db";
import { products, categories, units } from "@/lib/db/schema";
import { eq, like, and, or, sql, count, type SQL } from "drizzle-orm";
import type { Product, CreateProductInput, UpdateProductInput, ProductFilters, PaginatedResult } from "../types";

export const ProductRepository = {
  async findAll(filters?: ProductFilters): Promise<PaginatedResult<Product>> {
    const db = await getDb();
    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 20;
    const offset = (page - 1) * pageSize;

    const conditions: SQL[] = [eq(products.isActive, true)];

    if (filters?.search) {
      const searchCondition = or(
        like(products.name, `%${filters.search}%`),
        like(products.barcode, `%${filters.search}%`),
      );
      if (searchCondition) conditions.push(searchCondition);
    }

    if (filters?.categoryId !== undefined && filters?.categoryId !== null) {
      conditions.push(eq(products.categoryId, filters.categoryId));
    }

    if (filters?.type) {
      conditions.push(eq(products.type, filters.type));
    }

    const whereClause = and(...conditions);

    const totalResult = await db
      .select({ count: count() })
      .from(products)
      .where(whereClause);

    const total = totalResult[0]?.count ?? 0;

    const items = await db
      .select({
        id: products.id,
        name: products.name,
        barcode: products.barcode,
        type: products.type,
        categoryId: products.categoryId,
        unitId: products.unitId,
        costPrice: products.costPrice,
        salePrice: products.salePrice,
        stock: products.stock,
        lowStockThreshold: products.lowStockThreshold,
        description: products.description,
        isActive: products.isActive,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        categoryName: categories.name,
        unitName: units.name,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(units, eq(products.unitId, units.id))
      .where(whereClause)
      .orderBy(products.name)
      .limit(pageSize)
      .offset(offset);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  },

  async findById(id: number): Promise<Product | undefined> {
    const db = await getDb();
    const result = await db
      .select({
        id: products.id,
        name: products.name,
        barcode: products.barcode,
        type: products.type,
        categoryId: products.categoryId,
        unitId: products.unitId,
        costPrice: products.costPrice,
        salePrice: products.salePrice,
        stock: products.stock,
        lowStockThreshold: products.lowStockThreshold,
        description: products.description,
        isActive: products.isActive,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        categoryName: categories.name,
        unitName: units.name,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(units, eq(products.unitId, units.id))
      .where(eq(products.id, id))
      .limit(1);

    return result[0];
  },

  async findByBarcode(barcode: string): Promise<Product | undefined> {
    const db = await getDb();
    const result = await db
      .select({
        id: products.id,
        name: products.name,
        barcode: products.barcode,
        type: products.type,
        categoryId: products.categoryId,
        unitId: products.unitId,
        costPrice: products.costPrice,
        salePrice: products.salePrice,
        stock: products.stock,
        lowStockThreshold: products.lowStockThreshold,
        description: products.description,
        isActive: products.isActive,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        categoryName: categories.name,
        unitName: units.name,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(units, eq(products.unitId, units.id))
      .where(eq(products.barcode, barcode))
      .limit(1);

    return result[0];
  },

  async searchBarcode(query: string): Promise<Product[]> {
    const db = await getDb();
    return db
      .select({
        id: products.id,
        name: products.name,
        barcode: products.barcode,
        type: products.type,
        categoryId: products.categoryId,
        unitId: products.unitId,
        costPrice: products.costPrice,
        salePrice: products.salePrice,
        stock: products.stock,
        lowStockThreshold: products.lowStockThreshold,
        description: products.description,
        isActive: products.isActive,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        categoryName: categories.name,
        unitName: units.name,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(units, eq(products.unitId, units.id))
      .where(
        and(
          eq(products.isActive, true),
          like(products.barcode, `%${query}%`),
        )
      )
      .orderBy(products.name)
      .limit(20);
  },

  async create(input: CreateProductInput): Promise<Product> {
    const db = await getDb();
    const result = await db.insert(products).values(input).returning();
    const row = result[0];
    return { ...row, categoryName: null, unitName: null };
  },

  async update(id: number, input: UpdateProductInput): Promise<Product | undefined> {
    const db = await getDb();
    const result = await db.update(products).set(input).where(eq(products.id, id)).returning();
    if (!result[0]) return undefined;
    return { ...result[0], categoryName: null, unitName: null };
  },

  async archive(id: number): Promise<void> {
    const db = await getDb();
    await db.update(products).set({ isActive: false }).where(eq(products.id, id));
  },

  async delete(id: number): Promise<void> {
    const db = await getDb();
    await db.delete(products).where(eq(products.id, id));
  },

  async countLowStock(): Promise<number> {
    const db = await getDb();
    const result = await db
      .select({ count: count() })
      .from(products)
      .where(
        and(
          eq(products.type, "physical"),
          eq(products.isActive, true),
          sql`${products.stock} <= ${products.lowStockThreshold}`,
        )
      );
    return result[0]?.count ?? 0;
  },

  async findLowStock(page = 1, pageSize = 20): Promise<PaginatedResult<Product>> {
    const db = await getDb();
    const offset = (page - 1) * pageSize;

    const conditions = and(
      eq(products.type, "physical"),
      eq(products.isActive, true),
      sql`${products.stock} <= ${products.lowStockThreshold}`,
    );

    const totalResult = await db
      .select({ count: count() })
      .from(products)
      .where(conditions);

    const total = totalResult[0]?.count ?? 0;

    const items = await db
      .select({
        id: products.id,
        name: products.name,
        barcode: products.barcode,
        type: products.type,
        categoryId: products.categoryId,
        unitId: products.unitId,
        costPrice: products.costPrice,
        salePrice: products.salePrice,
        stock: products.stock,
        lowStockThreshold: products.lowStockThreshold,
        description: products.description,
        isActive: products.isActive,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        categoryName: categories.name,
        unitName: units.name,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(units, eq(products.unitId, units.id))
      .where(conditions)
      .orderBy(products.stock)
      .limit(pageSize)
      .offset(offset);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  },
};
