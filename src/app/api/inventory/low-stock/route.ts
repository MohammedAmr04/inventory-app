import { NextRequest, NextResponse } from "next/server";
import { LowStockService } from "@/features/inventory/services/low-stock.service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const count = searchParams.get("count");

  try {
    if (count === "true") {
      const result = await LowStockService.getLowStockCount();
      return NextResponse.json({ count: result });
    }
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : undefined;
    const pageSize = searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : undefined;
    const products = await LowStockService.getLowStockProducts(page, pageSize);
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "Failed to fetch low stock products" }, { status: 500 });
  }
}
