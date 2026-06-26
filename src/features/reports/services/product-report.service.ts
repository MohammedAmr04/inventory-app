import { getDb } from "@/lib/db";
import { invoiceItems, products, salesInvoices } from "@/lib/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import type { ProductReport, TopSellingProduct, MostProfitableProduct, DeadStockItem, LowStockItem } from "../types";
import { DEAD_STOCK_DAYS } from "../constants";

export const ProductReportService = {
  async get(): Promise<ProductReport> {
    const db = await getDb();

    const topSellingRaw = await db
      .select({
        productId: invoiceItems.productId,
        productName: products.name,
        totalQuantity: sql<number>`COALESCE(SUM(${invoiceItems.quantity}), 0)`,
        totalRevenue: sql<number>`COALESCE(SUM(${invoiceItems.lineTotal}), 0)`,
      })
      .from(invoiceItems)
      .innerJoin(products, eq(invoiceItems.productId, products.id))
      .groupBy(invoiceItems.productId)
      .orderBy(desc(sql`COALESCE(SUM(${invoiceItems.quantity}), 0)`))
      .limit(20);

    const topSelling: TopSellingProduct[] = topSellingRaw.map((r) => ({
      productId: r.productId,
      productName: r.productName,
      totalQuantity: Number(r.totalQuantity),
      totalRevenue: Number(r.totalRevenue),
    }));

    const mostProfitableRaw = await db
      .select({
        productId: invoiceItems.productId,
        productName: products.name,
        totalProfit: sql<number>`COALESCE(SUM((${invoiceItems.salePrice} - ${products.costPrice}) * ${invoiceItems.quantity}), 0)`,
        totalRevenue: sql<number>`COALESCE(SUM(${invoiceItems.lineTotal}), 0)`,
      })
      .from(invoiceItems)
      .innerJoin(products, eq(invoiceItems.productId, products.id))
      .groupBy(invoiceItems.productId)
      .orderBy(desc(sql`COALESCE(SUM((${invoiceItems.salePrice} - ${products.costPrice}) * ${invoiceItems.quantity}), 0)`))
      .limit(20);

    const mostProfitable: MostProfitableProduct[] = mostProfitableRaw.map((r) => {
      const revenue = Number(r.totalRevenue);
      const profit = Number(r.totalProfit);
      return {
        productId: r.productId,
        productName: r.productName,
        totalProfit: profit,
        totalRevenue: revenue,
        margin: revenue > 0 ? (profit / revenue) * 100 : 0,
      };
    });

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - DEAD_STOCK_DAYS);
    const cutoff = cutoffDate.toISOString();

    const deadStockRaw = await db
      .select({
        id: products.id,
        name: products.name,
        barcode: products.barcode,
        stock: products.stock,
        lastSaleDate: sql<string | null>`MAX(${salesInvoices.createdAt})`,
      })
      .from(products)
      .leftJoin(invoiceItems, eq(products.id, invoiceItems.productId))
      .leftJoin(salesInvoices, eq(invoiceItems.salesInvoiceId, salesInvoices.id))
      .where(
        and(
          eq(products.isActive, true),
          eq(products.type, "physical"),
          sql`${products.stock} > 0`
        )
      )
      .groupBy(products.id)
      .having(sql`COALESCE(MAX(${salesInvoices.createdAt}), '1970-01-01') < ${cutoff}`);

    const deadStock: DeadStockItem[] = deadStockRaw.map((r) => {
      const lastSale = r.lastSaleDate ?? null;
      const daysSince = lastSale
        ? Math.floor((Date.now() - new Date(lastSale).getTime()) / (1000 * 60 * 60 * 24))
        : DEAD_STOCK_DAYS + 1;
      return { id: r.id, name: r.name, barcode: r.barcode, stock: Number(r.stock), lastSaleDate: lastSale, daysSinceLastSale: daysSince };
    });

    const lowStockRaw = await db
      .select({
        id: products.id,
        name: products.name,
        stock: products.stock,
        lowStockThreshold: products.lowStockThreshold,
      })
      .from(products)
      .where(
        and(
          eq(products.isActive, true),
          sql`${products.lowStockThreshold} IS NOT NULL`,
          sql`${products.stock} <= ${products.lowStockThreshold}`
        )
      )
      .orderBy(desc(sql`${products.lowStockThreshold} - ${products.stock}`))
      .limit(50);

    const lowStock: LowStockItem[] = lowStockRaw.map((r) => ({
      id: r.id,
      name: r.name,
      stock: Number(r.stock),
      lowStockThreshold: Number(r.lowStockThreshold),
    }));

    return { topSelling, mostProfitable, deadStock, lowStock };
  },
};
