import { NextRequest, NextResponse } from "next/server";
import { SupplierLedgerService } from "@/features/suppliers/services/supplier-ledger.service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const supplierId = searchParams.get("supplierId");
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : undefined;
  const pageSize = searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : undefined;

  if (!supplierId) {
    return NextResponse.json({ error: "supplierId is required" }, { status: 400 });
  }

  try {
    const ledger = await SupplierLedgerService.getBySupplierId(Number(supplierId), page, pageSize);
    return NextResponse.json(ledger);
  } catch {
    return NextResponse.json({ error: "Failed to fetch supplier ledger" }, { status: 500 });
  }
}
