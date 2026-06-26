import { NextRequest, NextResponse } from "next/server";
import { SalesInvoiceRepository } from "@/features/pos/repositories/sales-invoice.repository";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  try {
    const filters = {
      search: searchParams.get("search") ?? undefined,
      dateFrom: searchParams.get("dateFrom") ?? undefined,
      dateTo: searchParams.get("dateTo") ?? undefined,
      paymentMethod: searchParams.get("paymentMethod") as
        | "cash"
        | "card"
        | "mixed"
        | undefined,
      page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
      pageSize: searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : undefined,
      sortBy: searchParams.get("sortBy") ?? undefined,
      sortOrder: searchParams.get("sortOrder") as "asc" | "desc" | undefined,
    };
    const invoices = await SalesInvoiceRepository.findAll(filters);
    return NextResponse.json(invoices);
  } catch {
    return NextResponse.json({ error: "Failed to fetch sales history" }, { status: 500 });
  }
}
