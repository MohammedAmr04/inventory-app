import { NextRequest, NextResponse } from "next/server";
import { SalesReportService } from "@/features/reports/services/sales-report.service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  try {
    const filters = {
      dateFrom: searchParams.get("dateFrom") ?? undefined,
      dateTo: searchParams.get("dateTo") ?? undefined,
    };
    const data = await SalesReportService.get(filters);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch sales report" }, { status: 500 });
  }
}
