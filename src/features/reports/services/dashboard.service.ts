import { getDb } from "@/lib/db";
import { salesInvoices, invoiceItems, products, expenses, suppliers } from "@/lib/db/schema";
import { eq, and, sql, count } from "drizzle-orm";
import type { DashboardData } from "../types";

export const DashboardService = {
  async get(): Promise<DashboardData> {
    const db = await getDb();
    const today = new Date().toISOString().slice(0, 10);

    const [salesResult] = await db
      .select({
        todaySales: sql<number>`COALESCE(SUM(${salesInvoices.netTotal}), 0)`,
      })
      .from(salesInvoices)
      .where(sql`date(${salesInvoices.createdAt}) = ${today}`);

    const todaySales = salesResult?.todaySales ?? 0;

    const [expenseResult] = await db
      .select({
        todayExpenses: sql<number>`COALESCE(SUM(${expenses.amount}), 0)`,
      })
      .from(expenses)
      .where(sql`date(${expenses.expenseDate}) = ${today}`);

    const todayExpenses = expenseResult?.todayExpenses ?? 0;

    const todayCogsResult = await db
      .select({
        cogs: sql<number>`COALESCE(SUM(${invoiceItems.quantity} * ${products.costPrice}), 0)`,
      })
      .from(invoiceItems)
      .innerJoin(products, eq(invoiceItems.productId, products.id))
      .innerJoin(salesInvoices, eq(invoiceItems.salesInvoiceId, salesInvoices.id))
      .where(sql`date(${salesInvoices.createdAt}) = ${today}`);

    const todayCogs = todayCogsResult[0]?.cogs ?? 0;

    const [totalRevenueResult] = await db
      .select({
        total: sql<number>`COALESCE(SUM(${salesInvoices.netTotal}), 0)`,
      })
      .from(salesInvoices);

    const totalRevenue = totalRevenueResult?.total ?? 0;

    const [payablesResult] = await db
      .select({
        total: sql<number>`COALESCE(SUM(${suppliers.currentBalance}), 0)`,
      })
      .from(suppliers);

    const totalOutstandingPayables = payablesResult?.total ?? 0;

    const [productCountResult] = await db
      .select({ count: count() })
      .from(products);

    const totalProducts = productCountResult?.count ?? 0;

    const [lowStockResult] = await db
      .select({ count: count() })
      .from(products)
      .where(
        and(
          eq(products.isActive, true),
          sql`${products.stock} <= ${products.lowStockThreshold}`
        )
      );

    const lowStockCount = lowStockResult?.count ?? 0;

    return {
      todaySales,
      todayExpenses,
      todayProfit: todaySales - todayCogs - todayExpenses,
      totalRevenue,
      totalOutstandingPayables,
      totalProducts,
      lowStockCount,
    };
  },
};
