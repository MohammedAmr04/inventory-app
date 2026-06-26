import { NextRequest, NextResponse } from "next/server";
import { SupplierPaymentService } from "@/features/suppliers/services/supplier-payment.service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const supplierId = searchParams.get("supplierId");
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : undefined;
  const pageSize = searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : undefined;

  try {
    const payments = await SupplierPaymentService.getAll(
      supplierId ? Number(supplierId) : undefined,
      page,
      pageSize,
    );
    return NextResponse.json(payments);
  } catch {
    return NextResponse.json({ error: "Failed to fetch supplier payments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    const payment = await SupplierPaymentService.create(input);
    return NextResponse.json(payment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create supplier payment" }, { status: 500 });
  }
}
