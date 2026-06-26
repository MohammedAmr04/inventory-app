import { NextRequest, NextResponse } from "next/server";
import { PurchaseItemRepository } from "@/features/purchases/repositories/purchase-item.repository";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const invoiceId = searchParams.get("invoiceId");

  if (!invoiceId) {
    return NextResponse.json({ error: "invoiceId is required" }, { status: 400 });
  }

  try {
    const items = await PurchaseItemRepository.findByInvoiceId(Number(invoiceId));
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Failed to fetch purchase items" }, { status: 500 });
  }
}
