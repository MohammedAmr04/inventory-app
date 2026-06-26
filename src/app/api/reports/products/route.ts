import { NextResponse } from "next/server";
import { ProductReportService } from "@/features/reports/services/product-report.service";

export async function GET() {
  try {
    const data = await ProductReportService.get();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch product report" }, { status: 500 });
  }
}
