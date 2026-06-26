import { NextRequest, NextResponse } from "next/server";
import { SalesInvoiceRepository } from "@/features/pos/repositories/sales-invoice.repository";
import { InvoiceItemRepository } from "@/features/pos/repositories/invoice-item.repository";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoice = await SalesInvoiceRepository.findById(Number(id));
    if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const items = await InvoiceItemRepository.findByInvoiceId(Number(id));
    return NextResponse.json({ ...invoice, items });
  } catch {
    return NextResponse.json({ error: "Failed to fetch invoice" }, { status: 500 });
  }
}
