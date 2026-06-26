import { NextRequest, NextResponse } from "next/server";
import { StockAdjustmentService } from "@/features/inventory/services/stock-adjustment.service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  try {
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : undefined;
    const pageSize = searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : undefined;
    const adjustments = await StockAdjustmentService.getAll(page, pageSize);
    return NextResponse.json(adjustments);
  } catch {
    return NextResponse.json({ error: "Failed to fetch stock adjustments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    const adjustment = await StockAdjustmentService.create(input);
    return NextResponse.json(adjustment, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create stock adjustment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
