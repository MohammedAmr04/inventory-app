import { getDb } from "@/lib/db";
import { salesInvoices } from "@/lib/db/schema";
import { sql, and, type SQL } from "drizzle-orm";
import type { SalesReport, ReportFilters } from "../types";

export const SalesReportService = {
  async get(filters?: ReportFilters): Promise<SalesReport> {
    const db = await getDb();
    const conditions: SQL[] = [];
    if (filters?.dateFrom) conditions.push(sql`${salesInvoices.createdAt} >= ${filters.dateFrom}`);
    if (filters?.dateTo) conditions.push(sql`${salesInvoices.createdAt} <= ${filters.dateTo}`);

    const dateWhere = conditions.length > 0 ? and(...conditions) : undefined;

    const dailySales = await db
      .select({
        date: sql<string>`date(${salesInvoices.createdAt})`,
        total: sql<number>`COALESCE(SUM(${salesInvoices.netTotal}), 0)`,
        count: sql<number>`COUNT(*)`,
      })
      .from(salesInvoices)
      .where(dateWhere)
      .groupBy(sql`date(${salesInvoices.createdAt})`)
      .orderBy(sql`date(${salesInvoices.createdAt}) DESC`)
      .limit(30);

    const monthlySales = await db
      .select({
        month: sql<string>`strftime('%Y-%m', ${salesInvoices.createdAt})`,
        total: sql<number>`COALESCE(SUM(${salesInvoices.netTotal}), 0)`,
        count: sql<number>`COUNT(*)`,
      })
      .from(salesInvoices)
      .where(dateWhere)
      .groupBy(sql`strftime('%Y-%m', ${salesInvoices.createdAt})`)
      .orderBy(sql`strftime('%Y-%m', ${salesInvoices.createdAt}) DESC`)
      .limit(12);

    const paymentMethodBreakdown = await db
      .select({
        method: salesInvoices.paymentMethod,
        total: sql<number>`COALESCE(SUM(${salesInvoices.netTotal}), 0)`,
        count: sql<number>`COUNT(*)`,
      })
      .from(salesInvoices)
      .where(dateWhere)
      .groupBy(salesInvoices.paymentMethod);

    return { dailySales, monthlySales, paymentMethodBreakdown };
  },
};
