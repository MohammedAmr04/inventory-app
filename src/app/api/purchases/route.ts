import { NextRequest, NextResponse } from "next/server";
import { PurchaseInvoiceService } from "@/features/purchases/services/purchase-invoice.service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const q = searchParams.get("q");

  try {
    if (id) {
      const invoice = await PurchaseInvoiceService.getById(Number(id));
      if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(invoice);
    }
    if (q) {
      const invoices = await PurchaseInvoiceService.search(q);
      return NextResponse.json(invoices);
    }
    const filters = {
      search: searchParams.get("search") ?? undefined,
      supplierId: searchParams.get("supplierId") ? Number(searchParams.get("supplierId")) : undefined,
      dateFrom: searchParams.get("dateFrom") ?? undefined,
      dateTo: searchParams.get("dateTo") ?? undefined,
      page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
      pageSize: searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : undefined,
      sortBy: searchParams.get("sortBy") as "purchaseDate" | "totalAmount" | "createdAt" | undefined,
      sortOrder: searchParams.get("sortOrder") as "asc" | "desc" | undefined,
    };
    const invoices = await PurchaseInvoiceService.getAll(filters);
    return NextResponse.json(invoices);
  } catch {
    return NextResponse.json({ error: "Failed to fetch purchase invoices" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    const invoice = await PurchaseInvoiceService.create(input);
    return NextResponse.json(invoice, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create purchase invoice" }, { status: 500 });
  }
}
