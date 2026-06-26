import { NextRequest, NextResponse } from "next/server";
import { PosService } from "@/features/pos/services/pos.service";
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
    return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    const invoice = await PosService.createSale(input);
    return NextResponse.json(invoice, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create sale";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
