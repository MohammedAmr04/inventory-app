import { getDb } from "@/lib/db";
import { salesInvoices, invoiceItems, products, expenses } from "@/lib/db/schema";
import { eq, sql, and, type SQL } from "drizzle-orm";
import type { ProfitLossData, ReportFilters } from "../types";

export const ProfitLossService = {
  async get(filters?: ReportFilters): Promise<ProfitLossData> {
    const db = await getDb();
    const conditions: SQL[] = [];
    if (filters?.dateFrom) conditions.push(sql`${salesInvoices.createdAt} >= ${filters.dateFrom}`);
    if (filters?.dateTo) conditions.push(sql`${salesInvoices.createdAt} <= ${filters.dateTo}`);

    const dateWhere = conditions.length > 0 ? and(...conditions) : undefined;

    const [revenueResult] = await db
      .select({
        total: sql<number>`COALESCE(SUM(${salesInvoices.netTotal}), 0)`,
      })
      .from(salesInvoices)
      .where(dateWhere);

    const totalRevenue = revenueResult?.total ?? 0;

    const [cogsResult] = await db
      .select({
        total: sql<number>`COALESCE(SUM(${invoiceItems.quantity} * ${products.costPrice}), 0)`,
      })
      .from(invoiceItems)
      .innerJoin(products, eq(invoiceItems.productId, products.id))
      .innerJoin(salesInvoices, eq(invoiceItems.salesInvoiceId, salesInvoices.id))
      .where(dateWhere);

    const cogs = cogsResult?.total ?? 0;

    let expenseConditions: SQL[] = [];
    if (filters?.dateFrom) expenseConditions.push(sql`${expenses.expenseDate} >= ${filters.dateFrom}`);
    if (filters?.dateTo) expenseConditions.push(sql`${expenses.expenseDate} <= ${filters.dateTo}`);

    const expenseWhere = expenseConditions.length > 0 ? and(...expenseConditions) : undefined;

    const [expenseResult] = await db
      .select({
        total: sql<number>`COALESCE(SUM(${expenses.amount}), 0)`,
      })
      .from(expenses)
      .where(expenseWhere);

    const operatingExpenses = expenseResult?.total ?? 0;

    const grossProfit = totalRevenue - cogs;
    const netProfit = grossProfit - operatingExpenses;

    return {
      totalRevenue,
      cogs,
      grossProfit,
      grossMargin: totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0,
      operatingExpenses,
      netProfit,
      netMargin: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0,
      period: {
        from: filters?.dateFrom ?? "all time",
        to: filters?.dateTo ?? "all time",
      },
    };
  },
};
