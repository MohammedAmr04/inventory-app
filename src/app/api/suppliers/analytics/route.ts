import { NextResponse } from "next/server";
import { SupplierAnalyticsService } from "@/features/suppliers/services/supplier-analytics.service";

export async function GET() {
  try {
    const analytics = await SupplierAnalyticsService.getAnalytics();
    return NextResponse.json(analytics);
  } catch {
    return NextResponse.json({ error: "Failed to fetch supplier analytics" }, { status: 500 });
  }
}
