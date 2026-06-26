import { NextRequest, NextResponse } from "next/server";
import { ProfitLossService } from "@/features/reports/services/profit-loss.service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  try {
    const filters = {
      dateFrom: searchParams.get("dateFrom") ?? undefined,
      dateTo: searchParams.get("dateTo") ?? undefined,
    };
    const data = await ProfitLossService.get(filters);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch profit/loss data" }, { status: 500 });
  }
}
